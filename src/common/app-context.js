class AppContext {
    #db;
    #sequelize;
    #tokenJWT;
    #session;

    constructor(db, sequelize, tokenJWT, session) {
        this.#db = db;
        this.#sequelize = sequelize;
        this.#tokenJWT = tokenJWT;
        this.#session = session;
    }

    get getDB(){
        return this.#db;
    }
    
    get getSequelize(){
        return this.#sequelize;
    }
    
    get getTokenJWT(){
        return this.#tokenJWT;
    }

    get getSession(){
        return this.#session;
    }
}

module.exports = AppContext