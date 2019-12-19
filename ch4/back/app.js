const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');

const db = require('./models');
const app = express();

db.sequelize.sync();

app.use(cors('http://localhost:3000'));
/*
  json으로 압축해서 요청
  express는 json을 받으려면 밑 코드를 작성해야함
*/
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.get('/', (req, res) => {
  res.status(200).send('안녕 배크');
});


app.post('/user', async (req, res, next) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 12);
    const newUser = await db.User.create({
      //where: {
        email: req.body.email,
        password: hash,
        nickname: req.body.nickname,
      //}
    });

    res.status(201).json(newUser); // 201: 성공적으로 생산
  } catch(err) {
    console.log(err);
    next(err);
  }
});

app.listen(3085, () => {
  console.log(`백엔드 서버 ${3085}번 포트에서 작동중.`);
});
