const Hash = require('../../helper/hash');

module.exports = (sequelize, DataTypes, Model) => {
    class User extends Model {
    }
    User.init({
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        fullName: {
            type: DataTypes.STRING(120),
            allowNull: false,
            validate: {
                len: [1, 120]
            },
            set(value) {
                this.setDataValue('fullName', value.replace(/\s+/g, ' ').trim());
            }
        },
        userName: {
            type: DataTypes.STRING(30),
            allowNull: false,
            unique: true,
            validate: {
                isAlphanumeric: true,
                len: [1, 30]
            },
            set(value) {
                this.setDataValue('userName', value.toLowerCase());
            }
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                len: [1, 100]
            },
            set(value) {
                this.setDataValue('password', Hash.hashPassword(value))
            }
        },
        isAdmin: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            noUpdate: true
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
    }, {
        sequelize,
        schema: 'dbo',
        timestamps: true,
        paranoid: false,
    })
    return User;
}