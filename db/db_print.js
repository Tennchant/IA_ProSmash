const db = require("./db_connection");

const select_items_sql = `
    SELECT * FROM item;`;

db.execute(select_items_sql, 
    (error, results) => {
        if (error) 
            throw error;

        console.log("Table 'items' contents:")
        console.log(results);
    }
);

db.end();