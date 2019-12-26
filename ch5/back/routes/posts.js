const express = require('express');
const db = require('../models');

const router = express.Router();

router.get('/', async (req, res, next) => { // 게시글 여러개
  try {
    const posts = await db.Post.findAll({
      include: [{
        // 게시글 작성자의 아이디와 닉네임
        model: db.User,
        attributes: ['id', 'nickname'],
      }, {
        // 게시글 이미지
        model: db.Image,
      }, {
        // 좋아요 누른 사람 목록 중 아이디
        model: db.User,
        as: 'Likers',
        attributes: ['id'],
      }, {
        // 리트윗한 원본 정보: 작성자의 아이디와 닉네임
        model: db.Post,
        as: 'Retweet',
        include: [{
          model: db.User,
          attributes: ['id', 'nickname'],
        }, {
          // 리트윗한 원본 이미지
          model: db.Image,
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
