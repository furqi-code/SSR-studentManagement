const express = require('express');
const Router = express.Router();

Router.post('/', function(req, res) {
    res.clearCookie("user_detail");
    res.status(200).send("Logged out successfully");
});

module.exports = {
    logoutRouter: Router
};
