const db = require("./db_connection")

/**** Drop existing tables, if any ****/

const drop_Items_table_sql = "DROP TABLE IF EXISTS items;"

db.execute(drop_Items_table_sql);

const drop_Center_table_sql = "DROP TABLE IF EXISTS centers;"

db.execute(drop_Center_table_sql);

const drop_Item_Center_table_sql = "DROP TABLE IF EXISTS center_item;"

db.execute(drop_Item_Center_table_sql);

const create_items_table_sql = `
CREATE TABLE items (
  item_id INT NOT NULL,
  item_name VARCHAR(45) NULL,
  item_brand VARCHAR(45) NULL,
  item_count INT NULL,
  item_desc VARCHAR(150) NULL,
  PRIMARY KEY (item_id));
    `
    db.execute(create_items_table_sql);

const create_centers_table_sql = `
CREATE TABLE centers (
  center_id INT NOT NULL,
  center_name VARCHAR(45) NULL,
  center_town VARCHAR(45) NULL,
  center_time VARCHAR(45) NULL,
  center_fee VARCHAR(45) NULL,
  PRIMARY KEY (center_id));
    `
    db.execute(create_centers_table_sql);

    const create_students_table_sql = `
    CREATE TABLE students (
      student_id INT NOT NULL,
      student_name_first VARCHAR(45) NULL,
      student_name_last VARCHAR(45) NULL,
      center_id INT NULL,
      student_attendance TINYINT NULL,
      PRIMARY KEY (student_id));
      INDEX studentcenter_idx (center_id ASC);
      CONSTRAINT studentcenter
      FOREIGN KEY (center_id)
      REFERENCES ib_2324_drecha24.centers (center_id)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION;
          `
    
    db.execute(create_students_table_sql);

    const create_center_item_table_sql = `
    CREATE TABLE center_item (
      center_id INT NOT NULL,
      item_id INT NOT NULL,
      count INT NULL,
      PRIMARY KEY (center_id, item_id),
      INDEX itemid_idx (item_id ASC),
      CONSTRAINT centerid
        FOREIGN KEY (center_id)
        REFERENCES ib_2324_drecha24.centers (center_id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,
      CONSTRAINT itemid
        FOREIGN KEY (item_id)
        REFERENCES ib_2324_drecha24.Items (item_id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION);
          `
    
    db.execute(create_center_item_table_sql);

    db.end();