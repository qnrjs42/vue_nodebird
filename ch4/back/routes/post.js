const express = require('express');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

router.post('/images', isLoggedIn, (req, res) => {

});

router.post('/', isLoggedIn, (req, res) => { // POST /post 게시물 작성

});

module.exports = router;
