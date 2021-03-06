const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const db = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.post('/', isNotLoggedIn, async (req, res, next) => { // 회원가입
  try {
    const hash = await bcrypt.hash(req.body.password, 12);
    // const exUser = await db.User.findOne({
    //   where: {
    //     email: req.body.email,
    //   }
    // });

    // if(exUser) { // 이미 회원가입이 되어있으면
    //   return res.status(403).json({
    //     errorCode: 1,
    //     message: '이미 회원가입 되어있습니다.',
    //   });
    // }
    await db.User.create({
      email: req.body.email,
      password: hash,
      nickname: req.body.nickname,
    });

    passport.authenticate('local', (err, user, info) => { // 에러, 성공, 실패
      if(err) {
        console.error(err);
        return next(err);
      }
      if(info) {
        return res.status(401).send(info.reason);
      }

      return req.login(user, async (err) => { // 세션에 사용자 정보 저장
        if(err) {
          console.error(err);
          return next(err);
        }

        return res.json(user);
      });
    })(req, res, next);
  } catch(err) {
    console.error(err);
    return next(err);
  }
});


router.post('/login',   (req, res, next) => {
  passport.authenticate('local', (err, user, info) => { // 에러, 성공, 실패
    if(err) {
      console.error(err);
      return next(err);
    }
    if(info) {
      return res.status(401).send(info.reason);
    }

    return req.login(user, async (err) => { // 세션에 사용자 정보 저장
      if(err) {
        console.error(err);
        return next(err);
      }

      return res.json(user);
    });
  })(req, res, next);
});

router.post('/logout',  isLoggedIn, (req, res) => {
  if(req.isAuthenticated()) { // 로그인이 되어있을 때
    req.logout(); // 로그아웃
    req.session.destroy(); // 세션 제거
    return res.status(200).send('로그아웃 되었습니다.');
  }
});

module.exports = router;
