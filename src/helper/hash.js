const hash = require('bcrypt');

module.exports.hashPassword = (value) => {
    try {
        return hash.hashSync(value, 10);
    } catch (err) {
        throw err
    }
}

module.exports.compareHash = (value, encrypted) => {
    try {
        return hash.compare(value, encrypted);
    } catch (err) {
        throw err
    }
}