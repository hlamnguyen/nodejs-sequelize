const BaseRepository = require('./base');
const defaultFields = ['id', 'fullName', 'userName', 'isAdmin', 'updatedAt'];

class UserRepository extends BaseRepository {
    constructor(models) {
        super(models.User, models);
    }

    getAll(page, limit, fields = null, conditions = null, include = null) {
        if (!fields){
            fields = defaultFields;
        } else {
            fields = fields.filter(field => defaultFields.some(defaultField => defaultField === field));
        }
        return super.getAll(page, limit, fields, conditions, include, false);
    }

    getById(id, fields = null, include = null, paranoid = false) {
        if (!fields) fields = defaultFields;
        return super.getById(id, fields, include, paranoid);
    }

    getOne(conditions, fields = null, include = null) {
        if (!fields) fields = defaultFields;
        return super.getOne(conditions, fields, include);
    }

    addItem(data, transaction = null) {
        const fields = ['fullName', 'userName', 'password', 'lastLoginDate', 'isAdmin'];
        return super.addItem(data, fields, transaction);
    }

    updateItem(data, conditions, transaction = null) {
        const fields = ['fullName', 'userName', 'password', 'lastLoginDate', 'isAdmin'];
        return super.updateItem(data, conditions, fields, transaction);
    }

    deleteItem(conditions, transaction = null) {
        return super.deleteItem(conditions, true, transaction);
    }
}

module.exports = UserRepository