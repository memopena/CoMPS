function browseDataViewModel(){
    var self = this;

    self.db = getConnection();
    self.details = ko.observable();
    self.jsObject = ko.observableArray();
    self.jsonArr = ko.observableArray();
    self.detailArray = ko.observableArray();
    self.lastObject = ko.observableArray();

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
                        });
                    }
                    //Build an Object to send JSON 
                    self.buildObject();
                    

                }
            }, function(tx,errors){
                console.log(errors.message + ' ' + errors.code)
            });
        });
    self.goHome = function(){
        document.location.href="index.html";
    };
    

    self.sendData = function(){
        $.post("http://localhost:8080/InspectionLogRestService/persist/add", ko.toJSON(self.lastObject), function(){ console.log("Enviado");});
    };
    
    self.getLastObjectArray = function(object){
        self.lastObject= object;
        console.log(self.lastObject);
        console.log(JSON.stringify(self.lastObject));
    };
    
    self.buildObject = function(){
        var self = this;
        self.arr = [];
        self.object = {};
          self.getHeaderByPart([], function(headerInspec){
              self.object.HeaderInspection = headerInspec;
              for(var i=0 ; i < self.object.HeaderInspection.length; i++){
               self.getDetailByPart(self.object.HeaderInspection[i],function(details){
                   for(var n = 0 ; n < details.InspectionDetail.length ; n ++){
                       self.getDefectsByLot(details.InspectionDetail[n], function(lastObject){
                           //console.log(ko.toJSON(self.object));
                           //console.log(self.object);
                           self.getLastObjectArray(self.object);
                       }, function(){});
                   }
               },function(){});
              }
              //self.getLastObjectArray(self.object);
          },function(){});
      };
      
    self.getHeaderByPart = function(params, success, error){
        var header = [];
        self.db.transaction(function(tx){
            str_query = "SELECT * FROM InspectionHeader";
            tx.executeSql(str_query,[],function(tx,results){
                if(results.rows.length > 0 ){
                    for(var i = 0 ; i < results.rows.length; i++){
                        header.push({
                            'client': results.rows.item(i).Name,
                            'partName' : results.rows.item(i).PartName,
                            'partNumber' : results.rows.item(i).PartNumber,
                            'typeOfInspection': results.rows.item(i).TypeOfInspection,
                            'placeOfInspection': results.rows.item(i).PlaceOfInspection,
                            'dateOfInspection': results.rows.item(i).DateOfInspection
                        });
                    };
                    success(header);
                }
            });
        });
        
        
    };
    
    self.getDetailByPart = function(object, success, error){
        var details = [];
        var part = object.partNumber;
        self.db.transaction(function(tx){
            str_query = "SELECT * FROM InspectionDetail WHERE PartNumber== ?";
            tx.executeSql(str_query,[part],function(tx,results){
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
                    object.InspectionDetail = details;
                    success(object);
                }
            });
        });
    };
    
    self.getDefectsByLot = function(object, success, error){
        var defects = [];
        var lotNumber = object.lotNumber;
        self.db.transaction(function(tx){
            str_query = "SELECT * FROM PartDefect WHERE LotNumber== ?";
            tx.executeSql(str_query,[lotNumber],function(tx,results){
                if(results.rows.length > 0 ){
                    for(var i = 0 ; i < results.rows.length; i++){
                        defects.push({
                            'partNumber': results.rows.item(i).PartNumber,
                            'lotNumber' : results.rows.item(i).LotNumber,
                            'typeOfDefect' : results.rows.item(i).TypeOfDefect,
                            'partsAffected': results.rows.item(i).PartsAffected
                        });
                    };
                    object.PartsDefects = defects;
                    success(object);
                }
            });
        });
    };



}




ko.applyBindings(new browseDataViewModel());
