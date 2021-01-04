const express = require('express');
const app = express();
var http = require('http').Server(app);
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const io = require('socket.io')(http, {cors: {origin:'*'}});
const cors = require('cors')
const { Server } = require('socket.io')
//const io = new Server();
require('dotenv/config');
app.use(bodyParser.json())
app.use(cors())

//configuration
const connectionParams={
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true 
}

//Import routs middleware
const userRoute = require('./routes/user')
app.use('/user', userRoute)


//Sockets
io.on('connection', socket => { 
    console.log("Nuevo socket conectado")

    socket.emit('newMessage', {
        text:'WHAT'
    })
    socket.on('increment', (votacionTotal) => { 
        console.log("increment")
        io.socket.emit("COUNTER_INCREMENT", votacionTotal +1)
    })
    socket.on('decrement', (votacionTotal) => { 
        console.log("decrement")
        io.socket.emit("COUNTER_DECREMENT", votacionTotal -1)
    })
    socket.on('newMessage', (data) => { 
        console.log("mensajenuevoSOCKET")
        socket.emit('newMessage', {
            text:data.data + 'SERVER FERCHO '
        })
    } )
})



//DB conect
mongoose.connect(process.env.DB_CONECT,
    connectionParams,
    () => console.log('connect to DB')
)
http.listen(3001);

