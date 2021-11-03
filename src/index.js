const AppContext = require("./common/app-context");
const express = require("express");
const app = express();
const cors = require('cors');
const helmet = require("helmet");
const CONFIG = require('./config');
const responseErrorMiddleware = require("./middleware/res-err");
const MyError = require('./common/error');
const routes = require("./routes");
const Sequelize = require('./database/sequelize');
const TokenService = require('./common/token');
const SessionService = require('./repositories/session');

(async () => {
    try {
        // DB
        const { models, sequelize } = Sequelize(CONFIG.database);
        // Check connect to DB
        await sequelize.authenticate();
        // Create DB
        // await sequelize.sync({alfter: true});
        // await sequelize.sync({force: true});

        // App Context
        const appContext = new AppContext(
            models,
            sequelize,
            new TokenService(
                CONFIG.tokenJWT.token_secret,
                {
                    issuer: CONFIG.tokenJWT.issuer,
                    subject: CONFIG.tokenJWT.subject,
                    audience: CONFIG.tokenJWT.audience,
                    algorithm: CONFIG.tokenJWT.algorithm,
                    expiresIn: CONFIG.tokenJWT.expiresIn
                }
            ),
            new SessionService(models) // SESSION
        );
        // CORS
        app.use(cors());
        app.use(helmet());
        // check connection
        app.get("/ping", (req, res) => {
            res.send("pong");
        });
        // body parse
        app.use(express.urlencoded({ extended: true }));
        app.use(express.json());
        // setup routes index
        app.use(routes(appContext));
        // handle response & error
        app.use(responseErrorMiddleware);
        // Start express server
        app.listen(CONFIG.port, () => {
            console.log(`Server started at http://localhost:${CONFIG.port}`);
        });
    } catch (err) {
        if (err instanceof MyError.MyError) console.log(err);
        console.log(MyError.badRequest("Setup Connection", "Can not setup connection with services.", err));
    }
})();