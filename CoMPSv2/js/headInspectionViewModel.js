function HeadInspection(clientName, partName, partNumber, typeOfInspection, placeOfInspection, dateOfInspection){
    var self = this;
    self.client = clientName;
    self.partName = partName;
    self.partNumber = partNumber;
    self.typeOfInspection = typeOfInspection;
    self.placeOfInspection = placeOfInspection;
    self.dateOfInspection = dateOfInspection;

}

function DetailsInspection(partNumber, lotNumber, numOfPieces, serialNumber, date, quantityOk, quantityNG, typeOfDefect, piecesAffected, isBoxOpen){
    var self = this;
    self.partNumber = partNumber;
    self.lotNumber = lotNumber;
    self.numOfPieces = numOfPieces;
    self.serialNumber = serialNumber;
    self.date = date;
    self.quantityOk = quantityOk;
    self.quantityNG = quantityNG;
    self.typeOfDefect = typeOfDefect;
    self.piecesAffected = piecesAffected;
    self.isBoxOpen = isBoxOpen;
}

function TypeOfInspection(name){
    var self = this;
    self.typeOfInspectionName = name;
}

function PlaceOfInspection(placeName){
    var self = this;
    self.placeName = placeName;
}

function TypeOfDefect(defect){
    var self = this;
    self.defect = ko.observable(defect);
}

function Defect(typeOfDefect,qty){
    var self = this;
    self.typeOfDefect = ko.observable(typeOfDefect);
    self.qty = ko.observable(qty);
}

function HeadInspectionViewModel(){
    var self = this;
    self.currentHeadInspection = HeadInspection();
    self.db = getConnection();
    createTables(self.db);

    //Here can we go to database for this data
    // $.getJSON('/some/url',function(data){ Update Object });
    self.availableTypeOfInspection = ko.observableArray([
        new TypeOfInspection("Washed"),
        new TypeOfInspection("Dry"),
        new TypeOfInspection("Wet"),
        ]);

    //Here can we go to database for this data
    // $.getJSON('/some/url',function(data){ Update Object });
    self.availablePlaceOfInspection = ko.observableArray([
        new PlaceOfInspection("Lab"),
        new PlaceOfInspection("Build"),
        new PlaceOfInspection("Storage"),
        ]);

    self.avaliableTypeOfDefect = [
        "Defect1", "Defect2", "Defect3"
    ]


    //DATA to create a new HeaderInspection
    self.clientName = ko.observable();
    self.partName = ko.observable();
    self.partNumber = ko.observable();
    self.dateOfInspection = ko.observable();
    self.selectedTypeOfInspection = ko.observable();
    self.selectedPlaceOfInspection = ko.observable();

    self.defectsArray = ko.observableArray();
    self.selectedDefect = ko.observable();

    //DATA to create a new InspectionDetail
    self.lotNumber = ko.observable();
    self.numOfPieces = ko.observable();
    self.serial = ko.observable();
    self.qtyNG = ko.observable();
    self.isBoxOpen = ko.observable();


    self.addNewHeadInspection = function(){
        var object;
        object = new HeadInspection(self.clientName(), self.partName(), self.partNumber(), self.selectedTypeOfInspection().typeOfInspectionName, self.selectedPlaceOfInspection().placeName, self.dateOfInspection());
        //console.log(self.selectedTypeOfInspection().typeOfInspectionName);
        self.db.transaction(function(tx){
            str_Insert = "INSERT INTO InspectionHeader(Name, PartName, \
                PartNumber, TypeOfInspection, PlaceOfInspection, \
                DateOfInspection) VALUES(?,?,?,?,?,?)";
            tx.executeSql(str_Insert,[object.client, object.partName, object.partNumber, object.typeOfInspection , object.placeOfInspection, object.dateOfInspection ], function(result){console.log(result.message);},function(tx,errors){console.log(errors.message + ' ' + errors.code)} );
        } );
        self.currentHeadInspection  = object;
        document.location.href="#inspectionDetails";
    }

    self.addNewDetailInspection = function(){
        var detailInspection;
        var str_defects = "";
        var numOfPiecesNG = 0;
        var numOfPiecesOK = 0;
        var numOfPiecesAffected= 0;
        console.log(self.defectsArray().length);
        if(self.defectsArray().length > 0 ){
            for(var i = 0 ; i < self.defectsArray().length; i++){
                str_defects += self.defectsArray()[i].typeOfDefect() + "-";
                str_defects += self.defectsArray()[i].qty()+ ";";
                numOfPiecesAffected += self.defectsArray()[i].qty();
            }
        }
        // How many pieces are good
        numOfPiecesOK = self.numOfPieces() - numOfPiecesAffected ;
        detailInspection = new DetailsInspection(self.currentHeadInspection.partNumber, self.lotNumber(), self.numOfPieces(), self.serial(), numOfPiecesOK, numOfPiecesNG, str_defects, numOfPiecesAffected, self.isBoxOpen());

        self.db.transaction(function(tx){
            str_Insert = "INSERT INTO InspectionDetail(PartNumber, LotNumber, \
                NumberOfPieces, SerialNumber, Date, QuantityOk\
                QuantityNG, TypeOfDefect, piecesAffected, isBoxOpen) VALUES(?,?,?,?,?,?,?,?,?,?)";
            tx.executeSql(str_Insert,[detailInspection.partNumber, detailInspection.lotNumber, detailInspection.numOfPieces, detailInspection.serialNumber, detailInspection.date, detailInspection.quantityOk,detailInspection.quantityNG,detailInspection.typeOfDefect, detailInspection.piecesAffected, detailInspection.isBoxOpen], function(result){console.log(result.message);},function(tx,errors){console.log(errors.message + ' ' + errors.code)} );
        } );
    }

    self.clearData = function(){
        self.lotNumber = ko.observable(null);
        self.numOfPieces = ko.observable(null);
        self.serial = ko.observable(null);
        self.qtyNG = ko.observable(null);
        self.isBoxOpen = ko.observable(null);
    }

    self.truncateHeadInspectionTable = function(){
        self.db.transaction(function(tx){
            tx.executeSql("DELETE FROM masterClient");
        });
    }

    self.cancelButton = function(){

    }

    self.addDefect = function(){
        console.log(typeof self.avaliableTypeOfDefect[0].defectName);
        self.defectsArray.push(new Defect(self.avaliableTypeOfDefect[0].defectName,"0"));
    }

    self.removeDefect = function(defect){
        self.defectsArray.remove(defect);
    }

    self.selectAllData = function() {
        self.db.transaction(function (tx) {
          tx.executeSql('SELECT * FROM InspectionHeader', [], function (tx, results) {
            var len = results.rows.length, i;
            msg = "<p>Found rows: " + len + "</p>";
            document.querySelector('#status').innerHTML +=  msg;
            for (i = 0; i < len; i++){
                msg = "<p><b>" + results.rows.item(i).Name + "</b></p>";
                document.querySelector('#status').innerHTML +=  msg;
                }
            }, null, null);
        });
    }
}



ko.applyBindings(new HeadInspectionViewModel());
