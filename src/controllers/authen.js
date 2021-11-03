const Repository = require('../repositories/user')
const Service = require('../services/authen')
const MyResponse = require('../common/response')
const MyError = require('../common/error')
const tableName = "Authentication";

// Signup
module.exports.signup = (appContext) => {
    return async (req, res, next) => {
        try {
            const body = req.body;

            const models = appContext.getDB;
            const repository = new Repository(models);
            const service = new Service(repository);

            const data = await service.signup(body);

            next(MyResponse.newSimpleResponse(`${tableName} Controller`, `Created User successful.`, data))
        } catch (err) {
            if (err instanceof MyError.MyError) next(err);
            else next(MyError.cannotCreateEntity(`${tableName} Controller`, 'User', err));
        }
    }
}

// Login
module.exports.login = (appContext) => {
    return async (req, res, next) => {
        try {
            const body = req.body;

            const tokenService = appContext.getTokenJWT;
            const sessionService = appContext.getSession;

            const models = appContext.getDB;
            const repository = new Repository(models);
            const service = new Service(repository);

            const data = await service.login(body, tokenService, sessionService);

            next(MyResponse.newSimpleResponse(`${tableName} Controller`, `Login successful!`, data));
        } catch (err) {
            if (err instanceof MyError.MyError) next(err);
            else next(MyError.unauthorized(`${tableName} Controller`, `Unauthorized.`, err));
        }
    }
}

// Logout
module.exports.logout = (appContext) => {
    return async (req, res, next) => {
        try {
            const sessionService = appContext.getSession;

            const models = appContext.getDB;
            const repository = new Repository(models);
            const service = new Service(repository);

            const currentUserId = req.currentUser.id;
            const data = await service.logout(currentUserId, sessionService);

            next(MyResponse.newSimpleResponse(`${tableName} Controller`, `Logout successful!`, data));
        } catch (err) {
            if (err instanceof MyError.MyError) next(err);
            else next(MyError.badRequest(`${tableName} Controller`, `Logout fail.`, err));
        }
    }
}