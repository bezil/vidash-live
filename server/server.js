const express = require('express')
const app = express()
const server = require('http').Server(app)

const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true
});
// const allowedOrigins = [
//     'capacitor://localhost',
//     'https://192.168.1.34:8080/#/',
//     'http://localhost',
//     'http://localhost:8080',
//     'https://localhost:8080'
//   ];

const io = require('socket.io')(server)
io.set('origins', 'https://vidash.live:443');  //https://vidash.live:443


var cors = require('cors')

app.use(cors()) // Use this after the variable declaration

// for mobile server https://192.168.1.34:8080



app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", 'https://vidash.live:443'); // 'https://192.168.1.34:8080' for mobile server
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

const { v4: uuidV4 } = require('uuid')
var tempid = null

app.use('/peerjs', peerServer);

  app.set('view engine', 'ejs')

  app.get('/logs', (req, res) => {
    res.render('logs')
  })


  io.on('connection', socket => {
    socket.on('create-room', (cuser) => {
        tempid = `${uuidV4()}`
        socket.emit ('room_created', tempid);

        app.get(`/${tempid}`, (req, res) => {
                res.send(tempid)
              })
            // tempid = null
    }),
    socket.on('my-name', (roomId, cuser) => {
      socket.to(roomId).broadcast.emit ('cuser', cuser);
    }),
    socket.on('join-room', (roomId, userId , userName) => {


            // check if your room isn't undefined.
        if (io.sockets.adapter.rooms[roomId] === undefined || io.sockets.adapter.rooms[roomId].length === 1)  //  || io.sockets.adapter.rooms[roomId].length === 1
        {

                socket.join(roomId)
                socket.to(roomId).broadcast.emit('user_connected', userId);

                console.log('Room joined: '+ roomId);
                console.log(userName + 'joined: '+ userId );
                socket.to(roomId).broadcast.emit('ouser', userName);

       }
        else{
               console.log('Roomid undefined')

           }


        socket.on('disconnect-user', ( ) => {
            socket.to(roomId).broadcast.emit('user_disconnected', userId);


        })
        socket.on('disconnect', ( ) => {

            socket.to(roomId).broadcast.emit('user_disconnected', userId);


        })
    })
    socket.on('leave-room', (roomId, userId ) => {
        socket.leave(roomId)
        console.log('User left: '+ userId);

        //tempcuser=''
    })
  })



server.listen(process.env.PORT||443,'vidash-web-server.herokuapp.com')
