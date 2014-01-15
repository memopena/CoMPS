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
        {defectName: "Defect1"},
        {defectName: "Defect2"},
        {defectName: "Defect3"}
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
    self.lot = ko.observable();
    self.numOfPieces = ko.observable();
    self.serial = ko.observable();
    self.qtyNG = ko.observable();


    self.addNewHeadInspection = function(){
        var objeto;
        objeto = new HeadInspection(self.clientName(), self.partName(), self.partNumber(), self.selectedTypeOfInspection().typeOfInspectionName, self.selectedPlaceOfInspection().placeName, self.dateOfInspection());
        console.log(self.selectedTypeOfInspection().typeOfInspectionName);
        self.db.transaction(function(tx){
            str_Insert = "INSERT INTO InspectionHeader(Name, PartName, \
                PartNumber, TypeOfInspection, PlaceOfInspection, \
                DateOfInspection) VALUES(?,?,?,?,?,?)";
            tx.executeSql(str_Insert,[objeto.client, objeto.partName, objeto.partNumber, objeto.typeOfInspection , objeto.placeOfInspection, objeto.dateOfInspection ], function(result){console.log(result.message);},function(tx,errors){console.log(errors.message + ' ' + errors.code)} );
        } );
        self.currentHeadInspection  = objeto;
        document.location.href="#inspectionDetails";
    }

    self.addNewDetailInspection = function(){
        var detailInspection;
        var str_defects = "";
        console.log(self.defectsArray().length);
        if(self.defectsArray().length > 0 ){
            for(var i=0; i >= self.defectsArray().length; i++ ){
                typeDefect = self.defectArray()[i];
                str_defects += typeDefect.typeOfDefect + "-";
                str_defects += typeDefect.qty + ';';
                console.log("paso1");
            }
        }
        console.log(str_defects);
    }

    self.truncateHeadInspectionTable = function(){
        self.db.transaction(function(tx){
            tx.executeSql("DELETE FROM masterClient");
        });
    }

    self.cancelButton = function(){

    }

    self.addDefect = function(){
        self.defectsArray.push(new Defect(self.avaliableTypeOfDefect[0].defectName,"0"));
    }

    self.removeDefect = function(defect){
        self.defectsArray.remove(defect);
    }
}



ko.applyBindings(new HeadInspectionViewModel());
