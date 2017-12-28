import React from 'react';
import AceEditor from 'react-ace';
import Modal from 'react-modal';
import Toggle from 'react-toggle';
import _ from 'lodash';
import JSONTree from 'react-json-tree';
import Dependencies from './Dependencies';
import ApiExplorer from './ApiExplorer';

require('brace/mode/javascript');
require('brace/mode/scss');
require('brace/mode/html');
require('brace/theme/monokai');
require('brace/ext/searchbox');

export default React.createClass({

  propTypes: {
    actions: React.PropTypes.object,
    werk: React.PropTypes.object,
  },

  getInitialState() {
    const werk = this.props.werk;
    return {
      modalIsOpen: false,
      editHelper: false,
      editing: 'JS',
      scripts: {
        draw: werk.scripts.draw,
        helper: werk.scripts.helper,
        styles: werk.scripts.styles,
        html: werk.scripts.html,
      },
    };
  },

  componentDidMount() {
    const scripts = this.state.scripts;
    eval.apply(null, [scripts.draw, scripts.helper]);
  },

  /**
   * This is an antipattern for the sake of accomodating the API, which needs
   * to re-seed state after fetching a Chartwerk object.
   * https://facebook.github.io/react/tips/props-in-getInitialState-as-anti-pattern.html
   * @param  {[type]} nextProps [description]
   * @return {[type]}           [description]
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.werk.scripts !== this.state.scripts) {
      this.setState({
        scripts: nextProps.werk.scripts,
      });
    }
  },

  onChange(script) {
    switch (this.state.editing) {
      case 'CSS':
        this.setState({
          scripts: _.merge(this.state.scripts, { styles: script }),
        });
        break;
      case 'JS':
        if (this.state.editHelper) {
          this.setState({
            scripts: _.merge(this.state.scripts, { helper: script }),
          });
        } else {
          this.setState({
            scripts: _.merge(this.state.scripts, { draw: script }),
          });
        }
        break;
      case 'HTML':
        this.setState({
          scripts: _.merge(this.state.scripts, { html: script }),
        });
        break;
      default:
        break;
    }
  },

  applyScript() {
    const actions = this.props.actions;
    const scripts = this.state.scripts;

    let styleEl = document.getElementById('injected-chart-styles');
    const chartwerkEl = document.getElementById('chartwerk');

    function addStyleEl() {
      const node = document.createElement('style');
      node.id = 'injected-chart-styles';
      document.head.appendChild(node);
      return node;
    }

    function addStyleString(str) {
      if (!styleEl) {
        styleEl = addStyleEl();
      }
      styleEl.innerHTML = str;
    }

    switch (this.state.editing) {
      case 'CSS':
        actions.setStyles(scripts.styles);
        addStyleString(scripts.styles);
        break;
      case 'JS': {
        const script = this.state.editHelper ?
          this.state.scripts.helper : this.state.scripts.draw;
        eval.apply(null, [script]);
        if (this.state.editHelper) {
          actions.setHelperScript(scripts.helper);
        } else {
          actions.setDrawScript(scripts.draw);
        }
        break;
      }
      case 'HTML':
        actions.setHTML(scripts.html);
        chartwerkEl.innerHTML = scripts.html;
        break;
      default:
        break;
    }
  },

  activeClass(type) {
    return this.state.editing === type ?
      'btn script-switch active' : 'btn script-switch';
  },

  getEditor(type) {
    const name = `${type}-code-editor`;
    const height = type === 'panel' ? '600px' : 'calc(100% - 100px)';
    const scripts = this.state.scripts;
    const jsScript = this.state.editHelper ?
          scripts.helper : scripts.draw;

    let editor;
    switch (this.state.editing) {
      case 'JS':
        editor = (<AceEditor
          mode="javascript"
          theme="monokai"
          value={jsScript}
          onChange={this.onChange}
          highlightActiveLine
          enableBasicAutocompletion
          fontSize={16}
          wrapEnabled
          name={name}
          width="100%"
          height={height}
          editorProps={{ $blockScrolling: true }}
        />);
        break;
      case 'CSS':
        editor = (<AceEditor
          mode="scss"
          theme="monokai"
          value={scripts.styles}
          onChange={this.onChange}
          highlightActiveLine
          enableBasicAutocompletion
          fontSize={16}
          wrapEnabled
          name={name}
          width="100%"
          height={height}
          editorProps={{ $blockScrolling: true }}
        />);
        break;
      case 'HTML':
        editor = (<AceEditor
          mode="html"
          theme="monokai"
          value={scripts.html}
          onChange={this.onChange}
          highlightActiveLine
          enableBasicAutocompletion
          fontSize={16}
          wrapEnabled
          name={name}
          width="100%"
          height={height}
          editorProps={{ $blockScrolling: true }}
        />);
        break;
      default:
        editor = (
          <div>
            <small>Add additional dependencies for this chart below, specified by URL to any
              valid javascript (js) or stylesheet (css). Once you're done editing your dependency
              list, syncing will inject dependencies in the page <em>in the order given</em>.
            </small>
            <small>
              Be aware that making too many edits to your dependency list may result in
              strange behavior as javascript persists in the global namespace.
              In that case, simply save and refresh the page.
            </small>
            <Dependencies {...this.props} />
          </div>
        );
        break;
    }

    return editor;
  },

  getJSSwitch() {
    const editing = this.state.editHelper ? 'helper object' : 'draw function';
    return this.state.editing !== 'JS' ? null :
      <div className="right-align clearfix editing">
        <small>{editing}</small>
        <Toggle
          defaultChecked={this.state.editHelper}
          aria-label="No label"
          onChange={() => this.setState({ editHelper: !this.state.editHelper })}
        />
      </div>;
  },

  render() {
    const modalStyles = {
      overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.65)',
        zIndex: 9,
      },
      content: {
        top: '20px',
        bottom: '20px',
        maxWidth: '1600px',
        margin: 'auto',
        padding: '10px 20px 0px',
        backgroundColor: 'white',
      },
    };

    const explorer = this.state.editing === 'JS' ?
      <ApiExplorer werk={this.props.werk} /> : null;

    return (
      <div>

        <div className="right-align clearfix">
          <button
            className={this.activeClass('JS')}
            onClick={() => this.setState({ editing: 'JS' })}
          >JS</button>
          <button
            className={this.activeClass('CSS')}
            onClick={() => this.setState({ editing: 'CSS' })}
          >CSS</button>
          <button
            className={this.activeClass('HTML')}
            onClick={() => this.setState({ editing: 'HTML' })}
          >HTML</button>
          <button
            className={this.activeClass('DEP')}
            onClick={() => this.setState({ editing: 'DEP' })}
          >
            <i className="fa fa-plus" aria-hidden="true"></i>
          </button>

          <button
            className="btn btn-sm btn-blue"
            onClick={this.applyScript}
            disabled={this.state.editing === 'DEP'} // Disable if editing dependencies
          >
            <i className="fa fa-play" aria-hidden="true"></i> Apply
          </button>
          <button
            className="btn btn-sm"
            onClick={() => this.setState({ modalIsOpen: true })}
            disabled={this.state.editing === 'DEP'}
          >
            <i className="fa fa-arrows-alt" aria-hidden="true"></i>
          </button>
        </div>

        {this.getEditor('panel')}

        {this.getJSSwitch()}

        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={() => this.setState({ modalIsOpen: false })}
          style={modalStyles}
        >

          <h4><span className="display">Chartwerk</span> Editor</h4>

          <i className="fa fa-times" onClick={() => this.setState({ modalIsOpen: false })}></i>


            {this.getEditor('modal')}

          <div id="editor-react-tree" hidden={this.state.editing !== 'JS'}>
            <h5>chartwerk API map</h5>
            <JSONTree data={this.props.werk} />
          </div>
          <div className="left inline">

            <button className="btn btn-sm btn-blue" onClick={this.applyScript}>
              <i className="fa fa-play" aria-hidden="true"></i> Apply
            </button>

            <button
              className={this.activeClass('JS')}
              onClick={() => this.setState({ editing: 'JS' })}
            >JS</button>
            <button
              className={this.activeClass('CSS')}
              onClick={() => this.setState({ editing: 'CSS' })}
            >CSS</button>
            <button
              className={this.activeClass('HTML')}
              onClick={() => this.setState({ editing: 'HTML' })}
            >HTML</button>

          </div>

          {explorer}

          {this.getJSSwitch()}

        </Modal>
      </div>
    );
  },

});
