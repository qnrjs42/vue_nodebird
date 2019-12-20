module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {
    charset: 'utf8md4', // 이모티콘 포함
    collate: 'utf8md4_general_ci',
  });
  Post.associate = (db) => {
    db.Post.belongsTo(db.User); // UserId가 추가됨
    db.Post.hasMany(db.Comment);
    db.Post.hasMany(db.Image);
  };

  return Post;
}
