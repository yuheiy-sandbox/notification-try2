'use strict';
import React from 'react';
import { PropTypes } from 'react-router';
import _ from 'lodash';
import eventemitter from '../eventemitter';
import sections from '../sections';

const NOMATCH = 0;
const NEW = 1;
const EDIT = 2;

export default class Form extends React.Component {
  constructor(props) {
    super(props);

    this.state = { type: NOMATCH };
  }
  setType(props) {
    const isNew = this.context.history.isActive('/new', null);

    if (isNew) {
      this.setState({ type: NEW });
      this.setInitialValue(NEW);
      return;
    }

    const { data, params } = props;
    const datum = _.find(data, { _id: params.id });
    const isEdit = !!datum;

    if (isEdit) {
      this.setState({ type: EDIT });
      this.setInitialValue(EDIT, props);
      return;
    }

    if (this.state.type !== NOMATCH) {
      this.setState({ type: NOMATCH });
    }
  }
  setInitialValue(type, props = {}) {
    switch (type) {
      case NEW:
        this.setState({
          sectionValue: 1,
          nameValue: null,
          descriptionValue: null,
          thumbnailURL: null,
          creators: [{
            nameValue: null,
            roleValue: null,
            emailValue: null
          }]
        });

        break;

      case EDIT:
        const { data, params } = props;
        const datum = _.find(data, { _id: params.id });

        this.setState({
          sectionValue: datum.section,
          nameValue: datum.name,
          descriptionValue: datum.description,
          thumbnailURL: datum.thumbnail,
          creators: datum.creators.map(creator => {
            const { name, role, email } = creator;

            return {
              nameValue: name,
              roleValue: role,
              emailValue: email
            };
          })
        });
    }
  }
  handleSubmit(e) {
    e.preventDefault();

    const { type, sectionValue, nameValue, descriptionValue, thumbnailURL,
      creators } = this.state;

    switch (type) {
      case NEW:
        if (!confirm('作品情報を追加します。よろしいですか？')) {
          return;
        }
        break;
      case EDIT:
        if (!confirm('作品情報を変更します。よろしいですか？')) {
          return;
        }
    }

    const data = {
      section: parseInt(sectionValue, 10),
      name: nameValue,
      description: descriptionValue,
      thumbnail: thumbnailURL,

      creators: creators.map(creator => {
        const { nameValue, roleValue, emailValue } = creator;

        return {
          name: nameValue,
          role: roleValue,
          email: emailValue
        };
      })
    };

    switch (type) {
      case NEW:
        eventemitter.emit('create', data);
        break;
      case EDIT:
        const { id } = this.props.params;
        eventemitter.emit('edit', id, data);
    }

    this.context.history.pushState(null, '/');
  }
  handleSectionChange(e) {
    const sectionValue = e.target.value;
    this.setState({ sectionValue });
  }
  handleNameChange(e) {
    const nameValue = e.target.value;
    this.setState({ nameValue });
  }
  handleDescriptionChange(e) {
    const descriptionValue = e.target.value;
    this.setState({ descriptionValue });
  }
  handleThumbnailChange(e) {
    const file = e.target.files[0];

    if (file.type !== 'image/png') {
      alert('選択できる画像はPNG画像のみです。');
      e.target.value = '';
      return;
    }

    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.addEventListener('load', () =>
      this.setState({ thumbnailURL: fileReader.result })
    );
  }
  handleAddCreator() {
    const { creators } = this.state;
    creators.push({
      nameValue: null,
      roleValue: null,
      emailValue: null
    });
    this.setState({ creators });
  }
  handleRemoveCreator(index, e) {
    const { creators } = this.state;
    creators.splice(index, 1);
    this.setState({ creators });
  }
  handleCreatorNameChange(index, e) {
    const { creators } = this.state;
    creators[index].nameValue = e.target.value;
    this.setState({ creators });
  }
  handleCreatorRole(index, e) {
    const { creators } = this.state;
    creators[index].roleValue = e.target.value;
    this.setState({ creators });
  }
  handleCreatorEmail(index, e) {
    const { creators } = this.state;
    creators[index].emailValue = e.target.value;
    this.setState({ creators });
  }
  componentWillMount() {
    this.setType(this.props);
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.params.id !== nextProps.params.id) {
      this.setType(nextProps);
    }
  }
  render() {
    const { type, sectionValue, nameValue, descriptionValue, thumbnailURL,
      creators } = this.state;

    if (type === NOMATCH) {
      return null;
    }

    return (
      <form
       className="row"
       onSubmit={this.handleSubmit.bind(this)}>
        <div className="large-6 columns">
          <fieldset className="fieldset">
            <legend>作品情報</legend>

            <label>
              部門
              <select
               value={sectionValue}
               required
               onChange={this.handleSectionChange.bind(this)}>
                {sections.map(section =>
                  <option
                   key={section.id}
                   value={section.id}>{section.name}</option>
                )}
              </select>
            </label>

            <label>
              作品名
              <input
               type="text"
               value={nameValue}
               required
               onChange={this.handleNameChange.bind(this)} />
            </label>

            <label>
              説明文
              <input
               type="text"
               value={descriptionValue}
               required
               onChange={this.handleDescriptionChange.bind(this)} />
            </label>

            <p>
              サムネイル<br />
              {thumbnailURL ?
                <img src={thumbnailURL} />
              : null}

              <input
               type="file"
               onChange={this.handleThumbnailChange.bind(this)} />
            </p>
          </fieldset>
        </div>

        <div className="large-6 columns">
          <fieldset className="fieldset">
            <legend>制作者情報</legend>

            {creators.map((creator, i) =>
              <div
               key={i}
               className="callout">
                {creators.length > 1 ?
                  <button
                   className="close-button"
                   type="button"
                   onClick={this.handleRemoveCreator.bind(this, i)}>
                    &times;
                  </button>
                : null}

                <label>
                  名前
                  <input
                   type="text"
                   value={creator.nameValue}
                   required
                   onChange={this.handleCreatorNameChange.bind(this, i)} />
                </label>

                <label>
                  担当
                  <input
                   type="text"
                   value={creator.roleValue}
                   onChange={this.handleCreatorRole.bind(this, i)} />
                </label>

                <label>
                  メール
                  <input
                   type="email"
                   value={creator.emailValue}
                   required
                   onChange={this.handleCreatorEmail.bind(this, i)} />
                </label>
              </div>
            )}

            <p className="text-right">
              <button
               className="button"
               type="button"
               onClick={this.handleAddCreator.bind(this)}>
                <span className="fi-plus"></span>
              </button>
            </p>
          </fieldset>

          <p className="text-right">
            <button
             className="button"
             type="submit">
              {type === NEW ? '作品情報を追加する' : '作品情報を変更する'}
            </button>
          </p>
        </div>
      </form>
    );
  }
}

Form.defaultProps = {
  data: []
};

Form.propTypes = {
  data: React.PropTypes.array
};

Form.contextTypes = {
  history: PropTypes.history
};
