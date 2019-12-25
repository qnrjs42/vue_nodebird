const express = require('express');
const db = require('../models');

const router = express.Router();

router.get('/', async (req, res, next) => { // 게시글 여러개
  try {
    const posts = await db.Post.findAll({
      include: [{
        model: db.User, // 게시글 작성자
        attributes: ['id', 'nickname'], // 작성자의 아이디와 닉네임
      }, {
        model: db.Image, // 게시글 이미지
      }, {
        model: db.User, // 좋아요 누른 사람 목록
        as: 'Likers',
        attributes: ['id'], // 좋아요 누른 사람 아이디
      }, {
        model: db.Post, // 리트윗한 원본
        as: 'Retweet',
        include: [{
          model: db.User, // 원본 작성자
          attributes: ['id', 'nickname'], // 원본 작성자의 아이디와 닉네임
        }, {
          model: db.Image, // 원본 이미지
        }],
      }],
      order: [['createdAt', 'DESC']],
      offset: parseInt(req.query.offset, 10) || 0,
      limit: parseInt(req.query.limit, 10) || 10,
    });
    res.json(posts);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
