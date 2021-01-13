const stock = require('./stock');
const router = require('express').Router();
// const validate= require('../../models/validator');

ivo = 'ivo'

router.get('/', stock.getInitialData);

// router.get('/:id', stock.get);

// router.post('/register', user.post.register);
// // router.post('/register', validate.registerInput('users'), user.post.register);

// router.post('/login', user.post.login);

// router.post('/logout', user.post.logout);

// router.put('/:id', user.put);

// router.delete('/:id', user.delete);

module.exports = router;