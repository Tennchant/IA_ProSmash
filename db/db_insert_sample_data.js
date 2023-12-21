const db = require("./db_connection");

const delete_item_inventory_sql = "DELETE FROM inv_item;"
const delete_inventory_sql = "DELETE FROM inventory;"
const delete_student_session_sql = "DELETE FROM student_session;"
const delete_item_sql = "DELETE FROM item;"
const delete_session_sql = "DELETE FROM session;"
const delete_student_sql = "DELETE FROM student;"
const delete_location_sql = "DELETE FROM location;"

db.execute(delete_item_inventory_sql);
db.execute(delete_inventory_sql);
db.execute(delete_student_session_sql);
db.execute(delete_item_sql);
db.execute(delete_session_sql);
db.execute(delete_student_sql);
db.execute(delete_location_sql);

const insert_location_sql = `
    INSERT INTO location
        (loc_id, loc_name, loc_town, loc_desc)
    VALUES
        (?, ?, ?, ?);
`

db.execute(insert_location_sql, [1, 'Cavalry Church', 'Dumont', 'Flagship TT center']);
db.execute(insert_location_sql, [2, 'Leonia Recreation Center', 'Leonia', 'Recreation is holding back money']);
db.execute(insert_location_sql, [3, 'Ridgefield Park Recreation', 'Ridgefield Park', 'Offers child and adult classes']);

const insert_item_sql = `
    INSERT INTO item
        (item_id, item_name, item_brand, item_cost, item_desc, item_total_amt)
    VALUES
        (?, ?, ?, ?, ?, ?);
`
db.execute(insert_item_sql, [1, 'Ball', 'Joola', 10, 'Generic white 1-star Joola Balls. Good for beginners', 100]);

db.execute(insert_item_sql, [2, 'Premade Paddles', 'Butterfly', 50, 'Generic rackets in case of emergency', 25]);

db.execute(insert_item_sql, [3, 'Balls', 'Butterfly', 25, 'Higher-quality 3-star balls for professional practice.', 30]);

db.execute(insert_item_sql, [4, 'Premade Paddles', 'Joola', 45, 'Generic rackets in case of emergency.', 30]);

db.execute(insert_item_sql, [5, 'Tables', 'Butterfly', 700, 'Bright-blue tables to practice on.', 10]);

db.execute(insert_item_sql, [6, 'Practice Robots', 'iPong', 150, 'Great for stroke practice.', 2]);

db.execute(insert_item_sql, [7, 'Shoes', 'Butterfly', 70, 'Extra Table Tennis shoes for emergencies', 5]);

db.execute(insert_item_sql, [8, 'Ball Catching Net', 'null', 0, 'Homemade net for ball catching', 3]);

const insert_inv_sql = `
    INSERT INTO inventory
        (inventory_id, loc_id)
    VALUES
        (?, ?);
    `
    db.execute(insert_inv_sql, [1, 2]);
    db.execute(insert_inv_sql, [2, 3]);
    db.execute(insert_inv_sql, [3, 1]);
    
const insert_inv_item_sql = `
    INSERT INTO inv_item
        (inventory_id, item_id, quantity)
    VALUES
        (?, ?, ?);
    `
db.execute(insert_inv_item_sql, [1, 1, 50]);
db.execute(insert_inv_item_sql, [1, 2, 10]);
db.execute(insert_inv_item_sql, [1, 5, 30]);
db.execute(insert_inv_item_sql, [2, 8, 1]);
db.execute(insert_inv_item_sql, [2, 3, 10]);
db.execute(insert_inv_item_sql, [3, 6, 1]);

const insert_session_sql = `
    INSERT INTO session
        (ses_id, loc_id, ses_name, ses_day, ses_hour, ses_fee)
    VALUES
        (?, ?, ?, ?, ?, ?);
`

db.execute(insert_session_sql, [1, 1, "Dumont 11/4/23", "Sat", "9:30 - 10:30", 25]);
db.execute(insert_session_sql, [2, 1, "Dumont 11/11/23", "Sat", "9:30 - 10:30", 25]);
db.execute(insert_session_sql, [3, 2, "Leonia 11/15/23", "Wed", "6:30 - 7:30", 25]);

const insert_student_sql = `
    INSERT INTO student
        (stu_id, stu_name_first, stu_name_last)
    VALUES
        (?, ?, ?);
`

db.execute(insert_student_sql, [1, "Drea", "Chakravorty"]);
db.execute(insert_student_sql, [2, "Sohan", "Chakravorty"]);
db.execute(insert_student_sql, [3, "Mattias", "Elliot"]);
db.execute(insert_student_sql, [4, "Ono", "Kensho"]);
db.execute(insert_student_sql, [5, "Jisung", "Han"]);

const insert_student_session_sql =  `
    INSERT INTO student_session
        (ses_id, stu_id, stu_attendance)
    VALUES
        (?, ?, ?)
`

db.execute(insert_student_session_sql, [1, 1, 0]);
db.execute(insert_student_session_sql, [1, 2, 1]);
db.execute(insert_student_session_sql, [2, 1, 1]);
db.execute(insert_student_session_sql, [2, 2, 1]);
db.execute(insert_student_session_sql, [3, 3, 1]);
db.execute(insert_student_session_sql, [3, 4, 0]);
db.execute(insert_student_session_sql, [3, 5, 1]);

    db.end();