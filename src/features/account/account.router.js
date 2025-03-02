const express = require('express');
const router = express.Router();
const accountController = require('./account.controller');

router.post('/', accountController.create);
router.get('/', accountController.getAll);
router.get('/:id', accountController.getById);
router.patch('/:id', accountController.update);
router.delete('/:id', accountController.remove);
router.patch('/:id/banned', accountController.banned);

module.exports = router;
