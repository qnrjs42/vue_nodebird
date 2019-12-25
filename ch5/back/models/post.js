module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {
    charset: 'utf8mb4', // 이모티콘 포함
    collate: 'utf8mb4_general_ci',
  });
  Post.associate = (db) => {
    db.Post.belongsTo(db.User); // UserId가 추가됨
    db.Post.hasMany(db.Comment);
    db.Post.hasMany(db.Image);

    db.Post.belongsToMany(db.User, { // 좋아요
      through: 'Like',
      as: 'Likers'
    });

<<<<<<< HEAD
    db.Post.belongsTo(db.Post, { as: 'Retweet' }); // 리트윗
=======
    db.Post.belongsTo(db.Post, { as: 'Retwwet' }); // 리트윗
>>>>>>> 79985d4d9e438fea0da6a91522b71517109a22a3
    db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' });
  };

  return Post;
}
