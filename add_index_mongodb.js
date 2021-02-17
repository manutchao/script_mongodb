// JSON representation of index list
var data = {
  "index":[
    {
      "collection":"test_collection1",
      "index":"field1",
      "order_by":-1
    },
    {
      "collection":"test_collection2",
      "index":"field3,field2",
      "order_by":1
    },
    {
      "collection":"test_collection3",
      "index":"field1",
      "order_by":1
    }
  ]
}


var prefix_database = "foo";
var prefix_collection = "bar";
var admin_database = "admin";

db = db.getSiblingDB(admin_database);
dbs = db.runCommand({ "listDatabases": 1 }).databases;


// Loop through databases
dbs.forEach(function(database) {
   dbname = database.name;

   // We only use databases starting by prefix_database
   if (dbname.startsWith(prefix_database)) {
     db = db.getSiblingDB(dbname);
     var organization = dbname.replace(prefix_database, "");
     var collections = db.getCollectionNames();

     //Loop through collections
     collections.forEach(function(collection) {

       // We only use collections starting by prefix_collection
       if (collection.startsWith(prefix_collection)) {
         var col = collection.replace(prefix_collection, "");
         print(collection);

         // Loop through index into json file
         for (var i=0 ; i < data.index.length; i++) {

           // If the collection is found into the json file
           if (data.index[i].collection == col) {
             index = data.index[i].index.split(",")
             var obj = new Object();

             // If there is more than one index to create
             if(index.length > 1){

               // Loop through index and build json document for the index creation
               for (var j=0; j < index.length; j++) {
                 obj[index[j]] = data.index[i].order_by;
               }

             }else{
               obj[index[i]] = data.index[i].order_by;

             }
             db[collection].createIndex(obj);
             printjson(db[collection].getIndexes())
           }
         }

       }

     });
   }

});
