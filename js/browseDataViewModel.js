function browseDataViewModel(){
    var self = this;

    self.db = getConnection();
    self.details = ko.observable();
    self.jsonArr = ko.observableArray();

    self.db.transaction(function(tx){
    str_query = "SELECT Name, PartName, TypeOfInspection, PlaceOfInspection, DateOfInspection, LotNumber, NumberOfPieces,SerialNumber, QuantityOk ,QuantityNG, isBoxOpen, InspectionHeader.PartNumber From InspectionHeader INNER JOIN InspectionDetail ON InspectionHeader.PartNumber = InspectionDetail.PartNumber"
    tx.executeSql(str_query,[],function(tx, results){
        console.log(results);
                if(results.rows.length > 0 ){
                    console.log("Data Inside of a Database");
                    for(var i = 0 ; i < results.rows.length; i++){
                        self.jsonArr.push({
                            'name': results.rows.item(i).Name,
                            'partName': results.rows.item(i).PartName,
                            'type': results.rows.item(i).TypeOfInspection,
                            'place': results.rows.item(i).PlaceOfInspection,
                            'date': results.rows.item(i).DateOfInspection,
                            'lot': results.rows.item(i).LotNumber,
                            'numberpieces': results.rows.item(i).NumberOfPieces,
                            'serial': results.rows.item(i).SerialNumber,
                            'qtyOK': results.rows.item(i).QuantityOk,
                            'qtyNG': results.rows.item(i).QuantityNG,
                            'box': results.rows.item(i).isBoxOpen,
                            'partnumber': results.rows.item(i).PartNumber
                        })
                    }
                    console.log(self.jsonArr[0]);
                }
            }, function(tx,errors){
                console.log(errors.message + ' ' + errors.code)
            });
        });
    self.goHome = function(){
        document.location.href="index.html";
    }

}




ko.applyBindings(new browseDataViewModel());
