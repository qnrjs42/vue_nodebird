const express = require('express');
const app = express();

/*
  json으로 압축해서 요청
  express는 json을 받으려면 밑 코드를 작성해야함
*/
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.get('/', (req, res) => {
  res.status(200).send('안녕 배크');
});


app.post('/user', (req, res) => {
  req.body.email;
  req.body.password;
  req.body.nickname;
});

app.listen(3085, () => {
  console.log(`백엔드 서버 ${3085}번 포트에서 작동중.`);
});
