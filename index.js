const env = process.env.NODE_ENV || 'development';
const config = require('./config/config')[env];

const express = require('express');
const app = express()
const cors = require('cors');

const connectDB = require('./config/connectDB')
const stockRouter = require('./src/stock/routerStock');
const editRouter = require('./src/edit/routerEdit');

connectDB().then(() => {
    console.log('connected')

    app.use(cors());
    // app.use((req, res, next) => {
    //     res.header('Access-Control-Allow-Origin', '*');
    //     next();
    //   });
    // {origin: "http://localhost:3000", allowedHeaders: ['Content-Type', 'Auth']}

    app.use(express.json())
    // app.use(express.urlencoded({ extended: true }))

    // app.use(cookieParser())

    app.use('/api/stock', stockRouter);
    app.use('/api/edit', editRouter);
    app.use('*', (req, res, next) => res.send('<h1> Something went wrong. Try again. :thumbsup: </h1>'))

    app.use(function (err, req, res, next) {
        console.error(err.message);
        res.status(500).send(err.message);
        console.log('*'.repeat(90))
    });

    app.listen(config.port, console.log(`Listening on port ${config.port}! Now its up to you...`));
})
