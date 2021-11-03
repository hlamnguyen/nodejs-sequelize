const BaseService = require('../services/base');
const MyError = require('../common/error');
const Hash = require('../helper/hash');
const Utilities = require('../helper/utilities');
const { Op } = require('sequelize');

class UserService extends BaseService {
    constructor(repository, currentUser) {
        super(repository, currentUser);
    }

    async getAll(page, limit, query) {
        try {
            if (!this.currentUser.isAdmin) throw MyError.forbidden(`${this.tableName} Service`);
            const conditions = query.fullName ? {
                fullName: {
                    [Op.substring]: `${query.fullName}`
                }
            } : null;
            if (query.fields) query.fields = Utilities.removeAllSpaceString(query.fields).split(',');
            const { count, rows } = await this.repository.getAll(page, limit, query.fields, conditions);
            return {
                total: count,
                data: rows
            };
        } catch (err) {
            if (err instanceof MyError.MyError) throw err;
            throw MyError.cannotListEntity(`${this.tableName} Service`, this.tableName, err);
        }
    }

    async getById(userId) {
        try {
            if (!this.currentUser.isAdmin) {
                if (this.currentUser.id !== userId) throw MyError.forbidden(`${this.tableName} Service`);
            }
            const user = await this.repository.getById(userId);
            // Check user is exist.
            if (!user) throw MyError.badRequest(`${this.tableName} Service`, "User is not found!");
            return user;
        } catch (err) {
            if (err instanceof MyError.MyError) throw err;
            throw MyError.cannotGetEntity(`${this.tableName} Service`, this.tableName, err);
        }
    }

    async create(data) {
        try {
            if (!this.currentUser.isAdmin) throw MyError.forbidden(`${this.tableName} Service`);
            const where = {
                userName: data.userName
            }

            const userExist = await this.repository.getOne(where, ['id']);

            if (userExist) throw MyError.badRequest(`${this.tableName} Service`, "Username already exist!");

            // Create
            const result = await this.repository.addItem(data);

            return {
                id: result.id
            };
        } catch (err) {
            if (err instanceof MyError.MyError) throw err;
            throw MyError.cannotCreateEntity(`${this.tableName} Service`, this.tableName, err);
        }
    }

    async update(userId, data) {
        try {
            if (!this.currentUser.isAdmin) { // User is not an admin
                delete data.isAdmin;
            }

            if (this.currentUser.id !== userId) { // Only user can change their own password
                delete data.oldPassword;
                delete data.password;
            }

            const atributes = ['id', 'fullName', 'userName', 'password', 'isAdmin', 'createdAt', 'updatedAt'];

            const userExist = await this.repository.getById(userId, atributes);
            if (!userExist) throw MyError.badRequest(`${this.tableName} Service`, "User is not found!");

            // Change password
            if (data.oldPassword && data.password) {
                if (data.oldPassword === data.password) throw MyError.badRequest(`${this.tableName} Service`, "Old Password is not the same as New Password!");
                if (!await Hash.compareHash(data.oldPassword, userExist.password)) throw MyError.badRequest(`${this.tableName} Service`, "Password is not correct!");
            } else delete data.password;

            // Update
            const result = await this.repository.updateItem(data, { id: userId });

            return {
                rowEffects: result.length
            };
        } catch (err) {
            if (err instanceof MyError.MyError) throw err;
            throw MyError.cannotUpdateEntity(`${this.tableName} Service`, this.tableName, err);
        }
    }

    async delete(userId, sequelize, sessionService) {
        try {
            if (!this.currentUser.isAdmin) throw MyError.forbidden(`${this.tableName} Service`);

            const fields = ['id'];

            const [userExist, userExistSession] = await Promise.all([
                this.repository.getById(userId, fields),
                sessionService.getOne(this.currentUser.id)
            ]);

            // Check user is exist.
            if (!userExist) throw MyError.badRequest(`${this.tableName} Service`, "User is not found or deleted!");

            const conditions = {
                id: userId
            };

            if (userExistSession) {
                await sequelize.transaction(async (trans) => {
                    await sessionService.deleteItem(userId, trans);
                    await this.repository.deleteItem(conditions, trans);
                });
            } else {
                await this.repository.deleteItem(conditions);
            }

            return {
                id: userId
            }
        } catch (err) {
            if (err instanceof MyError.MyError) throw err;
            throw MyError.cannotDeleteEntity(`${this.tableName} Service`, this.tableName, err);
        }
    }
}

module.exports = UserService