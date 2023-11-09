const db = require("./db_connection");

const delete_items_table_sql = "DELETE FROM items;"
db.execute(delete_items_table_sql);

const delete_centers_table_sql = "DELETE FROM centers;"
db.execute(delete_centers_table_sql);

const delete_center_item_table_sql = "DELETE FROM center_item;"
db.execute(delete_center_item_table_sql);

const delete_students_table_sql = "DELETE FROM students"
db.execute(delete_students_table_sql);

const insert_centers_sql = `
    INSERT INTO centers
        (center_id, center_name, center_town, center_time, center_fee)
    VALUES
        (?, ?, ?, ?, ?);
`

db.execute(insert_centers_sql, [1, 'Cavalry Church', 'Dumont', '60 mins', '25']);
db.execute(insert_centers_sql, [2, 'Leonia Recreation Center', 'Leonia', '60 mins', '30']);
db.execute(insert_centers_sql, [3, 'Ridgefield Park Recreation ADULTS', 'Ridgefield Park', '90 mins', '25']);

const insert_item_sql = `
    INSERT INTO items
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

const insert_centerItem_sql = `
    INSERT INTO center_item
        (client_id, item_id)
    VALUES
        (?, ?);
    `
    db.execute(insert_centerItem_sql, [1, 1]);
    db.execute(insert_centerItem_sql, [1, 8]);
    db.execute(insert_centerItem_sql, [2, 3]);
    db.execute(insert_centerItem_sql, [2, 5]);

    db.end();