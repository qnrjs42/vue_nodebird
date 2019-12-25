module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING(40), // 40자 이내
      allowNull: false, // 필수 (공백이면 x)
      unique: true, // 중복금지
    },
    nickname: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  }, {
    charset: 'utf8',
    collate: 'utf8_general_ci', // 한글 저장
  });

  User.associate = (db) => {
    db.User.hasMany(db.Post);
    db.User.hasMany(db.Comment);
    db.User.belongsToMany(db.Post, { // 좋아요
      through: 'Like',
      as: 'Liked'
    });

    db.User.belongsToMany(db.User, {
      through: 'Follow',
      as: 'Followers', // 나를 팔로워 하는 사람들을 가져옴
      foreignKey: 'followingId'
      // 날 팔로워 하는 사람들을 가져오려면 팔로잉 아이디가 내 아이디어야함
    });

    db.User.belongsToMany(db.User, {
      through: 'Follow',
      as: 'Followings', // 내가 팔로잉 하는 사람들을 가져옴
      foreignKey: 'followerId'
      // 내가 팔로잉 하는 사람들을 가져오려면 팔로워 아이디가 내 아이디어야함
    });
  };

  return User;
}
