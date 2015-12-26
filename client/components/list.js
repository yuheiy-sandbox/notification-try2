'use strict';
import React from 'react';
import _ from 'lodash';
import eventemitter from '../eventemitter';
import SECTIONS from '../sections';

const STANDING = 1;
const NOTIFY = 2;
const TAKEN = 3;

export default class List extends React.Component {
  handleClick(workId, creatorId) {
    eventemitter.emit('change', workId, creatorId, NOTIFY);
  }
  render() {
    const { data } = this.props;

    return (
      <table>
        <thead>
          <tr>
            <th className="nowrap">部門</th>
            <th className="nowrap" colSpan="3">作品</th>
            <td className="nowrap" colSpan="3">制作者</td>
          </tr>
        </thead>

        <tbody>
          {_.flatten(SECTIONS.map(section => {
            const sectionData = data.filter(datum =>
              datum.section === section.id
            );

            let sectionCreatorLength;

            switch (sectionData.length) {
              case 0:
                sectionCreatorLength = 0;
                break;
              case 1:
                sectionCreatorLength = sectionData[0].creators.length;
                break;
              default:
                sectionCreatorLength = sectionData.reduce((prev, current) =>
                  prev.creators.length + current.creators.length
                );
            }

            return sectionData.map((datum, sectionIndex) => {
              const { creators } = datum;
              const { length } = creators;
              const isSectionFirst = sectionIndex === 0;

              return creators.map((creator, creatorIndex) => {
                const isCreatorFirst = creatorIndex === 0;

                return (
                  <tr key={creator._id}>
                    {isSectionFirst && isCreatorFirst ?
                      <td
                       className="nowrap"
                       rowSpan={sectionCreatorLength}>
                        {_.find(SECTIONS, { id: section.id }).name}
                      </td>
                    : null}

                    {isCreatorFirst ? [
                      <td
                       key={`${creator._id}-name`}
                       className="nowrap"
                       rowSpan={length}>{datum.name}</td>,
                      <td
                       key={`${creator._id}-thumb`}
                       className="nowrap thumb"
                       rowSpan={length}>
                        <img src={datum.thumbnail} width="64" height="64" />
                      </td>,
                      <td
                       key={`${creator._id}-description`} rowSpan={length}>{datum.description}</td>
                    ] : null}

                    <td className="nowrap">{creator.name}</td>
                    <td className="nowrap">{creator.role}</td>
                    <td className="nowrap">
                      {(() => {
                        switch (creator.state) {
                          case STANDING:
                            return (
                              <button
                               className="success button"
                               onClick={this.handleClick.bind(
                                 this, datum._id, creator._id
                               )}>
                                通知する
                              </button>
                            );
                          case NOTIFY:
                            return (
                              <button className="disabled success button">
                                通知中
                              </button>
                            );
                          case TAKEN:
                            return (
                              <button className="disabled alert button">
                                取り込み中
                              </button>
                            );
                        }
                      })()}
                    </td>
                  </tr>
                );
              });
            });
          }))}
        </tbody>
      </table>
    );
  }
}

List.defaultProps = {
  data: []
};

List.propTypes = {
  data: React.PropTypes.array
};
