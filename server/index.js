'use strict';
import path from 'path';
import http from 'http';
import express from 'express';
import socketIo from 'socket.io';
import routes from './routes/index';

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/', routes);

io.on('connection', socket => {
  io.emit('init', 'test data');
});

server.listen(process.env.PORT || 3000);
