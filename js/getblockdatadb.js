function getBlockOfDataFromDb(minVal, qty) {
  var res = '{\"data\":[';
 db.transaction(function(tx) {
   tx.executeSql('SELECT * FROM primeNumbers WHERE id BETWEEN '+ minVal +' AND '+ (minVal+qty - 1), [], function(tx, result) {
     result_length = result.rows.length;
     for(var i = 0; i < result_length; i++) {
       res += '{\"id\":\"'+result.rows.item(i).id+'\",\"value\":\"'+result.rows.item(i).value+'\"}';
       (i != result_length-1) && (res +=',');
     };
     res += ']}'
     return $.parseJSON(res);
   });
 });
};
