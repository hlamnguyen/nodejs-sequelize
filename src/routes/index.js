const express = require("express");
const router = express.Router();
const users = require("./user");
const authenController = require("../controllers/authen");
const middlewareAuthorize = require("../middleware/authorize");

module.exports = function setupRouter(appContext) {
    // signup
    router.post("/api/v1/signup", authenController.signup(appContext));
    // login
    router.post("/api/v1/login", authenController.login(appContext));
    // logout
    router.post("/api/v1/logout", middlewareAuthorize.authorize(appContext), authenController.logout(appContext));
    // user
    router.use("/api/v1/users", middlewareAuthorize.authorize(appContext), users(appContext));
    return router;
}
