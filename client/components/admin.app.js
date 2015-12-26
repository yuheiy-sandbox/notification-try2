'use strict';
import React from 'react';
import { Link, IndexLink } from 'react-router';
import _ from 'lodash';
import eventemitter from '../eventemitter';

const socket = io();

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = { data: [] };
  }
  componentDidMount() {
    socket.on('update', data => {
      console.log(data);
      this.setState({ data });
    });

    eventemitter.on('create', data => {
      // send to server
      socket.emit('create', data);
    });

    eventemitter.on('edit', (id, data) => {
      // send to server
      socket.emit('edit', id, data);
    });

    eventemitter.on('delete', id => {
      // optimistic updates
      const { data } = this.state;
      const index = _.findIndex(data, { _id: id });
      data.splice(index, 1);
      this.setState({ data });

      // send to server
      socket.emit('delete', id);
    });
  }
  render() {
    const { children } = this.props;
    const data = this.state.data.slice().reverse();

    return (
      <div>
        <header className="column expanded row">
          <h1>Dashboard</h1>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus temporibus, molestiae laborum rerum iste nostrum animi odio ad, expedita dolor nobis commodi consequatur ex pariatur laboriosam maxime incidunt harum. Fugit.</p>
        </header>

        <div className="column expanded row">
          <ul className="tabs">
            <li className="tabs-title">
              <IndexLink
               to="/"
               activeClassName="is-active">作品リスト</IndexLink>
            </li>
            <li className="tabs-title">
              <Link
               to="/new"
               activeClassName="is-active">新規追加</Link>
            </li>
            <li className="tabs-title">
              <a href="/admin/logout">ログアウト</a>
            </li>
          </ul>

          <div className="tabs-content">
            <div className="tabs-panel is-active">
              {children && React.cloneElement(children, { data })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
