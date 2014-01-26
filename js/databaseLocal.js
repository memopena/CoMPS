// Database Creation
// Add by Jorge Ochoa
var db;
var database_name = "cmps";
var database_version = "1.0";
var database_description = "Control of Manufacturing";
var database_size = 5 * 1024 * 1024


function getConnection(){
    try {
        var db = openDatabase(database_name, database_version, database_description, database_size);
        console.log(db);
        console.log("Conecction succesful");
        return db;
    }
    catch(error) {
        alert('Your browser is not supported for WebSQL - Please use Chrome or Safari');
    }

}

function createTables(db){
    db.transaction(function(transaction){
        //Query to create a Tables
        var sqlStr_details = 'CREATE TABLE IF NOT EXISTS \
                        InspectionDetail(id INTEGER PRIMARY KEY AUTOINCREMENT, PartNumber TEXT NOT NULL,\
                        LotNumber TEXT NULL, NumberOfPieces INTEGER NULL,\
                        SerialNumber TEXT NULL, Date TEXT NULL,\
                        QuantityOk INTEGER NULL, QuantityNG INTEGER NULL,\
                        isBoxOpen INTEGER NULL)'
        var sqlStr_master = 'CREATE TABLE IF NOT EXISTS \
                        InspectionHeader(id INTEGER PRIMARY KEY AUTOINCREMENT, Name TEXT NOT NULL,\
                        PartName TEXT NOT NULL, PartNumber TEXT, \
                        TypeOfInspection TEXT NULL, PlaceOfInspection TEXT \
                        NULL, DateOfInspection TEXT NULL,\
                        InspectionDetail_PartNumber TEXT NULL)'
        var sqlStr_defects = 'CREATE TABLE IF NOT EXISTS \
                        PartDefect(id INTEGER PRIMARY KEY AUTOINCREMENT,\
                        PartNumber TEXT NOT NULL, LotNumber TEXT NOT NULL, \
                        TypeOfDefect TEXT NOT NULL, PartsAffected INTEGER NOT NULL)'
        transaction.executeSql(sqlStr_master, [], function(){ console.log("Table InspectionHeader Create Successful");}, function(db,errors){ console.log(errors.message);});
        transaction.executeSql(sqlStr_details, [], function(){ console.log("Table InspectionDetail Create Successful");}, function(db,errors){ console.log(errors.message);});
        transaction.executeSql(sqlStr_defects, [], function(){ console.log("Table PartDefect Create Successful");}, function(db,errors){ console.log(errors.message);});
    });
}


function deleteDatabases(db){
    db.transaction(function(transaction){
        transaction.executeSql("DROP TABLE IF EXISTS InspectionHeader");
        transaction.executeSql("DROP TABLE IF EXISTS InspectionDetail");
        transaction.executeSql("DROP TABLE IF EXISTS PartDefect");
    })
}

