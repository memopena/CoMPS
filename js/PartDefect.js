function PartDefect(partNumber, lotNumber, typeOfDefect, partsAffected){
    var self = this

    self.partNumber = partNumber;
    self.lotNumber = lotNumber;
    self.typeOfDefect = typeOfDefect;
    self.partsAffected = partsAffected;

}

//Require an Object PartDefect to save
function savePartDefect(partDefect, db){
    db.transaction(function(tx){
            str_Insert = "INSERT INTO PartDefect(PartNumber, LotNumber, \
                TypeOfDefect, partsAffected) VALUES(?,?,?,?)";
            tx.executeSql(str_Insert,[partDefect.partNumber, partDefect.lotNumber, partDefect.typeOfDefect, partDefect.partsAffected], function(){console.log("Inserted PartDefect Record");},function(tx,errors){console.log(errors.message + ' ' + errors.code)} );
        } );
}
