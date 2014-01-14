
      var datos;
      var savedData = [];
      try {
          var db = openDatabase('cmps', '1.0', 'Control Manufacturing', 5 * 1024 * 1024, DBCreated);

      } catch( error ) {
          alert('Your browser is not supported for WebSQL - Please use Chrome or Safari');
      }

      //db.transaction(deleteTable);

      function hacerTodo(){
         db.transaction(createTable);
         db.transaction(fillTable);
         db.transaction(retrieveData);
     }

    function DBCreated(){
      alert("Database Created");
    }


    function TBError(){
      alert("Error to create a table");
    }

    function successQuery(db, results){
      if (results.rows){
        if (results.rows.length > 0 ){
          fillData(results);
        }
      }else {
        alert("Query Ok");
      }
    }

    function createTable(db){
      var sqlStr = 'CREATE TABLE IF NOT EXISTS ZOOKEEPERS (id INT, firstName TEXT, surname TEXT, favoriteAnimal TEXT)';
      db.executeSql(sqlStr, [], successQuery, TBError);
    }

    function fillTable(db){
      var zookeepers = [
          { id: 1, firstName: "Jo", surname: "Peak", favoriteAnimal: "Panda" },
          { id: 2, firstName: "Jon", surname: "Baxter", favoriteAnimal: "Snow Leopard"},
          { id: 3, firstName: "Jake", surname: "Mair", favoriteAnimal: "Gorilla" },
          { id: 4, firstName: "Falai", surname: "Baldelli", favoriteAnimal: "Tiger" },
          { id: 5, firstName: "Matt", surname: "Lowdon", favoriteAnimal: "Rhino" },
          { id: 6, firstName: "Bryn", surname: "Percival", favoriteAnimal: "Monkey" },
          { id: 7, firstName: "Sumin", surname: "Chen", favoriteAnimal: "Horse" },
          { id: 8, firstName: "Adella", surname: "Guar", favoriteAnimal: "Tiger" },
          { id: 9, firstName: "Alex", surname: "Martins", favoriteAnimal: "Elephant" },
          { id: 10, firstName: "Luke", surname: "Howard", favoriteAnimal: "Panda" }
      ];

      var len = zookeepers.length;
      var sqlStr = 'INSERT INTO ZOOKEEPERS (id, firstName, Surname, favoriteAnimal) VALUES (?,?,?,?)';
      var e;
      for (var i = 0; i < len; i++) {
          e = zookeepers[i];
          db.executeSql(sqlStr, [e.id, e.firstName, e.surname, e.favoriteAnimal], successQuery, TBError);
      }
    }

    function deleteTable(db){
      db.executeSql('DROP TABLE IF EXISTS ZOOKEEPERS', dbDeleted, TBError);
    }

    function dbDeleted(){
      alert("Tabla Borrado con exito");
    }

    function retrieveData(db){
      var sqlStr = "SELECT * FROM ZOOKEEPERS"
      db.executeSql(sqlStr, [], successQuery, TBError);
    }

    function fillData(results){
      var datos2 = results.rows.length;
      var str = "<br><br>";
        if (datos2 == 0) {
            str += "<b>The database contains no results for this query. Hint, try monkey or tiger...";
        } else {
            for (var i = 0; i < datos2; i++) {
                str += ("<li><b>" + results.rows.item(i).firstName + " " +
                                    results.rows.item(i).surname + " " +
                                    results.rows.item(i).favoriteAnimal +
                        "</b><br>");
            }
        }
        $('div.display').html(str);
    }


