// set up the server
const express = require("express");
const logger = require("morgan");
const db = require('./db/db_connection');
const morgan = require('morgan');
const mysql2 = require('mysql2');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const DEBUG = true;

//start the server
app.listen(port, () => {
    console.log(`App server listening on ${port}`);
});

app.set("views", __dirname + "/views")
app.set("view engine", "ejs")

// define middleware that logs all incoming requests
app.use(logger("dev"));

// define middleware that serves static resources in the public directory
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: true }));

//define a route for the default home page
app.get("/", (req, res) => {
    res.render('index');
})

const read_inventory_sql = `
    select inventory_id
    from inventory
    order by inventory_id
`


const read_item_sql = `
    select item_name, item_brand, quantity
    from item
    join inv_item on item.item_id = inv_item.item_id
    where inventory_id = ?
    order by item.item_id;
`

app.get('/inventory/:id', (req, res) => {
    console.log(req.params.id);
    db.execute(read_item_sql, [req.params.id], (error, results) => {
        if (DEBUG)
        console.log(error ? error : results);
    if (error)
        res.status(500).send(error); //Internal Server Error
    else if (results.length == 0)
        res.status(404).send(`No inventory found with id = "${req.params.id}"` );
    else{
    let data = {itemList: results}; // results is still an array, get first (only) element
    res.render('inventory', data);
    } 
    })
  });

const read_detail_sql = `
    select item_name, item_brand, item_count, item_desc
    from items
    where items.item_id = ?
`

//define a route for the details page
app.get("/inventory/detail/:id", (req, res) => {
            db.execute(read_detail_sql, [req.params.id], (error, results) => {
                if (DEBUG)
                    console.log(error ? error : results);
                if (error)
                    res.status(500).send(error); //Internal Server Error
                else if (results.length == 0)
                    res.status(404).send(`No item found with id = "${req.params.id}"` );
                else{
                let data = {item: results[0]}; // results is still an array, get first (only) element
                res.render('detail', data);
                }
        })
})

const read_sessions_sql = `
SELECT loc_name, ses_name
from session
join location on session.loc_id = location.loc_id
order by ses_id
`


//define a route for the schedule page
app.get("/schedule", (req, res) => {
    db.execute(read_sessions_sql, (sesError, sesResults) => {
        if (DEBUG)
            console.log(sesError ? sesError : sesResults);

        if (sesError) {
            res.status(500).send(sesError); // Internal Server Error
            return;
        }

            // Render the 'schedule' view with both sets of results
            res.render('schedule', { sesList: sesResults });
        });
    });

const read_sessions_detail_sql = `
SELECT ses_id, loc_name, ses_name, ses_day, ses_hour, ses_fee
from session
join location on session.loc_id = location.loc_id
where ses_id = ?
`

app.get("/schedule/session/:id", (req, res) => {
            db.execute(read_sessions_detail_sql, [req.params.id], (sesError, sesResults) => {
            if (DEBUG)
                console.log(sesError ? sesError : sesResults);
    
            if (sesError) {
                res.status(500).send(sesError); // Internal Server Error
                return;
            }

            console.log('sesResults:', sesResults);

            if (sesResults.length > 0 && sesResults[0].length > 0) {
                // Render the 'detail view with both sets of results
                res.render('ses_detail', { sesList: sesResults[0] });
            } else {
                // Handle the case where no results are found
                res.status(404).send('Session not found');
            }
            
        });
    });


//define a route for the finance page

const read_costs_sql = `
SELECT item_name, item_total_amt, (item_cost * item_total_amt) AS total_cost, item_desc
FROM item
ORDER BY item_id;
`
const read_rev_sql = `
SELECT s.ses_id AS sesId, s.ses_name AS sesName, SUM(s.ses_fee * IFNULL(ss.stu_attendance, 0)) AS total_revenues
FROM session s
LEFT JOIN student_session ss ON s.ses_id = ss.ses_id
GROUP BY s.ses_id, s.ses_name;
`

app.get("/finances", (req, res) => {
    // Execute the first SQL query to get costs
    db.execute(read_costs_sql, (costsError, costsResults) => {
        if (DEBUG)
            console.log(costsError ? costsError : costsResults);

        if (costsError) {
            res.status(500).send(costsError); // Internal Server Error
            return;
        }

        let cumTotalCost = 0;
        costsResults.forEach((row) => {
            cumTotalCost += row.total_cost;
            row.cum_total_cost = cumTotalCost;
        });

        // Execute the second SQL query to get revenues
        db.execute(read_rev_sql, (revError, revResults) => {
            if (DEBUG)
                console.log(revError ? revError : revResults);

            if (revError) {
                res.status(500).send(revError); // Internal Server Error
                return;
            }

            let cumTotalRevenue = 0;
            revResults.forEach((row) => {
                console.log(row.total_revenues);
                cumTotalRevenue += parseFloat(row.total_revenues);
                console.log(cumTotalRevenue);
            });

            // Render the 'finances' view with both sets of results
            res.render('finances', { costList: costsResults, revList: revResults, cumTC: cumTotalCost, cumTR: cumTotalRevenue });
        });
    });
});

//define route for location page

const read_location_sql = `
    SELECT location.loc_id, loc_name, loc_town, loc_desc, inventory_id
    FROM location
    JOIN inventory ON location.loc_id = inventory.loc_id
    ORDER BY loc_id;
`

app.get("/locations", (req, res) => {
    db.execute(read_location_sql, (error, results) => {
        if (DEBUG)
          console.log(error ? error : results);
        if (error)
          res.status(500).send(error); // Internal Server Error
        else
          res.render('locations', { locList: results });
      });
    });

    const read_loc_detail_sql = `
    select loc_id, loc_name, loc_town, loc_desc
    from location
    where loc_id = ?;`

    //define a route for the details page
app.get("/location/detail/:id", (req, res) => {
    db.execute(read_loc_detail_sql, [req.params.id], (error, results) => {
        if (DEBUG)
            console.log(error ? error : results);
        if (error)
            res.status(500).send(error); //Internal Server Error
        else if (results.length == 0)
            res.status(404).send(`No item found with id = "${req.params.id}"` );
        else{
        let data = {locDet: results[0]}; // results is still an array, get first (only) element
        res.render('loc_detail', data);
        }
})
})

const delete_location_sql = `
    DELETE
    from location
    where loc_id = ?
`
app.get("/location/detail/:id/delete", (req, res) => {
    db.execute(delete_location_sql, [req.params.id], (error, results) => {
        if (DEBUG)
            console.log(error ? error : results);
        if (error)
            res.status(500).send(error); //Internal Server Error
        else {
            res.redirect("/locations");
        }
    })
})

app.get("/favicon.ico", (req, res) => {
    res.sendFile(__dirname + "/views/favicon.png");
})