const db = require("./db_connection")

/**** Drop existing tables, if any ****/

const drop_Items_table_sql = "DROP TABLE IF EXISTS Items;"

db.execute(drop_Items_table_sql);

const drop_Center_table_sql = "DROP TABLE IF EXISTS Center;"

db.execute(drop_Center_table_sql);

const drop_Item_Center_table_sql = "DROP TABLE IF EXISTS Item_Center;"

db.execute(drop_Item_Center_table_sql);

const create_Items_table_sql = `
CREATE TABLE Items (
  item_id INT NOT NULL,
  item_name VARCHAR(45) NULL,
  item_brand VARCHAR(45) NULL,
  item_count INT NULL,
  item_desc VARCHAR(150) NULL,
  PRIMARY KEY (item_id));
    `
    db.execute(create_client_table_sql);

const create_inventory_table_sql = `
CREATE TABLE inventory (
    item_id INT NOT NULL AUTO_INCREMENT,
    item_name VARCHAR(45) NULL,
    item_brand VARCHAR(45) NULL,
    item_count INT NULL,
    item_desc VARCHAR(100) NULL,
    PRIMARY KEY (item_id));
    `
    db.execute(create_inventory_table_sql);

    const create_clientid_table_sql = `
    CREATE TABLE client_item (
        client_id INT NOT NULL,
        item_id INT NOT NULL,
        PRIMARY KEY (client_id, item_id),
        INDEX item_idx (item_id ASC),
        CONSTRAINT client
          FOREIGN KEY (client_id)
          REFERENCES client (client_id)
          ON DELETE NO ACTION
          ON UPDATE NO ACTION,
        CONSTRAINT item
          FOREIGN KEY (item_id)
          REFERENCES inventory (item_id)
          ON DELETE NO ACTION
          ON UPDATE NO ACTION);
          `
    
    db.execute(create_clientid_table_sql);

    db.end();