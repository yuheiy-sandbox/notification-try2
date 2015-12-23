'use strict';
import React from 'react';
import { Link, IndexLink } from 'react-router';
import eventemitter from '../eventemitter';

const socket = io();

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: []
    }
  }
  componentDidMount() {
    eventemitter.on('new', data => {
      console.log('data', data);
      console.log('send to api');
    });

    eventemitter.on('edit', (id, data) => {
      console.log('id', id);
      console.log('data', data);
      console.log('send to api');
    });

    eventemitter.on('delete', id => {
      console.log('id', id);
      console.log('send to api');
    });

    this.setState({ data: [
      {
        _id: 'asdvaewavewvds',
        section: 3,
        name: '俺のゲーム',
        description: 'ああああああああああああ',
        thumbnail: 'aaaaaaaaaaaaaaaaaaaaaaaaaa',
        creators: [{
          name: 'tom',
          role: 'planning',
          email: 'foo@gmai.com',
          state: 1
        }, {
          name: 'bob',
          role: 'coding',
          email: 'example@test.com',
          state: 1
        }],
        created: '1111',
        modified: '1111'
      }
    ] });
  }
  render() {
    return (
      <div>
        <div className="column row">
          <h1>Dashboard</h1>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus temporibus, molestiae laborum rerum iste nostrum animi odio ad, expedita dolor nobis commodi consequatur ex pariatur laboriosam maxime incidunt harum. Fugit.</p>
        </div>

        <div className="column row">
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
              {this.props.children && React.cloneElement(this.props.children, {
                data: this.state.data
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
