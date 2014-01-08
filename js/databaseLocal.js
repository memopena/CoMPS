// Database Creation
// Add by Jorge Ochoa
var db;
var database_name = "cmps";
var database_version = "1.0";
var database_description = "Control of Manufacturing";
var database_size = 5 * 1024 * 1024


function getConnection(){
    try {
        var db = openDatabase(database_name, database_version, database_description, database_size, function(){console.log("Database Created")});
        return db;
    }
    catch(error) {
        alert('Your browser is not supported for WebSQL - Please use Chrome or Safari');
    }

}

function createTables(db){
    db.transaction(function(transaction){
        //Query to create a Tables
        var sqlStr_master = 'CREATE TABLE IF NOT EXISTS masterClient(id INTEGER PRIMARY KEY, client TEXT, part_name TEXT, part_number INTEGER, type_inspection TEXT, place_inspection TEXT, date_inspection TEXT)'
        transaction.executeSql(sqlStr_master, [], function(){ console.log("Table Create Successful");}, function(){ console.log("Error To Create Table");});
    });
}

function deleteDataBase(db){
    db.transaction(function(transaction){
        transaction.executeSql("DROP TABLE IF EXISTS ZOOKEEPERS");
    })
}

