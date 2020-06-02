const oracledb = require('oracledb')
const _        = require('lodash')
const moment   = require('moment')
const database = require('../services/database.js')
 
const baseQuery =  `select ID,NOME, NASCIMENTO from funcionarios Where 1=1 `
 
async function find(filtro) {

  let query   = baseQuery 
  const binds = {} 
  let column,order

 const filtroUppercase = _.mapValues(filtro, value => _.isString(value) ? value.toUpperCase() : value)
  
//  console.log("context",filtroUppercase)

 if (filtro.id) {
    const id = filtro.id
    query += `\nAnd id = ${id}`  
  }

  if (filtro.nome) {
    const nome = filtro.nome+'%'
    query += `\nAnd lower(nome) like lower('${nome}')`
  }

const sortableColumns = ['id', 'nome', 'nascimento'];
 
  if (filtro.sort === undefined) {
      query += '\norder by id asc'
  } else {
          column = filtro.sort     
          if (!sortableColumns.includes(column)) {
              throw new Error('Invalid "sort" column')
          } 
          if (filtro.order === undefined) {
              order = 'asc'
          }
          else {
              order  = filtro.order 
          }

          if (order !== 'asc' && order !== 'desc') {
            order = 'asc'
            // throw new Error('Ordem de "classificação" inválida')
          } 

          query += `\norder by ${column} ${order}`

  }

  if (filtro.skip) {
      binds.row_offset = filtro.skip 
      query += '\noffset :row_offset rows'
  }
 
  const limit = (filtro.limit > 0) ? filtro.limit : 30;
 
  binds.row_limit = limit; 
  query += '\nfetch next :row_limit rows only';
 
 const result = await database.simpleExecute(query, binds)

 return result.rows

} 
 
module.exports.find = find

 
async function create(func) {
  const funcionario = Object.assign({}, func);

  const func_id = {
    dir: oracledb.BIND_OUT,
    type: oracledb.NUMBER
  }

const func_nascimento = `to_date('${funcionario.nascimento}','dd/mm/yyyy')`
const func_nome = funcionario.nome
// const func_id =  0

const createSql =
 `insert into funcionarios (
    nome,
    nascimento
  ) values (
    :nome,
    :nascimento
  )  RETURNING ID
  INTO :func_id `

const binds = [funcionario.nome,funcionario.nascimento,func_id ]

// const options = {
//   func_id: [
//     { type : oracledb.NUMBER, dir : oracledb.BIND_OUT }
//   ]
// };

// console.log("binds..antes:",binds);
const result = await database.simpleExecute(createSql, binds)
const resId = result.outBinds[[0]]
funcionario.id =resId[0]
funcionario.rowid= result.lastRowid
// console.log("Create..:",result)
// console.log("Create..outBinds:",funcionario);
// console.log("binds..outBinds:",binds);


  return funcionario
}
 
module.exports.create = create


 
async function update(emp) {

  const funcionario = Object.assign({}, emp)

  const updateSql =
  `update funcionarios
   set nome       = :nome,
       nascimento = :nascimento
   where id = :func_id`

  const func_id = emp.id
  const func_nascimento = `to_date('${funcionario.nascimento}','dd/mm/yyyy')`
  const func_nome =  funcionario.nome

   const binds = [funcionario.nome,funcionario.nascimento,func_id]
  // console.log("update...",updateSql)
  // console.log("update parm2:",binds)
  // console.log("update parm1:",func_nome)
  // console.log("update parm2:",func_nascimento)
  

  const result = await database.simpleExecute(updateSql, binds);
 
  if (result.rowsAffected && result.rowsAffected === 1) 
  {
    return funcionario
  } 
  else 
  {
    return null
  }
}
 
module.exports.update = update


 
async function del(id) {
  const deleteSql =
 `begin
 
    delete from funcionarios
    where id = :func_id;
 
    :rowcount := sql%rowcount;
 
  end;`

  const binds = {
    func_id: id,
    rowcount: {
      dir: oracledb.BIND_OUT,
      type: oracledb.NUMBER
    }
  }

  const result = await database.simpleExecute(deleteSql, binds)
 
  return result.outBinds.rowcount === 1
}
 
module.exports.delete = del