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
        var sqlStr_details = 'CREATE TABLE IF NOT EXISTS \
                        InspectionDetail(PartNumber TEXT NOT NULL,\
                        LotNumber TEXT NULL, NumberOfPieces INTEGER NULL,\
                        SerialNumber TEXT NULL, Date TEXT NULL,\
                        QuantityOk INTEGER NULL, QuantityNG INTEGER NULL,\
                        TypeOfDefect TEXT NULL, piecesAffected INTEGER NULL,\
                        isBoxOpen INTEGER NULL,\
                        PRIMARY KEY(PartNumber))'
        var sqlStr_master = 'CREATE TABLE IF NOT EXISTS \
                        InspectionHeader(Name TEXT NOT NULL,\
                        PartName TEXT NOT NULL, PartNumber TEXT, \
                        TypeOfInspection TEXT NULL, PlaceOfInspection TEXT \
                        NULL, DateOfInspection TEXT NULL,\
                        InspectionDetail_PartNumber TEXT NULL,\
                        PRIMARY KEY(PartNumber)\
                        FOREIGN KEY(PartNumber) REFERENCES InspectionDetail(\
                         PartNumber) ON UPDATE CASCADE ON DELETE RESTRICT)'

        transaction.executeSql(sqlStr_master, [], function(){ console.log("Table InspectionHeader Create Successful");}, function(db,errors){ console.log(errors.message);});
        transaction.executeSql(sqlStr_details, [], function(){ console.log("Table InspectionDetail Create Successful");}, function(db,errors){ console.log(errors.message);});
    });
}

function deleteDataBase(db){
    db.transaction(function(transaction){
        transaction.executeSql("DROP TABLE IF EXISTS masterClient");
    })
}

