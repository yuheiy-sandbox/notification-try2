'use strict';
import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute } from 'react-router';
import { createHashHistory } from 'history';
import App from './components/app';
import Lists from './components/lists';
import Creator from './components/creator';

const history = createHashHistory({ queryKey: false });

render((
  <Router history={history}>
    <Route path="/" component={App}>
      <IndexRoute component={Lists} />
      <Route path=":workId/:creatorId" component={Creator} />
    </Route>
  </Router>
), document.getElementById('app'));
