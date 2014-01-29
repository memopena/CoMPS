function browseDataViewModel(){
    var self = this;

    self.db = getConnection();
    self.details = ko.observable();
    self.jsonArr = ko.observableArray();
    self.detailArray = ko.observableArray();

    self.db.transaction(function(tx){
    str_query = "SELECT Name, PartName, TypeOfInspection, PlaceOfInspection, DateOfInspection, LotNumber, NumberOfPieces,SerialNumber, QuantityOk ,QuantityNG, isBoxOpen, InspectionHeader.PartNumber From InspectionHeader INNER JOIN InspectionDetail ON InspectionHeader.PartNumber = InspectionDetail.PartNumber"
    tx.executeSql(str_query,[],function(tx, results){
        //console.log(results);
                if(results.rows.length > 0 ){
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
                    //console.log(ko.toJSON(self.jsonArr()));
                    //self.getDataFromDb();
                    //self.getDataFromDatabase();
                    self.onetestMore();

                }
            }, function(tx,errors){
                console.log(errors.message + ' ' + errors.code)
            });
        });
    self.goHome = function(){
        document.location.href="index.html";
    }

    self.sendData = function(){
        $.post("showJson.html", ko.toJSON(self.jsonArr()), function(returnedData){ console.log("Enviado")});
    }

    self.getDataFromDb = function(){
        var res = '{\"InspectionHeader\":[';
        self.db.transaction(function(tx) {
            tx.executeSql('SELECT * FROM InspectionHeader', [], function(tx, result) {
                result_length = result.rows.length;
                for(var i=0 ; i < result_length; i++){
                    res += '{\"id\":\"'+result.rows.item(i).id+'\",\"client\":\"'+ result.rows.item(i).Name +'\", \"partName\":\"'+result.rows.item(i).PartName+'\" , \"partNumber\": \"'+ result.rows.item(i).PartNumber+'\", \" typeOfInspection\": \"'+result.rows.item(i).TypeOfInspection+'\" , \"dateOfInspection\": \"'+ result.rows.item(i).DateOfInspection+'\"';
                    tx.executeSql('SELECT * FROM InspectionDetail WHERE PartNumber= ?',[result.rows.item(i).PartNumber], function(tx, result2){
                        var resultDetail = result2.rows.length;
                        if(result2.rows.length > 0){
                            res += ', \"InspectionDetail\" : [';
                            for(var d = 0; d < resultDetail; d ++){
                                res +='{\"partNumber\": \"'+ result2.rows.item(d)+'\"}';
                                (d != resultDetail-1) && (res +=',');
                            };
                            res += ']';
                        }else {
                            res+= '}'
                        }
                    });
                    (i != result_length-1) && (res +=',');
                };
                res += ']}';
                //console.log($.parseJSON(res));
            });
    });
    };

    self.getDataFromDatabase = function(){
        var obj = {};
        var header = [];
        var detail = [];
        self.db.transaction(function(tx) {
            tx.executeSql('SELECT * FROM InspectionHeader', [], function(tx, result) {
                result_length = result.rows.length;
                for(var i=0 ; i < result_length; i++){
                    header.push({client: result.rows.item(i).Name , partName: result.rows.item(i).PartName, partNumber : result.rows.item(i).PartNumber, typeOfInspection : result.rows.item(i).TypeOfInspection, placeOfInspection : result.rows.item(i).PlaceOfInspection, dateOfInspection : result.rows.item(i).DateOfInspection});
                }
                obj['headerInspection'] = [header];
                console.log(obj);
                console.log($.parseJSON(obj))
            });
        });

    }


    self.onetestMore = function(){
        var json = ko.observableArray();
        self.db.transaction(function(tx){
        str_query = "SELECT * FROM InspectionHeader";
        tx.executeSql(str_query,[],function(tx, results){
                    if(results.rows.length > 0 ){
                        for(var i = 0 ; i < results.rows.length; i++){
                            json.push({
                                'client': results.rows.item(i).Name,
                                'partName': results.rows.item(i).PartName,
                                'partnumber': results.rows.item(i).PartNumber,
                                'typeOfInspection': results.rows.item(i).TypeOfInspection,
                                'placeOfInspection': results.rows.item(i).PlaceOfInspection,
                                'dateOfInspection': results.rows.item(i).DateOfInspection,
                                'InspectionDetail': self.getDetailByPart(results.rows.item(i).PartNumber)
                            })
                        }
                        console.log(ko.toJSON(json));
                        //self.getDataFromDb();
                        //self.getDataFromDatabase();

                    }
                }, function(tx,errors){
                    console.log(errors.message + ' ' + errors.code)
                });
            });
    }

    self.getDetailByPart = function(partNumber){
        var local = ko.observableArray();
        var details = ko.observableArray();
        var part = partNumber;
        self.db.transaction(function(tx){
            str_query = "SELECT * FROM InspectionDetail WHERE PartNumber== ?";
            local = tx.executeSql(str_query,[part],function(tx,results){
                if(results.rows.length > 0 ){
                    for(var i = 0 ; i < results.rows.length; i++){
                        details.push({
                            'partNumber': results.rows.item(i).PartNumber,
                            'lotNumber' : results.rows.item(i).LotNumber,
                            'numberOfPieces' : results.rows.item(i).NumberOfPieces,
                            'serialNumber': results.rows.item(i).SerialNumber,
                            'date': results.rows.item(i).Date,
                            'quantityOk': results.rows.item(i).QuantityOk,
                            'quantityNG': results.rows.item(i).QuantityNG,
                            'isBoxOpen' : results.rows.item(i).isBoxOpen
                        });
                    };
                }
            });
        });
        return local;

    }




}




ko.applyBindings(new browseDataViewModel());
