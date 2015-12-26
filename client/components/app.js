'use strict';
import React from 'react';
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

    eventemitter.on('change', (workId, creatorId, state) => {
      // optimistic updates
      const { data } = this.state;
      const datumIndex = _.findIndex(data, { _id: workId });
      const datum = data[datumIndex];
      const creatorIndex = _.findIndex(datum.creators, { _id: creatorId });
      data[datumIndex].creators[creatorIndex].state = state;
      this.setState({ data });

      // send to server
      socket.emit('change', workId, creatorId, state);
    });
  }
  render() {
    const { children } = this.props;
    const { data } = this.state;

    return (
      <div>
        <header className="column expanded row">
          <h1>Notification</h1>
          <p>When a notice button is clicked, it's possible to call an exhibitor.</p>
        </header>

        {children && React.cloneElement(children, { data })}
      </div>
    );
  }
}
