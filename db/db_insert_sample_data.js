const db = require("./db_connection");

const delete_inventory_table_sql = "DELETE FROM inventory;"
db.execute(delete_inventory_table_sql);

const delete_client_table_sql = "DELETE FROM client;"
db.execute(delete_client_table_sql);

const delete_client_item_table_sql = "DELETE FROM client_item;"
db.execute(delete_client_item_table_sql);

const insert_client_sql = `
    INSERT INTO client
        (client_id, client_first_name, client_last_name, client_time, client_day)
    VALUES
        (?, ?, ?, ?, ?);
`

db.execute(insert_client_sql, [1, 'Martha', 'Becky', '60 mins', 'Monday']);
db.execute(insert_client_sql, [2, 'Eiliyah', 'Sarowar', '30 mins', 'Wednesday']);
db.execute(insert_client_sql, [3, 'Seungkwan', 'Boo', '110 mins', 'Tuesday']);
db.execute(insert_client_sql, [4, 'Tenn', 'Kujou', '20 mins', 'Friday']);

const insert_item_sql = `
    INSERT INTO inventory
        (item_id, item_name, item_brand, item_count, item_desc)
    VALUES
        (?, ?, ?, ?, ?);
`
db.execute(insert_item_sql, [1, 'Ball', 'Joola', 50, 'Generic white 1-star Joola Balls. Good for beginners']);

db.execute(insert_item_sql, [2, 'Premade Paddles', 'Butterfly', 7, 'Generic rackets in case of emergency']);

db.execute(insert_item_sql, [3, 'Balls', 'Butterfly', 25, 'Higher-quality 3-star balls for professional practice.']);

db.execute(insert_item_sql, [4, 'Premade Paddles', 'Joola', 15, 'Generic rackets in case of emergency.']);

db.execute(insert_item_sql, [5, 'Tables', 'Butterfly', 8, 'Bright-blue tables to practice on.']);

db.execute(insert_item_sql, [6, 'Practice Robots', 'iPong', 4, 'Great for stroke practice.']);

db.execute(insert_item_sql, [7, 'Shoes', 'Butterfly', 3, 'Extra Table Tennis shoes for emergencies']);

db.execute(insert_item_sql, [8, 'Ball Catching Net', 'null', 1, 'Homemade net for ball catching']);

const insert_clientItem_sql = `
    INSERT INTO client_item
        (client_id, item_id)
    VALUES
        (?, ?);
    `
    db.execute(insert_clientItem_sql, [1, 1]);
    db.execute(insert_clientItem_sql, [1, 8]);
    db.execute(insert_clientItem_sql, [2, 3]);
    db.execute(insert_clientItem_sql, [2, 5]);
    db.execute(insert_clientItem_sql, [3, 5]);
    db.execute(insert_clientItem_sql, [4, 1]);
    db.execute(insert_clientItem_sql, [4, 2]);

    db.end();