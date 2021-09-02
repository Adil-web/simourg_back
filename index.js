const express = require('express')
const router = require('./router/router')
const authRouter = require('./router/authRouter')
const fileUpload = require('express-fileupload')
const path = require('path')
const cors = require("cors")
const PORT = process.env.PORT || 8080
const app = express()

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});
app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(cors());
app.use(fileUpload({}))
app.use('/api', router)
app.use('/auth', authRouter)

app.get('/', (req, res) => {
    res.end('Welcome...')
})

app.listen(PORT, () => console.log(`Server started on port ${PORT}...`))
