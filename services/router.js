const express = require('express');
const router = new express.Router();
const funcionarios = require('../controllers/funcionarios.js');

// router.route('/funcionarios/:id?')
//   .get(funcionarios.get);

router.route('/funcionarios/:id?')
  .get(funcionarios.get)
  .post(funcionarios.post)
  .put(funcionarios.put)
  .delete(funcionarios.delete);

module.exports = router;