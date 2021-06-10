const express = require('express');
const app = express();
var http = require('http').Server(app);
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const io = require('socket.io')(http, {cors: {origin:'*'}});
const cors = require('cors')
const { Server } = require('socket.io')
const userRoute = require('./routes/user')
const askRoute = require('./routes/preguntas')
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

app.use('/user', userRoute);
app.use('/ask', askRoute);
const valor1 = 0;

//Sockets
var currentConnections = {

};
io.on('connection', socket => { 
    console.log("Nuevo socket conectado")
    console.log(currentConnections)
    /*socket.emit('newMessage', {
        text:'WHAT'
    })*/
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
        io.emit('newMessage', {
            survey: data
        })
        currentConnections = {survey: data}
        console.log(data)
    })
    
    socket.on('newVote1', (data) => { 
        console.log('entraVotación', data)
        currentConnections.votacion1 =data+1
        console.log(currentConnections)
        io.emit('newVote1', data),
        io.emit('votacion')
    }),
    socket.on('newVote2', (data) => { 
        console.log('VOTACION2', data)
            io.emit('newVote2', data)
    }),
    socket.on('newVote3', (data) => { 
        console.log('VOTACION333332', data)
            io.emit('newVote3', data)
        })  
})




//DB conect
mongoose.connect(process.env.DB_CONECT,
    connectionParams,
    () => console.log('connect to DB')
)
http.listen(3001);

