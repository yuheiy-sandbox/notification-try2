'use strict';
import path from 'path';
import http from 'http';
import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import session from 'express-session';
import flash from 'connect-flash';
import csrf from 'csurf';
import passport from 'passport';
import { Strategy } from 'passport-local';
import mongoose from 'mongoose';
import connectMongo from 'connect-mongo';
import socketIo from 'socket.io';
import compression from 'compression';
import { Work } from './models/database';
import routes from './routes/index';
import admin from './routes/admin';

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(new Strategy((username, password, done) => {
  const { ADMIN_USERNAME, ADMIN_PASSWORD } = process.env;

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    done(null, username);
    return;
  }

  done(null, false);
}));

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const MongoStore = connectMongo(session);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));
app.use(csrf({ cookie: true }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(compression());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/', routes);
app.use('/admin', admin);

io.on('connection', socket => {
  if (socket.handshake.headers.host !== process.env.HEROKU_URL) {
    return;
  }

  const getAll = () => {
    return new Promise(done =>
      Work.find({}).sort({ modified: 1 })
        .then(docs => done(docs))
    );
  };

  getAll()
    .then(docs => io.emit('update', docs));

  socket.on('create', data => {
    const work = new Work(data);

    work.save()
      .then(getAll)
      .then(docs => io.emit('update', docs));
  });

  socket.on('edit', (id, data) => {
    data.modified = new Date();

    Work.findByIdAndUpdate(id, data)
      .then(getAll)
      .then(docs => io.emit('update', docs));
  });

  socket.on('delete', id => {
    Work.findByIdAndRemove(id)
      .then(getAll)
      .then(docs => io.emit('update', docs));
  });

  socket.on('change', (workId, creatorId, state) => {
    Work.findById(workId)
      .exec((err, result) => {
        result.creators.id(creatorId).state = state;
        return result.save();
      })
      .then(getAll)
      .then(docs => io.emit('update', docs));
  });
});

server.listen(process.env.PORT || 3000);
