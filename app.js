const express = require('express');
const app = express();
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
var http = require('http').Server(app);
const io = require('socket.io')(http);
const cors = require('cors')
const { Server } = require('socket.io')

//const io = new Server();
require('dotenv/config'); 
app.use(bodyParser.json())
app.use(cors());

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
io.on('conection', socket => { 
    console.log("Nuevo socket conectado")

    socket.broadcast.emit('user-connected', { socketId: socket.id}); 
    socket.on('increment', (votacionTotal) => { 
        console.log("increment")
        io.socket.emit("COUNTER_INCREMENT", votacionTotal +1)
    })
    socket.on('decrement', (votacionTotal) => { 
        console.log("decrement")
        io.socket.emit("COUNTER_DECREMENT", votacionTotal -1)
    }),
    socets.on('newQuestion', {
            text: 'SUPERMAN'
        })
})

/*http.listen(3001, () => { 
    console.log("listening")
})*/

//DB conect
mongoose.connect(process.env.DB_CONECT,
    connectionParams,
    () => console.log('connect to DB')
)
//app.listen(4000);

app.listen(3001, () => { 
    console.log("listening port 3001")
})

