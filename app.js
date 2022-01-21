const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express()
const PORT = process.env.PORT || 5000
const { MONGOURI } = require('./config/keys')

app.use(cors())


mongoose.connect(MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
mongoose.connection.on('connected', () => {
    console.log('Connected to mongoose')
})
mongoose.connection.on('error', (err) => {
    console.log('Error while connecting', err)
})

require('./models/user')
require('./models/post')

app.use(express.json())

app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))

if (process.env.NODE_ENV == "production") {
    app.use(express.static('client/buid'))
    const path = require('path')
    app.get("*", (req, res) => {
        res.send(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

app.listen(PORT, () => {
    console.log(`app is running on PORT ${PORT}`)
}) 