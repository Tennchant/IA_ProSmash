const db = require("./db_connection");

const select_items_sql = `
    SELECT * FROM inventory;`;

db.execute(select_items_sql, 
    (error, results) => {
        if (error) 
            throw error;

        console.log("Table 'inventory' contents:")
        console.log(results);
    }
);

const select_clientItems_sql = `
SELECT client_last_name, item_name
FROM client
JOIN client_item ON client.client_id = client_item.client_id
JOIN inventory ON client_item.item_id = inventory.item_id
ORDER BY client.client_id;
`;

db.execute(select_clientItems_sql, 
    (error, results) => {
        if (error) 
            throw error;

        console.log("Table 'Clients and Items' contents:")
        console.log(results);
    }
);




db.end();