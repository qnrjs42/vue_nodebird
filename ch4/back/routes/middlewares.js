/*
  module.exports 우선권이 더 높으며, 이 모듈 사용 시 exports.객체 사용못함
  exports.객체
*/

exports.isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) { // 로그인 되어있는지
    return next(); // next는 다음 미들웨어로 넘어감 // 인수가 있으면 에러처리
  }

  return res.status(401).send('로그인이 필요합니다.');
};

exports.isNotLggedIn = (req, res, next) => {
  if(!req.isAuthenticated()) { // 로그인 되어있는지
    return next();
  }

  return res.status(401).send('로그인한 사람은 이용할 수 없습니다.');
};
