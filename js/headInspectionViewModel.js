function TypeOfInspection(typeOfInspectionName){
    var self = this;
    self.typeOfInspectionName = typeOfInspectionName;
}

function PlaceOfInspection(placeName){
    var self = this;
    self.placeName = placeName;
}

function TypeOfDefect(nameDefect){
    var self = this;
    self.nameOfDefect = nameDefect;
}


function HeadInspectionViewModel(){
    var self = this;
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

    //Here can we go to database for this data
    // $.getJSON('/some/url',function(data){ Update Object });
    self.availableTypeOfDefect = ko.observableArray([
        new TypeOfDefect("Porosy"),
        new TypeOfDefect("Bleanch"),
        new TypeOfDefect("Defect Spot"),
        ]);


    //DATA to create a new HeaderInspection
    self.currentHeaderInspection = new HeadInspection();
    self.clientName = ko.observable();
    self.partName = ko.observable();
    self.partNumber = ko.observable();
    self.dateOfInspection = ko.observable();
    self.selectedTypeOfInspection = ko.observable();
    self.selectedPlaceOfInspection = ko.observable();


    //DATA to create a new Detail Inspection
    self.lotNumber = ko.observable();
    self.numOfPieces = ko.observable();
    self.serialNumber = ko.observable();
    self.dateDetail = ko.observable();
    self.quantityOk = ko.observable();
    self.quantityNG = ko.observable();
    self.isBoxOpen = ko.observable();
    self.piecesAffected = ko.observable();
    self.selectedTypeOfDefect = ko.observable();

    self.addNewHeadInspection = function(){
        var object;
        object = new HeadInspection(self.clientName(), self.partName(), self.partNumber(), self.selectedTypeOfInspection().typeOfInspectionName, self.selectedPlaceOfInspection().placeName, self.dateOfInspection());
        saveHeadInspection(object, self.db);
        self.currentHeaderInspection = object;
        console.log("log");
    }

    self.addNewDetailInspection = function(){
        var object;
        object = new DetailsInspection(self.currentHeaderInspection.partNumber, self.lotNumber(), self.numOfPieces(), self.serialNumber(), self.quantityOk(), self.quantityNG(), self.selectedTypeOfDefect, self.piecesAffected, self.isBoxOpen());
        saveDetailsInspection(object, self.db);
    }

    self.deleteDataBase = function(){
        deleteDatabases(self.db);
    }

    self.test = function(){
        var header;
        var detail;
        //Create a Header Object
        header = new HeadInspection("ClienteTest", "ParteTest", "9999", "Type Of Inspection Test", "Place of Inspection", "2014-01-18");
        //Create a Detail Object
        detail = new DetailsInspection(header.partNumber, "100", '276', "55555","2014-18-01", "260", "16", "Porosity", "16", "1","1");
        //test Save Object in Database
        saveHeadInspection(header, self.db);
        saveDetailsInspection(detail, self.db);
    }

    self.addNewRecord = function(){
        console.log(self.currentHeaderInspection)
        if(typeof self.currentHeaderInspection.partNumber === 'undefined'){
            var head;
            var detail;
            head = new HeadInspection(self.clientName(), self.partName(), self.partNumber(), self.selectedTypeOfInspection().typeOfInspectionName, self.selectedPlaceOfInspection().placeName, self.dateOfInspection());
            saveHeadInspection(head, self.db);
            self.currentHeaderInspection = head;

            detail = new DetailsInspection(self.currentHeaderInspection.partNumber, self.lotNumber(), self.numOfPieces(), self.serialNumber(),self.dateDetail(), self.quantityOk(), self.quantityNG(), self.selectedTypeOfDefect().nameOfDefect, self.piecesAffected(), self.isBoxOpen());
            saveDetailsInspection(detail, self.db);
            self.cleanDetailForm();
            window.alert("New record successfully entered");
        }else{
            var object;
            object = new DetailsInspection(self.currentHeaderInspection.partNumber, self.lotNumber(), self.numOfPieces(), self.serialNumber(), self.dateDetail(), self.quantityOk(), self.quantityNG(), self.selectedTypeOfDefect().nameOfDefect, self.piecesAffected(), self.isBoxOpen());
            saveDetailsInspection(object, self.db);
            //Clean Data for Inspection Detail
            self.cleanDetailForm();
            window.alert("Detail inspection successfully entered");
        }
    }

    self.browseData = function(){
        document.location.href="browse.html";
    }

    self.cleanDetailForm = function(){
        self.lotNumber(null);
        self.numOfPieces(null);
        self.serialNumber(null);
        self.dateDetail(null);
        self.quantityOk(null);
        self.quantityNG(null);
        self.isBoxOpen(null);
        self.piecesAffected(null);
        self.selectedTypeOfDefect(null);
    }

    self.cleanHeaderForm = function(){
        self.currentHeaderInspection(null);
        self.clientName(null);
        self.partName(null);
        self.partNumber(null);
        self.dateOfInspection(null);
        self.selectedTypeOfInspection(null);
        self.selectedPlaceOfInspection(null);
    }


    self.addNewPart = function(){
        self.cleanHeaderForm();
        document.location.reload();
    }
}



ko.applyBindings(new HeadInspectionViewModel());
