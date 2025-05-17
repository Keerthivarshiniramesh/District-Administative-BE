const Express = require('express')
require('dotenv').config()
const mongoose = require('mongoose')
const session = require('express-session')
const mongoSession = require('connect-mongodb-session')(session)
const cors = require('cors')



const app = Express()

const AuthRouter = require('./router/AuthRouter')
const DeptRouters = require('./router/DepartmentRouter')

app.use(Express.json())
app.use(Express.urlencoded({ extended: true }))

app.use(cors({
    origin: ['http://localhost:3000'],
    credentials: true
}))

mongoose.connect(process.env.Mongo_DB)
    .then(() => console.log("MongoDb connected Successfully"))
    .catch((err) => console.log("Error in connecting", err))

const Store = new mongoSession({
    uri: process.env.Mongo_DB,
    collection: 'Sessions'
})

app.use(session({
    saveUninitialized: false,
    secret: process.env.Secret_Key,
    resave: true,
    store: Store
}))


app.use(AuthRouter)
app.use(DeptRouters)

app.listen(process.env.PORT, () => {
    console.log("Server Running in ", process.env.PORT)
})