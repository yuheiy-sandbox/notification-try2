'use strict';
import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute } from 'react-router';
import { createHashHistory } from 'history';
import App from './components/app';
import Lists from './components/lists';

const history = createHashHistory({ queryKey: false });

render((
  <Router history={history}>
    <Route path="/" component={App}>
      <IndexRoute component={Lists} />
    </Route>
  </Router>
), document.getElementById('app'));
