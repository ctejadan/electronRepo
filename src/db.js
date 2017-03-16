


//const testFolder = '../DB';
//const fs = require('fs');
//var base = {};
//fs.readdir(testFolder, (err, files) => {
//  files.forEach(file => {
//
//    let key = "knex"+file;
//    let filedir = testFolder+"/"+file
//    base[key] = require('knex')({client: 'sqlite3',connection: {filename: filedir }, useNullAsDefault: true})
//
//  });
//})

//console.log(base);
//crear funcion para conectar a la bdd dentro del objeto

var fs = require('fs');
var sql = require('sql.js');
const testFolder = '../DB';
var base = {};


function queryDB(query,key){

  let filedir = testFolder+"/"+key
  var filebuffer = fs.readFileSync(filedir);
  if(!base[key])
    base[key] = new sql.Database(filebuffer)

  let content = [];

  content = base[key].exec(query)
  //console.log(content);

  let obj2 = [];

  content[0].values.map((a,ix)=>{
    let obj = {};
    if(content[0].columns.length > 1){
      for (let i = 0; i < content[0].columns.length; i++) {
          obj[content[0].columns[i]]=a[i];
          if(i==content[0].columns.length-1){
            obj2.push(obj);
          }
        }
    }
    else{
      obj[0]=a[0]
      obj2.push(obj);
    }
    });
  return obj2
}
