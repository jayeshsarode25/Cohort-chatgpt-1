const express = require('express');
const cookieparser = require('cookie-parser');
const authRouter = require('./routes/auth.route');
const chatRouter = require('./routes/chat.routes');



const app = express();
app.use(express.json());
app.use(cookieparser());



app.use('/api/auth', authRouter);
app.use('/api/chat', chatRouter);

module.exports = app;