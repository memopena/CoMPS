function HeadInspection(clientName, partName, partNumber, typeOfInspection, placeOfInspection, dateOfInspection){
    var self = this;
    self.client = clientName;
    self.partName = partName;
    self.partNumber = partNumber;
    self.typeOfInspection = typeOfInspection;
    self.placeOfInspection = placeOfInspection;
    self.dateOfInspection = dateOfInspection;

}

function TypeOfInspection(typeOfInspectionName){
    var self = this;
    self.typeOfInspectionName = typeOfInspectionName;
}

function PlaceOfInspection(placeName){
    var self = this;
    self.placeName = placeName;
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


    //DATA to create a new HeaderInspection
    self.clientName = ko.observable();
    self.partName = ko.observable();
    self.partNumber = ko.observable();
    self.dateOfInspection = ko.observable();
    self.selectedTypeOfInspection = ko.observable();
    self.selectedPlaceOfInspection = ko.observable();

    self.addNewHeadInspection = function(){
        var objeto;
        objeto = new HeadInspection(self.clientName(), self.partName(), self.partNumber(), self.selectedTypeOfInspection().typeOfInspectionName, self.selectedPlaceOfInspection().placeName, self.dateOfInspection());

        self.db.transaction(function(tx){
            // tx.executeSql('INSERT INTO masterClient (client, part_name, part_number, type_inspection, place_inspection, date_inspection) VALUES("Cliente prueba", "prueba parte", "1234", "Wet", "Lab","01-01-2014")', function(){console.log("Exito")}, function(){console.log("Error")});
             tx.executeSql("INSERT INTO masterClient (client, part_name, part_number, type_inspection, place_inspection, date_inspection) VALUES(?,?,?,?,?,?)",[objeto.client, objeto.partName, objeto.partNumber, objeto.typeOfInspection , objeto.placeOfInspection, objeto.dateOfInspection ]);
        } );
    }

    self.truncateHeadInspectionTable = function(){
        self.db.transaction(function(tx){
            tx.executeSql("DELETE FROM masterClient");
        });
    }
}



ko.applyBindings(new HeadInspectionViewModel());
