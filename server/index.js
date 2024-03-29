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
import nodemailer from 'nodemailer';
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
  const { host, referer } = socket.handshake.headers;
  const { HEROKU_URL, GMAIL_ADDRESS, GMAIL_PASSWORD } = process.env;
  const isAdmin = referer === `https://${HEROKU_URL}/admin/`;

  if (host !== HEROKU_URL) {
    return;
  }

  const STANDING = 1;
  const NOTIFY = 2;
  const TAKEN = 3;

  const wait = delay => new Promise(done => setTimeout(done, delay));

  const update = () => {
    return Work.find({}).sort({ modified: 1 })
      .then(docs => {
        // この実装やばいので後で直す
        if (!isAdmin) {
          docs.forEach(doc =>
            doc.creators.forEach(creator => creator.email = undefined)
          );
        }

        io.emit('update', docs);
      });
  };

  const changeState = (workId, creatorId, state, auto = false) => {
    return Work.findById(workId)
      .then(result => {
        const creator = result.creators.id(creatorId);

        if (auto) {
          if (creator.state === NOTIFY) {
            creator.state = state;
          }
        } else {
          creator.state = state;
        }

        return result.save();
      });
  };

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: GMAIL_ADDRESS,
      pass: GMAIL_PASSWORD
    }
  });

  const sendMail = (workId, creatorId) => {
    return Work.findById(workId)
      .then(result => {
        const { name, email } = result.creators.id(creatorId);

        // for debug
        // return new Promise(done => setTimeout(() => {
        //   console.log(`send mail to ${email}`);
        //   done();
        // }, 1000));

        return transporter.sendMail({
          from: GMAIL_ADDRESS,
          to: email,
          subject: `${name}（${result.name}）さんへ通知が届きました`,
          text: [
            `${name}（${result.name}）さんへ通知が届きました。`,
            '○○までお越しください。',
            '',
            '通知の停止・再開はこちらから設定してください。'
            `https://${HEROKU_URL}/#/${workId}/${creatorId}`
          ].join('\n')
        });
      })
  };

  update();

  socket.on('create', data => {
    const work = new Work(data);

    work.save()
      .then(update);
  });

  socket.on('edit', (id, data) => {
    data.modified = new Date();

    Work.findByIdAndUpdate(id, data)
      .then(update);
  });

  socket.on('delete', id => {
    Work.findByIdAndRemove(id)
      .then(update);
  });

  socket.on('change', (workId, creatorId, state) => {
    if (state === NOTIFY) {
      sendMail(workId, creatorId)
        .then(() => wait(1000 * 5))
        .then(() => changeState(workId, creatorId, STANDING, true))
        .then(update);
    }

    changeState(workId, creatorId, state)
      .then(update);
  });
});

server.listen(process.env.PORT || 3000);
