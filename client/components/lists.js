'use strict';
import React from 'react';
import List from './list';

const FIRST_SECTIONS = [1, 2, 3, 4, 5];
const SECOND_SECTIONS = [6, 7, 8, 9];

export default class Lists extends React.Component {
  render() {
    const { data } = this.props;

    const firstData = data.filter(datum =>
      FIRST_SECTIONS.includes(datum.section)
    );

    const secondData = data.filter(datum =>
      SECOND_SECTIONS.includes(datum.section)
    );

    return (
      <div className="expanded row">
        <div className="large-6 column">
          <List data={firstData} />
        </div>

        <div className="large-6 column">
          <List data={secondData} />
        </div>
      </div>
    );
  }
}

Lists.defaultProps = {
  data: []
};

List.propTypes = {
  data: React.PropTypes.array
};
