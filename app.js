const express = require('express')
const app = express()
const siteRouter = require('./routes/site');
const path = require('path');
const session = require('express-session');
const sessionMiddleware = session({ secret: 'keyboard cat', resave: false,
    saveUninitialized: false, cookie: { maxAge: 1000 * 60 * 60 * 2 }}); // 2 hours

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('sessionMiddleware', sessionMiddleware);
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(sessionMiddleware);
app.use(siteRouter);

module.exports = app;