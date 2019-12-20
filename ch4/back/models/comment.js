module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {
    charset: 'utf8md4', // 이모티콘 포함
    collate: 'utf8md4_general_ci',
  });
  Comment.associate = (db) => {
    db.Comment.belongsTo(db.User); 
    db.Comment.belongsTo(db.Post);
  };

  return Comment;
}
