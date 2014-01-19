

function HeadInspection(clientName, partName, partNumber, typeOfInspection, placeOfInspection, dateOfInspection){
    var self = this;
    self.client = clientName;
    self.partName = partName;
    self.partNumber = partNumber;
    self.typeOfInspection = typeOfInspection;
    self.placeOfInspection = placeOfInspection;
    self.dateOfInspection = dateOfInspection;

}

//Require an object of HeadInspection Model
function saveHeadInspection(HeadInspection, db){
        db.transaction(function(tx){
            str_Insert = "INSERT INTO InspectionHeader(Name, PartName, \
                PartNumber, TypeOfInspection, PlaceOfInspection, \
                DateOfInspection) VALUES(?,?,?,?,?,?)";
            tx.executeSql(str_Insert,[HeadInspection.client, HeadInspection.partName, HeadInspection.partNumber, HeadInspection.typeOfInspection , HeadInspection.placeOfInspection, HeadInspection.dateOfInspection ], function(){console.log("Inserted Head Inspection Record");},function(tx,errors){console.log(errors.message + ' ' + errors.code)} );
        } );
}
