'use strict';
import React from 'react';
import _ from 'lodash';
import eventemitter from '../eventemitter';

const STANDING = 1;
const NOTIFY = 2;
const TAKEN = 3;

export default class Creator extends React.Component {
  handleClick(state) {
    const { workId, creatorId } = this.props.params;
    eventemitter.emit('change', workId, creatorId, state);
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

        {(() => {
          switch (creator.state) {
            case STANDING:
            case NOTIFY:
              return (
                <div className="large button-group">
                  <button
                   className="disabled success button">待機中</button>
                  <button
                   className="alert button"
                   onClick={this.handleClick.bind(this, TAKEN)}>取込中</button>
                </div>
              );

            case TAKEN:
              return (
                <div className="large button-group">
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
    );
  }
}

Creator.defaultProps = {
  data: []
};

Creator.propTypes = {
  data: React.PropTypes.array
};
