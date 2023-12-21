const db = require("./db_connection")

/**** Drop existing tables, if any ****/

const drop_all_sql = "DROP TABLE IF EXISTS inv_item, inventory, student_session, session, item, location, student;"

db.execute(drop_all_sql);

const create_item_table_sql = `
CREATE TABLE item (
  item_id INT NOT NULL,
  item_name VARCHAR(45) NULL,
  item_brand VARCHAR(45) NULL,
  item_cost INT NULL,
  item_desc VARCHAR(150) NULL,
  item_total_amt INT NULL,
  PRIMARY KEY (item_id));
    `
    db.execute(create_item_table_sql);

const create_location_table_sql = `
CREATE TABLE location (
  loc_id INT NOT NULL,
  loc_name VARCHAR(45) NULL,
  loc_town VARCHAR(45) NULL,
  loc_desc VARCHAR(150) NULL,
  PRIMARY KEY (loc_id)
  );
    `
    db.execute(create_location_table_sql);

    const create_session_table_sql = `
CREATE TABLE session (
  ses_id INT NOT NULL,
  loc_id INT NOT NULL,
  ses_name VARCHAR(45) NULL,
  ses_day VARCHAR(45) NULL,
  ses_hour VARCHAR(45) NULL,
  ses_fee INT NULL,
  PRIMARY KEY (ses_id),
  INDEX sesLoc_idx (loc_id ASC),
  CONSTRAINT sesLoc FOREIGN KEY (loc_id) REFERENCES location (loc_id)
  ON DELETE CASCADE
  ON UPDATE CASCADE
  );
    `
    db.execute(create_session_table_sql);

    const create_student_table_sql = `
    CREATE TABLE student (
  stu_id INT NOT NULL,
  stu_name_first VARCHAR(45) NULL,
  stu_name_last VARCHAR(45) NULL,
  PRIMARY KEY (stu_id));
  `
    db.execute(create_student_table_sql);

    const create_student_session_table_sql = `
  CREATE TABLE student_session (
  ses_id INT NOT NULL,
  stu_id INT NOT NULL,
  stu_attendance TINYINT NULL,
  PRIMARY KEY (ses_id, stu_id),
  INDEX whatSes_idx (ses_id ASC),
  CONSTRAINT whatSes FOREIGN KEY (ses_id) REFERENCES session (ses_id)
  ON DELETE CASCADE
  ON UPDATE CASCADE,
  INDEX whatStu_idx (stu_id ASC),
  CONSTRAINT whatStu FOREIGN KEY (stu_id) REFERENCES student (stu_id)
  ON DELETE CASCADE
  ON UPDATE CASCADE
  );
    `

    db.execute(create_student_session_table_sql);

    const create_inventory_table_sql = `
CREATE TABLE inventory (
  inventory_id INT NOT NULL,
  loc_id INT NOT NULL,
  PRIMARY KEY (inventory_id),
  INDEX locInventory_idx (loc_id ASC),
  CONSTRAINT locInventory FOREIGN KEY (loc_id) REFERENCES location (loc_id)
  ON DELETE CASCADE
  ON UPDATE CASCADE
  );
    `
db.execute(create_inventory_table_sql);

const create_inv_item_table = `
  CREATE TABLE inv_item (
    inventory_id INT NOT NULL,
    item_id INT NOT NULL,
    quantity INT NULL,
    PRIMARY KEY (inventory_id, item_id),
    INDEX invId_idx (inventory_id ASC),
    CONSTRAINT invId FOREIGN KEY (inventory_id) REFERENCES inventory (inventory_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
    INDEX itemId_idx (item_id ASC),
    CONSTRAINT itemId FOREIGN KEY (item_id) REFERENCES item (item_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
  );
`

db.execute(create_inv_item_table);

    db.end();