// Adapted from https://github.com/benrlodge/react-simplemde-editor
import React from 'react';
import SimpleMDE from 'simplemde';
import 'simplemde/dist/simplemde.min.css';

let genID = 0;

function generateId() {
  return `simplepostmd-editor-${++genID}`;
}

module.exports = React.createClass({
  propTypes: {
    onChange: React.PropTypes.func,
    options: React.PropTypes.object,
  },

  getInitialState() {
    return {
      keyChange: false,
    };
  },

  getDefaultProps() {
    return {
      onChange() {},
      options: {},
    };
  },

  componentWillMount() {
    this.id = generateId();
  },

  componentDidMount() {
    const initialOptions = {
      element: document.getElementById(this.id),
    };

    const allOptions = Object.assign({}, initialOptions, this.props.options);
    this.simplemde = new SimpleMDE(allOptions);
    const wrapperClass = `${this.id}-wrapper`;

    $(`#${wrapperClass} .CodeMirror`).on('keyup', '*', () => {
      this.setState({
        keyChange: true,
      });
      this.simplemde.value();
      this.props.onChange(this.simplemde.value());
    });

    $(`#${wrapperClass} .editor-toolbar`).on('click', '*', () => {
      this.props.onChange(this.simplemde.value());
    });
  },

  componentWillReceiveProps(nextProps) {
    if (!this.state.keyChange) {
      this.simplemde.value(nextProps.value);
    }

    this.setState({
      keyChange: false,
    });
  },

  componentWillUnmount() {
    $('.CodeMirror').off('keyup', '*');
    $('.editor-toolbar').off('click', '*');
  },

  render() {
    const textarea = React.createElement('textarea', { id: this.id });
    return React.createElement('div', { id: `${this.id}-wrapper` }, textarea);
  },
});
