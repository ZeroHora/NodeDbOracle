const oracledb = require('oracledb');
const dbConfig = require('../config/database.js');
 
async function initialize() {
  console.log('Inicializando o módulo de banco de dados');
  console.log("Oracle Client library version:", oracledb.oracleClientVersionString);
  // console.log("pool :",dbConfig.hrPool)
  const pool = await oracledb.createPool(dbConfig.hrPool);
}
 
module.exports.initialize = initialize;

// *** previous code above this line ***
 
async function close() {
  console.log('Fechando o módulo de banco de dados');
  await oracledb.getPool().close();
  console.log('Fechado o módulo de banco de dados');
  
//   return new Promise((resolve, reject) => {
//     oracledb.getPool().close((err) => {
//      if (err) {
//        reject(err);
//        console.log('Fechado o módulo de banco de dados com erro',err);
//      }

//      resolve();
//      console.log('Fechado o módulo de banco de dados');
//    });
//  });
}
 
module.exports.close = close;


 
function simpleExecute(statement, binds = [], opts = {}) {
  return new Promise(async (resolve, reject) => {
    let conn
 
    opts.outFormat = oracledb.OBJECT;
    opts.autoCommit = true;
 
    try
     {
      conn = await oracledb.getConnection() 
      const result = await conn.execute(statement, binds, opts) 
      resolve(result)
     }
    catch (err) 
     {
       reject(err)
      } 
     finally
      {
        if (conn) 
          { 
            try
              {
                await conn.close()
              } 
            catch (err)
              {
                console.log(err)
              }
          }
      }
  })
}
 
module.exports.simpleExecute = simpleExecute;