module.exports = (sequelize, DataTypes, Model) => {
    const User = require("./models/user")(sequelize, DataTypes, Model);
    const Session = require("./models/session")(sequelize, DataTypes, Model);

    // Relationship [User] 1-1 [Session]
    User.hasOne(Session, {
        as: "session",
        foreignKey: "userId",
        onDelete: 'NO ACTION',
        onUpdate: 'CASCADE'
    });
    Session.belongsTo(User, {
        as: "user",
        foreignKey: "userId",
        onDelete: 'NO ACTION',
        onUpdate: 'CASCADE'
    });

    return {
        User,
        Session
    }
}
