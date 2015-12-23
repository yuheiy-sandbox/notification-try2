'use strict';
import React from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
import eventemitter from '../eventemitter';
import sections from '../sections';

const STANDING = 1;
const NOTIFY = 2;
const TAKEN = 3;

export default class List extends React.Component {
  handleDelete(id) {
    const { name } = _.find(this.props.data, { _id: id });

    if (confirm(`${name}を削除します。よろしいですか？`)) {
      eventemitter.emit('delete', id);
    }
  }
  render() {
    return (
      <div className="column row">
        <table>
          <thead>
            <tr>
              <th
               className="nowrap"
               rowSpan="2">部門</th>
              <th
               className="nowrap"
               rowSpan="2">作品名</th>
              <th rowSpan="2">説明文</th>
              <th rowSpan="2">サムネイル</th>
              <th
               className="nowrap"
               colSpan="4">制作者</th>
              <th rowSpan="2">編集</th>
              <th rowSpan="2">削除</th>
            </tr>
            <tr>
              <th className="nowrap">名前</th>
              <th className="nowrap">担当</th>
              <th className="nowrap">メール</th>
              <th className="nowrap">状態</th>
            </tr>
          </thead>

          <tbody>
            {this.props.data.map(datum => {
              const { creators } = datum;

              return creators.map((creator, i) => {
                if (i === 0) {
                  const { length } = creators;

                  return (
                    <tr key={i}>
                      <td
                       className="nowrap"
                       rowSpan={length}>
                        {_.find(sections, { id: datum.section }).name}
                      </td>
                      <td
                       className="nowrap"
                       rowSpan={length}>{datum.name}</td>
                      <td rowSpan={length}>{datum.description}</td>
                      <td rowSpan={length}><img src={datum.thumbnail} /></td>
                      <td className="nowrap">{creator.name}</td>
                      <td className="nowrap">{creator.role}</td>
                      <td className="nowrap">{creator.email}</td>
                      <td className="nowrap">
                        {(() => {
                          switch (creator.state) {
                            case STANDING:
                              return '待機中';
                            case NOTIFY:
                              return '通知中';
                            case TAKEN:
                              return '取込中';
                          }
                        })()}
                      </td>
                      <td rowSpan={length}>
                        <Link
                         className="button"
                         to={`${datum._id}/edit`}>
                          <span className="fi-pencil"></span>
                        </Link>
                      </td>
                      <td rowSpan={length}>
                        <button
                         className="alert button"
                         onClick={this.handleDelete.bind(this, datum._id)}>
                          <span className="fi-x"></span>
                        </button>
                      </td>
                    </tr>
                  );
                }
                return (
                  <tr key={i}>
                    <td className="nowrap">{creator.name}</td>
                    <td className="nowrap">{creator.role}</td>
                    <td className="nowrap">{creator.email}</td>
                    <td className="nowrap">
                      {(() => {
                        switch (creator.state) {
                          case STANDING:
                            return '待機中';
                          case NOTIFY:
                            return '通知中';
                          case TAKEN:
                            return '取込中';
                        }
                      })()}
                    </td>
                  </tr>
                );
              })
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

List.defaultProps = {
  data: []
};

List.propTypes = {
  data: React.PropTypes.array
};
