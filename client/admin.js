'use strict';
import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute } from 'react-router';
import { createHashHistory } from 'history';
import App from './components/admin.app';
import List from './components/admin.list';
import Form from './components/admin.form';

const history = createHashHistory({ queryKey: false });

render((
  <Router history={history}>
    <Route path="/" component={App}>
      <IndexRoute component={List} />
      <Route path="new" component={Form} />
      <Route path=":id/edit" component={Form} />
    </Route>
  </Router>
), document.getElementById('app'));
