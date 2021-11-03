const MyError = require('../common/error');
const Hash = require('../helper/hash');

class AuthenService {
    constructor(repository) {
        this.repository = repository;
        this.tableName = this.repository.tableName;
    }

    async signup(data) {
        try {
            const { userName } = data;
            if (!userName) throw MyError.badRequest(`${this.tableName} Service`, "Username is required!");
            const where = {
                userName: userName
            }

            const userExist = await this.repository.getOne(where, ['id']);

            if (userExist) throw MyError.badRequest(`${this.tableName} Service`, "Username already exist!");

            // Signup is normal user
            delete data.isAdmin
            
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

    async login(item, tokenService, sessionService) {
        try {
            const {
                userName: itemUserName,
                password: itemPassword
            } = item;

            const fields = ['id', 'fullName', 'userName', 'password', 'isAdmin'];
            const userExist = await this.repository.getOne({ userName: itemUserName.toLowerCase() }, fields);

            // Check user is exist.
            if (!userExist) throw MyError.badRequest(`Authentication Service`, "User is not found!");

            const [checkPassword, userSession] = await Promise.all([
                Hash.compareHash(itemPassword, userExist.password), // Compare password with userExist.
                sessionService.getOne(userExist.id) // Check user have session
            ]);

            // Check user correct pass.
            if (!checkPassword) throw MyError.badRequest(`Authentication Service`, "Invalid password!");

            // Data for body tokenJWT
            const data = {
                id: userExist.id,
                isAdmin: userExist.isAdmin
            }

            // Create token
            const accessToken = tokenService.sign(data, userExist.email);

            // User data for logged in
            const { password, ...restDataUser } = userExist.toJSON();

            // Update session and Update User
            if (userSession) { // if user is already in session or used to login system, update
                await sessionService.updateItem(userSession.userId, accessToken);
            } else {
                await sessionService.addItem(userExist.id, accessToken);
            }

            return {
                accessToken: accessToken,
                user: {
                    ...restDataUser
                }
            }
        } catch (err) {
            if (err instanceof MyError.MyError) throw err;
            throw MyError.unauthorized(`Authentication Service`, `Unauthorized.`, err);
        }
    }

    async authorized(token, tokenService, sessionService) {
        try {
            // Verify the token
            const decoded = tokenService.verify(token);
            const { id: userId } = decoded;

            // Check user have session
            const userExistSession = await sessionService.getOne(userId, token);

            // Check token out of session
            if (!userExistSession) throw MyError.badRequest(`Authentication Service`, "Token out of session!");

            const userExist = await this.repository.getById(userId, ['id', 'isAdmin'], null, true);
            // Check user is not exist.
            if (!userExist) throw MyError.badRequest(`Authentication Service`, "User is not found!");
            return userExist;
        } catch (err) {
            if (err instanceof MyError.MyError) throw err;
            throw MyError.cannotGetEntity(`Authentication Service`, this.tableName, err);
        }
    }

    async logout(currentUserId, sessionService) {
        try {
            if (!currentUserId) throw MyError.badRequest(`Authentication Service`, "ID from token is not found!");

            // Check user have session
            const userExistSession = await sessionService.getOne(currentUserId);

            // User has already logged out.
            if (!userExistSession) throw MyError.badRequest(`Authentication Service`, "User has already logged out!");

            // User still logged in.
            await sessionService.deleteItem(currentUserId);

            return {
                id: currentUserId
            }
        } catch (err) {
            if (err instanceof MyError.MyError) throw err;
            throw MyError.cannotDeleteEntity(`Authentication Service`, this.tableName, err);
        }
    }
}

module.exports = AuthenService