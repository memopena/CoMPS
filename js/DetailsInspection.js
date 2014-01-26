function DetailsInspection(partNumber, lotNumber, numOfPieces, serialNumber, date, quantityOk, quantityNG, isBoxOpen){
    var self = this;
    self.partNumber = partNumber;
    self.lotNumber = lotNumber;
    self.numOfPieces = numOfPieces;
    self.serialNumber = serialNumber;
    self.dateDetail = date;
    self.quantityOk = quantityOk;
    self.quantityNG = quantityNG;
    self.isBoxOpen = isBoxOpen;
}


function saveDetailsInspection(detailInspection, db ){
    db.transaction(function(tx){
            str_Insert = "INSERT INTO InspectionDetail(PartNumber, LotNumber, \
                NumberOfPieces, SerialNumber, Date, QuantityOk,\
                QuantityNG, isBoxOpen) VALUES(?,?,?,?,?,?,?,?)";
            tx.executeSql(str_Insert,[detailInspection.partNumber, detailInspection.lotNumber, detailInspection.numOfPieces, detailInspection.serialNumber, detailInspection.dateDetail, detailInspection.quantityOk,detailInspection.quantityNG,detailInspection.isBoxOpen], function(result){console.log("Inserted Detail Inspection Record");},function(tx,errors){console.log(errors.message + ' ' + errors.code)} );
        } );
}
