// set up the server
const express = require("express");
const logger = require("morgan");
const db = require('./db/db_connection');
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

//define a route for the default home page
app.get("/", (req, res) => {
    res.render('index');
})

const read_inventory_sql = `
    select item_name, item_brand, item_count
    from inventory
    order by item_id;
`

app.get("/inventory", (req, res) => {
    db.execute(read_inventory_sql, (error, results) => {
        if (DEBUG)
            console.log(error ? error : results);
        if (error)
            res.status(500).send(error); //Internal Server Error
        else{
        let data = { itemList : results };
        res.render('inventory', data);
        }
    })
})

const read_detail_sql = `
    select item_name, item_brand, item_count, item_desc
    from inventory
    where inventory.item_id = ?
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

//define a route for the schedule page
app.get("/schedule", (req, res) => {
    res.render('schedule');
})

app.get("/favicon.ico", (req, res) => {
    res.sendFile(__dirname + "/views/favicon.png");
})