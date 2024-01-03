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

app.use(express.urlencoded({ extended: false }) );

//define a route for the default home page
app.get("/", (req, res) => {
    res.render('index');
})

const read_item_sql = `
    select item.item_id, item_name, item_brand, quantity, inventory_id
    from item
    join inv_item on item.item_id = inv_item.item_id
    where inventory_id = ?
    order by item.item_id;
`
const read_all_item_sql = `
    select *
    from item
    order by item_id
`
app.get('/inventory/:id', (req, res) => {
    const inventoryId = req.params.id;

    // Fetch inventory details
    db.execute(read_item_sql, [inventoryId], (error, inventoryResults) => {
        if (DEBUG)
            console.log(error ? error : inventoryResults);

        if (error) {
            res.status(500).send(error); // Internal Server Error
            return;
        }

        if (inventoryResults.length === 0) {
            res.status(404).send(`No inventory found with id = "${inventoryId}"`);
            return;
        }

        // Fetch all item names
        db.execute(read_all_item_sql, [], (itemError, allItemResults) => {
            if (DEBUG)
                console.log(itemError ? itemError : allItemResults);

            if (itemError) {
                res.status(500).send(itemError); // Internal Server Error
                return;
            }

            const data = {
                itemList: inventoryResults,
                allItemNames: allItemResults
            };1

            res.render('inventory', data);
        });
    });
});

const read_detail_sql = `
    select *
    from item
    where item.item_id = ?
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

const update_inv_sql = `
    UPDATE inv_item
    SET
        item_id = ?,
        quantity = ?
    WHERE
        inventory_id = ? AND item_id = ?;
`;

app.post("/inventory/:id/update", (req, res) => {
    const { id: inventory_id } = req.params;
    const { new_item_id, new_quantity, old_item_id } = req.body;

    db.execute(update_inv_sql, [new_item_id, new_quantity, inventory_id, old_item_id], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).send(error); // Internal Server Error
        } else {
            // Redirect to the /inventory/:id page
            res.redirect(`/inventory/${inventory_id}`);
        }
    });
});

// THIS DOESNT WORK YET T-T
const update_item_sql = `
UPDATE item
SET
    item_name = ?, 
    item_brand = ?,
    item_cost = ?,
    item_desc = ?,
    item_total_amt = ?
WHERE
    item_id = ?
`

app.post("/inventory/detail/:id", ( req, res ) => {
    db.execute(update_item_sql, [req.body.title, req.body.brand, req.body.number, req.body.cost, req.body.description, req.params.id], (error, results) => {
        if (DEBUG)
            console.log(error ? error : results);
        if (error)
            res.status(500).send(error); //Internal Server Error
        else {
            res.redirect(`/inventory/detail/${req.params.id}`);
        }
    });
});

app.get("/items", (req, res) => {
    db.execute(read_all_item_sql, (itemError, itemResults) => {
        if (DEBUG)
            console.log(itemError ? itemError : itemResults);

        if (itemError) {
            res.status(500).send(itemError); // Internal Server Error
            return;
        }

            // Render the 'schedule' view 
            res.render('all_item', { itemList: itemResults });
        });
    });


const delete_item_sql = `
DELETE
from item
where item_id = ?
`
app.get("/inventory/detail/:id/delete", (req, res) => {
    db.execute(delete_item_sql, [req.params.id], (error, results) => {
        if (DEBUG)
            console.log(error ? error : results);
        if (error)
            res.status(500).send(error); //Internal Server Error
        else {
            res.redirect("/locations");
        }
    })
})

const add_item_sql = `
    INSERT INTO item
     (item_name, item_brand, item_total_amt, item_cost, item_desc)
    VALUES
        (?, ?, ?, ?, ?);
`

app.post("/inventory/items", (req, res) => {
    db.execute(add_item_sql, [req.params.id, req.body.name, req.body.brand, req.body.number, req.body.cost, req.body.desc], (error, results) => {
        if (DEBUG)
            console.log(error ? error : results);
        if (error)
            res.status(500).send(error); //Internal Server Error
        else {
            res.redirect(`/inventory/detail/${results.insertId}`);
        }
    })
})

// CODE THIS LATER
const add_inv_sql = `

`

const read_sessions_sql = `
SELECT ses_id, loc_name, ses_name
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

const read_ses_loc_detail_sql = `
SELECT loc_id, loc_name
FROM location
ORDER BY loc_id
`

app.get("/schedule/session/detail/:id", (req, res) => {
    db.execute(read_sessions_detail_sql, [req.params.id], (sesError, sesResults) => {
        if (DEBUG)
            console.log(sesError ? sesError : sesResults);

        if (sesError) {
            res.status(500).send(sesError); // Internal Server Error
            return;
        }

        // Now, fetch locResults
        db.execute(read_ses_loc_detail_sql, [], (locError, locResults) => {
            if (DEBUG)
                console.log(locError ? locError : locResults);

            if (locError) {
                res.status(500).send(locError); // Internal Server Error
                return;
            }

            console.log('locResults:', locResults);
            console.log('sesResults:', sesResults[0]);

            // Render the 'detail view with results
            res.render('ses_detail', { sesList: sesResults[0], locList: locResults });
        });
    });
});

const delete_session_sql = `
DELETE
from session
where ses_id = ?
`
app.get("/schedule/session/detail/:id/delete", (req, res) => {
    db.execute(delete_session_sql, [req.params.id], (error, results) => {
        if (DEBUG)
            console.log(error ? error : results);
        if (error)
            res.status(500).send(error); //Internal Server Error
        else {
            res.redirect("/schedule");
        }
    })
})

const update_session_sql = `
UPDATE session
SET
    ses_name = ?,
    loc_id = ?,
    ses_day = ?,
    ses_hour = ?,
    ses_fee = ?
WHERE
    ses_id = ?
`
app.post("/schedule/session/detail/:id", ( req, res ) => {
    db.execute(update_session_sql, [req.body.title, req.body.location, req.body.day, req.body.hour, req.body.fee, req.params.id], (error, results) => {
        if (DEBUG)
            console.log(error ? error : results);
        if (error)
            res.status(500).send(error); //Internal Server Error
        else {
            res.redirect(`/schedule/session/detail/${req.params.id}`);
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
app.get("/locations/detail/:id", (req, res) => {
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
app.get("/locations/detail/:id/delete", (req, res) => {
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

const add_location_sql = `
    INSERT INTO location
     (loc_name, loc_town, loc_desc)
    VALUES
        (?, ?, ?);
`

app.post("/locations", (req, res) => {
    db.execute(add_location_sql, [req.body.name, req.body.town, req.body.desc], (error, results) => {
        if (DEBUG)
            console.log(error ? error : results);
        if (error)
            res.status(500).send(error); //Internal Server Error
        else {
            res.redirect(`/locations/detail/${results.insertId}`);
        }
    })
})


app.get("/favicon.ico", (req, res) => {
    res.sendFile(__dirname + "/views/favicon.png");
})