'use strict';
import React from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
import eventemitter from '../eventemitter';
import SECTIONS from '../sections';

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
      <div className="column expanded row">
        <table className="large-centered">
          <thead>
            <tr>
              <th
               className="nowrap"
               rowSpan="2">部門</th>
              <th
               className="nowrap"
               rowSpan="2">作品名</th>
              <th rowSpan="2">説明文</th>
              <th
               className="nowrap thumb"
               rowSpan="2">サムネイル</th>
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
                const isFirst = i === 0;
                const { length } = creators;

                return (
                  <tr key={creator._id}>
                    {isFirst ? [
                      <td
                       key={`${creator._id}-section`}
                       className="nowrap"
                       rowSpan={length}>
                        {_.find(SECTIONS, { id: datum.section }).name}
                      </td>,
                      <td
                       key={`${creator._id}-name`}
                       className="nowrap"
                       rowSpan={length}>{datum.name}</td>,
                      <td
                       key={`${creator._id}-description`} rowSpan={length}>{datum.description}</td>,
                      <td
                       key={`${creator._id}-thumbnail`}
                       rowSpan={length}>
                        <img
                         src={datum.thumbnail}
                         width="64"
                         height="64" />
                      </td>
                    ] : null}

                    <td className="nowrap">{creator.name}</td>
                    <td className="nowrap">{creator.role}</td>
                    <td className="nowrap">{creator.email}</td>
                    <td className="nowrap">
                      <a href={`/#/${datum._id}/${creator._id}`}>
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
                      </a>
                    </td>

                    {isFirst ? [
                      <td
                       key={`${creator._id}-edit`}
                       rowSpan={length}>
                        <Link
                         className="button"
                         to={`${datum._id}/edit`}>
                          <span className="fi-pencil"></span>
                        </Link>
                      </td>,
                      <td
                       key={`${creator._id}-delete`}
                       rowSpan={length}>
                        <button
                         className="alert button"
                         onClick={this.handleDelete.bind(this, datum._id)}>
                          <span className="fi-x"></span>
                        </button>
                      </td>
                    ] : null}
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
