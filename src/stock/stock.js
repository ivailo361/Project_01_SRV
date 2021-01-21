const env = process.env.NODE_ENV || 'development';
const config = require('../../config/config')[env];
const bcrypt = require('bcrypt');
const { generateToken, decodeToken } = require('../../models/auth')

const MongoDB = require("../../models/mongo");
const db = new MongoDB();

async function getInitialData(req, res, next) {
    try {
        console.log('I am here')
        const getData = await Promise.all([db.getData('servers'), db.getData('types')])
        const result = [...getData[0], ...getData[1]]
        if (result.length === 0) {
            res.status(404).json('Sorry, we cannot find that!')
        }
        res.status(200).json(getData)
    }
    catch (e) {
        res.status(400).json('No connection with DB')
    }
}

async function register(req, res, next) {
    try {
        const { email, password, } = req.body;
        const salt = config.db_saltRounds
        const hashed = await bcrypt.hash(password, salt)
        const result = await db.insertUser('users', { email, password: hashed })
        if (result.insertedCount === 0) {
            res.status(404).json('the user was not created please try again later')
            return
        }
        const response = {insertedCount: 1, user: email}
        res.status(200).json(response)
    }
    catch (e) {
        res.status(400).json(e.message)
    }
}

async function login(req, res,) {
    try {
        console.log(req.body)
        const { email, password } = req.body;
        const user = await db.getData('users', { email })
        const { password: pass } = user[0]

        if (user.length === 0) {
            res.status(401).json('Invalid user')
            return
        }
        const isMatched = await bcrypt.compare(password, pass ? pass : '')
        if (!isMatched) {
            res.status(403).json('Invalid password')
            return
        }
        const token = generateToken({ email }, { expiresIn: '200m' })
        const response = {login:'ok', user: email, token}
    
        res.status(200).json(response)

    }
    catch (e) {
        res.status(400).json('The user was not found')
    }
}



let old = {
    get: async (req, res, next) => {

    },

    post: {
        register: async (req, res, next) => {
            try {
                console.log(req.body)
                // if (req.body) {
                //     throw new Error("it is a bug")
                // }
                const { email, password, image } = req.body;
                let salt = config.db_saltRounds
                let hashed = await bcrypt.hash(password, salt)
                let result = await db.insertUser('users', { email, password: hashed, image })
                console.log(result.insertedCount)
                if (result.insertedCount === 0) {
                    res.status(406).json('Not registered')
                }
                res.status(200).json(result)
            }
            catch (e) {
                next(e)
            }
        },
        login: async (req, res, next) => {
            try {

                console.log(req.body)
                const { email, password } = req.body;
                const user = await db.getDataAll('users', { email })
                if (user.length === 0) {
                    res.status(401).json('Invalid user')
                    return
                }
                const isMatched = await bcrypt.compare(password, user[0].password ? user[0].password : '')
                if (!isMatched) {
                    res.status(403).json('Invalid password')
                    return
                }
                const token = generateToken({ email }, { expiresIn: '200m' })

                const authorId = user[0]._id
                const authorEmail = user[0].email
                res.status(200).json({ authorId, authorEmail, token })
            }
            catch (e) {
                next(e)
            }
        },
    },
}

module.exports = {
    getInitialData,
    register,
    login,
}