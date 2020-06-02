const funcionarios = require('../db_apis/funcionarios.js');
 
async function get(req, res, next) {
  try
   {
    const context = {}
 
    if (req.query.id)
    {
     context.id = parseInt(req.query.id, 10)
    }

    if (req.query.nome)
    {
     context.nome = req.query.nome
    }

    if (req.query.skip)
    {
      context.skip = parseInt(req.query.skip, 10)
    }
 
    if (req.query.limit)
    {
     context.limit = parseInt(req.query.limit, 10)
    }
    
    context.sort  = req.query.sort
    context.order = req.query.order

    const rows = await funcionarios.find(context)
 
    if (req.params.id)
      {
        if (rows.length === 1) 
        {
          res.status(200).json(rows[0])
        } 
        else
        {
          res.status(404).end()
      
        }
      }
    else 
     {
      res.status(200).json(rows)
     }
  } 
  catch (err) 
   {
    next(err)
   }
} 

module.exports.get = get

function getFuncionarioFromRec(func) {

  const funcionario = {
    id:         func.id,
    nome:       func.nome,
    nascimento: func.nascimento
  }

  return funcionario

}
 
async function post(req, res, next) {
  try
   {
    let funcionario = getFuncionarioFromRec(req.body)
    funcionario = await funcionarios.create(funcionario)

    res.status(201).json(funcionario)

  } 
  catch (err)
   {
    next(err)
   }
}
 
module.exports.post = post;

async function put(req, res, next) {
  try {
    let funcionario    = getFuncionarioFromRec(req.body) 
        funcionario.id = req.params.id ? parseInt(req.params.id, 10) : funcionario.id

    if (!funcionario.id)
     {
       res.status(202).end("ID do Funcionário não informado.") 
     }
    else 
     {
        funcionario = await funcionarios.update(funcionario) 
    
        if (funcionario !== null)
        {
            res.status(200).json(funcionario)
        } 
        else
        {
          res.status(404).end() 
        }
     }
  } 
  catch (err) 
  {
    next(err) 
  }
}
 
module.exports.put = put 

async function del(req, res, next) {
  try
  {
    if (!req.params.id)
    {
      res.status(202).end("ID do Funcionário não informado.") 
    }
    else 
    {
      const id =  parseInt(req.params.id, 10) 
      const success = await funcionarios.delete(id)  
      if (success) 
        {
          res.status(200).end("Exclusão realizada com sucesso.") 
        } 
      else 
       {
         res.status(404).end("Exclusão não realizada, ID do Funcionário inexistente.")
       }
    }
  }
  catch (err)
   {
    next(err) 
   }
}
 
module.exports.delete = del 