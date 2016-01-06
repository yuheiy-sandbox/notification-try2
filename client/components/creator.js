'use strict';
import React from 'react';
import _ from 'lodash';
import eventemitter from '../eventemitter';

const STANDING = 1;
const NOTIFY = 2;
const TAKEN = 3;

const wait = delay => new Promise(done => setTimeout(done, delay));

export default class Creator extends React.Component {
  constructor(props) {
    super(props);

    this.state = { isLock: false };
  }
  handleClick(state) {
    const { workId, creatorId } = this.props.params;
    eventemitter.emit('change', workId, creatorId, state);
    this.setState({ isLock: true });

    wait(1000 * 5)
      .then(() => this.setState({ isLock: false }));
  }
  render() {
    const { data, params } = this.props;
    const hasData = !!data.length;
    if (!hasData) { return null; }

    const work = _.find(data, { _id: params.workId });
    if (!work) { return null; }

    const creator = _.find(work.creators, { _id: params.creatorId });
    if (!creator) { return null; }

    return (
      <div className="column expanded row">
        <p className="lead">{creator.name} さん（{work.name}）</p>
        <p className="lead">
          <small>現在</small>
          {' '}
          {(() => {
            switch (creator.state) {
              case STANDING:
                return <span className="standing">待機中</span>;
              case NOTIFY:
                return <span className="notify">通知中</span>;
              case TAKEN:
                return <span className="taken">取込中</span>;
            }
          })()}
          {' '}
          <small>です</small>
        </p>

        <div className="large button-group">
          {(() => {
            if (this.state.isLock || creator.state === NOTIFY) {
              return (
                <div>
                  <button className="disabled success button">待機中</button>
                  <button className="disabled alert button">取込中</button>
                </div>
              );
            }

            switch (creator.state) {
              case STANDING:
                return (
                  <div>
                    <button
                     className="disabled success button">待機中</button>
                    <button
                     className="alert button"
                     onClick={this.handleClick.bind(this, TAKEN)}>
                      取込中
                    </button>
                  </div>
                );

              case TAKEN:
                return (
                  <div>
                    <button
                     className="success button"
                     onClick={this.handleClick.bind(this, STANDING)}>
                      待機中
                    </button>
                    <button className="disabled alert button">取込中</button>
                  </div>
                );
            }
          })()}
        </div>
      </div>
    );
  }
}

Creator.defaultProps = {
  data: []
};

Creator.propTypes = {
  data: React.PropTypes.array
};
