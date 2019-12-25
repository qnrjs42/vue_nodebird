const express = require('express');
const multer = require('multer');
const path = require('path');

const db = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

const upload = multer( {
  storage: multer.diskStorage({
    destination(req, file, done) {
        done(null, 'uploads');
    },

    filename(req, file, done) {
       const ext = path.extname(file.originalname);
       const basename = path.basename(file.originalname, ext);
       done(null, basename + Date.now() + ext);
    },
  }),
  limit: { fileSize: 20 * 1024 * 1024 }, // 20MB 제한
});

router.post('/images', isLoggedIn, upload.array('image'), (req, res) => {
  console.log(req.files);
  res.json(req.files.map(v => v.filename));
});

router.post('/', isLoggedIn, async (req, res) => { // POST /post 게시물 작성
  try {
    const hashtags = req.body.content.match(/#[^\s#]+/g);
    const newPost = await db.Post.create({
      content: req.body.content,
      UserId: req.user.id,
    });
    if(hashtags) {
      const result = await Promise.all(hashtags.map(tag => db.Hashtag.findOrCreate( { // db에 태그 찾고 없으면 만들고
        where: { name: tag.slice(1).toLowerCase() }, // 앞글자를 소문자로
      })));
      await newPost.addHashtags(result.map(r => r[0]));
    }
    if(req.body.image) {
      /*
        Array.isArray()로 감싸는 이유
        하나여도 배열로 감싸줘야하는데 일반 텍스트로 넘겨줘서 일관성이 안 맞음
        그래서 하나여도 배열로 감싸줌
      */
      if(Array.isArray(req.body.image)) {
        const images = await Promise.all(req.body.image.map((image) => {
          return db.Image.create({ src: image, PostId: newPost.id });
        }));
      } else {
        const image = await db.Image.create({ src: req.body.image, PostId: newPost.id });
      }
    }
    const fullPost = await db.Post.findOne({
      where: { id: newPost.id },
      include: [{
        model: db.User,
        attributes: ['id', 'nickname'],
      }, {
        model: db.Image,
      }, {
        model: db.User, // 좋아요 누른 사람 목록
        as: 'Likers',
        attributes: ['id'], // 좋아요 누른 사람 아이디
      }],
    });
    return res.json(fullPost);
  } catch(err) {
    console.error(err);
    next(err);
  }
});

// 게시글 지우기
router.delete('/:id', async (req, res, next) => {
  try {
    await db.Post.destroy({
      where: {
        id: req.params.id,
      }
    });
    res.send('삭제했습니다.');
  } catch(err) {
    console.error(err);
    next(err);
  }
});

// 댓글 남기기
router.get('/:id/comments', async (req, res, next) => {
  try {
    // 존재하지 않는 게시글에 댓글 남기는걸 방지
    const post = await db.Post.findOne({ where: { id: req.params.id } });

    if(!post) {
      return res.status(404).send('포스트가 존재하지 않습니다.');
    }
    const comments = await db.Comment.findAll( {
      where: {
        PostId: req.params.id,
      },
      include: [{
        model: db.User,
        attributes: ['id', 'nickname'],
      }],
      order: [['createdAt', 'ASC']], // 생성한순으로 오름차순 정렬
    });
    res.json(comments);

  } catch (err) {
    console.error(err);
    next(err);
  }
});

// POST /post/:id/comment
// :id는 사용자가 1번, 5번 게시글에 댓글을 남길 수 있으니 동적으로 계산
// 댓글 남기기
router.post('/:id/comment', isLoggedIn, async (req, res, next) => {
  try {
    // 존재하지 않는 게시글에 댓글 남기는걸 방지
    const post = await db.Post.findOne({ where: { id: req.params.id } });

    if(!post) {
      return res.status(404).send('포스트가 존재하지 않습니다.');
    }
    const newComment = await db.Comment.create({
      PostId: post.id,
      UserId: req.user.id,
      content: req.body.content,
    });
    const comment = await db.Comment.findOne({
      where: {
        id: newComment.id,
      },
      include: [{
        model: db.User,
        attributes: ['id', 'nickname'],
      }],
    });
    return res.json(comment);

  } catch(err) {
    console.error(err);
    next(err);
  }
});

// 리트윗
router.post('/:id/retweet', isLoggedIn, async (req, res, next) => {
  try {
    const post = await db.Post.findOne({ // 내가 리트윗한 게시글 있는지
      where: { id: req.params.id },
      include: [{
        model: db.Post,
        as: 'Retweet', // 리트윗한 게시글이면 원본 게시글이 됨
      }],
    });
    if(!post) {
      return res.status(404).send('포스트가 존재하지 않습니다.');
    }
    // 자신의 글을 리트윗하는 경우 방지
    if(req.user.id === post.UserId ||
       (post.Retweet && post.Retweet.UserId) === req.user.id) {
        return res.status(403).send('자신의 글은 리트윗할 수 없습니다.');
    }
    const retweetTargetId = post.RetweetId || post.id;
    const exPost = await db.Post.findOne({
      where: {
        UserId: req.user.id,
        RetweetId: retweetTargetId,
      },
    });

    if(exPost) { // 이미 리트윗한 경우
      return res.status(403).send('이미 리트윗했습니다.');
    }
    const retweet = await db.Post.create({ // 리트윗 게시글 등록
        UserId: req.user.id,
        RetweetId: retweetTargetId, // 원본 아이디
        content: 'retweet',
    });

    // 리트윗한 게시글을 바로 띄워주면 원본의 글, 작성자, 이미지가 로드가 안 되기때문에
    // 리트윗을 하고 db에서 글 정보를 가져온다음에 띄워줘야함
    const retweetWithPrevPost = await db.Post.findOne({
      where: { id: retweet.id },
      include: [{
        model: db.User,
        attributes: ['id', 'nickname'],
      }, {
<<<<<<< HEAD
        model: db.User, // 좋아요 누른 사람 목록
        as: 'Likers',
        attributes: ['id'], // 좋아요 누른 사람 아이디
      }, {
=======
>>>>>>> 79985d4d9e438fea0da6a91522b71517109a22a3
        model: db.Post, // 원본 글
        as: 'Retweet', // 원본 글
        include: [{ // 원본 글 작성자
          model: db.User,
          attributes: ['id', 'nickname'],
        }, {
          model: db.Image, // 원본 글 이미지
        }]

      }]
    });
    res.json(retweetWithPrevPost);

  } catch(err) {
    console.error(err);
    next(err);
  }
});

// 좋아요
router.post('/:id/like', isLoggedIn, async (req, res, next) => {
  try {
    // 좋아요 누르기 전에 포스트가 있는지 먼저 체크
    const post = await db.Post.findOne({ where: { id: req.params.id }});
    if(!post) {
      return res.status(404).send('포스트가 존재하지 않습니다.');
    }
    // 게시글에 좋아요 누르면 내 아이디가 추가 됨
    await post.addLiker(req.user.id);
    res.json({ userId: req.user.id });

  } catch (err) {
    console.error(err);
    next(err);
  }
});

// 좋아요 취소
router.delete('/:id/like', isLoggedIn, async (req, res, next) => {
  try {
    // 좋아요 취소 누르기 전에 포스트가 있는지 먼저 체크
    const post = await db.Post.findOne({ where: { id: req.params.id }});
    if(!post) {
      return res.status(404).send('포스트가 존재하지 않습니다.');
    }
    // 게시글에 좋아요 취소 누르면 내 아이디가 빼짐
    await post.removeLiker(req.user.id);
    res.json({ userId: req.user.id });

  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
