const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const passport = require('passport');
const session = require('express-session');
const cookie = require('cookie-parser');
const morgan = require('morgan');

const db = require('./models');
const passportConfig = require('./passport');
const app = express();

db.sequelize.sync();
passportConfig();

app.use(morgan('dev'));
app.use(cors('http://localhost:3000'));
/*
  json으로 압축해서 요청
  express는 json을 받으려면 밑 코드를 작성해야함
*/
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookie('cookiesecret'));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: 'cookiesecret',
}));
app.use(passport.initialize());
app.use(passport.session());

app.disable('etag'); // etag 사용안함

app.get('/', (req, res) => {
  return res.status(200).send('안녕 배크');
});

app.post('/user', async (req, res, next) => {
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
    const newUser = await db.User.create({
      email: req.body.email,
      password: hash,
      nickname: req.body.nickname,
    });


    return res.status(201).json(newUser); // 201: 성공적으로 생산
  } catch(err) {
    console.log(err);
    return next(err);
  }
});

const user = {

};

app.post('/user/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => { // 에러, 성공, 실패
    if(err) {
      console.log(err);
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

app.listen(3085, () => {
  console.log(`백엔드 서버 ${3085}번 포트에서 작동중.`);
});
