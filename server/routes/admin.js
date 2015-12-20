'use strict';
import { Router } from 'express';
import passport from 'passport';

const router = Router();

router.get('/login', (req, res) => {
  if (req.user) {
    res.redirect('./');
    return;
  }

  res.render('admin/login', {
    error: req.flash('error'),
    csrfToken: req.csrfToken()
  });
});

router.post('/login', passport.authenticate('local', {
  successRedirect: './',
  failureRedirect: 'login',
  failureFlash: false,
  failureFlash: 'Invalid username or password.'
}));

router.get('/logout', (req, res) => {
  if (req.user) {
    req.logout();
  }

  res.redirect('login');
});

router.get('/', (req, res) => {
  if (req.user) {
    res.render('admin/index');
    return;
  }

  res.redirect('login');
});

export default router;
