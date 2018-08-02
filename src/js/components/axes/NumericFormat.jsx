import React from 'react';
import _ from 'lodash';


export default React.createClass({

  propTypes: {
    actions: React.PropTypes.object,
    werk: React.PropTypes.object,
    type: React.PropTypes.string,
  },

  getInitialState() {
    return {
      mirrorOpts: true,
      // We keep custom ticks as text values for the input in state, but parse
      // them as an array of numbers to send to state tree.
      singleCustomValue: null,
      doubleCustomValue: null,
    };
  },

  /**
   * Determine if opts are disabled, i.e., not shown.
   * @param  {String} size Ie, 'single' or 'double'
   * @return {String}   Class names
   */
  disabledClass(size) {
    const active = this.props.werk.ui.size;
    return size === active ? 'form-group' : 'disabled form-group';
  },

  /**
   * Determine whether size selector is active.
   * @param  {String} size Ie, 'single' or 'double'
   * @return {String}   Class names
   */
  activeClass(size) {
    return size === this.props.werk.ui.size ? 'active' : null;
  },

  /**
   * Disable ticks input if custom ticks given.
   * @param  {String} size Ie, 'single' or 'double'
   * @return {String}      Class names
   */
  disableInput(size) {
    switch (size) {
      case 'single':
        return this.state.singleCustomValue ?
          'disabled form-control' : 'form-control';
      case 'double':
        return this.state.doubleCustomValue ?
          'disabled form-control' : 'form-control';
      default:
        break;
    }
    return false;
  },

  /**
   * Parse comma-separated ticks.
   * @param  {String} tickString String of comma-separated values from input.
   * @return {Array}            Parsed numeric values.
   */
  parseCustomTicks(tickString) {
    const ticks = _.map(tickString.split(','), d => parseFloat(d));
    return _.filter(ticks, d => !isNaN(d));
  },

  /**
   * Get tick numbers value from either base or value axis.
   * @param  {String} size Ie, 'single' or 'double'
   * @return {Integer} Number of ticks
   */
  getTicks(size) {
    const werk = this.props.werk;
    switch (size) {
      case 'single':
        return this.props.type === 'base' ?
          werk.axes.base.format.single.ticks :
          werk.axes.value.format.single.ticks;
      case 'double':
        return this.props.type === 'base' ?
          werk.axes.base.format.double.ticks :
          werk.axes.value.format.double.ticks;
      default:
        return false;
    }
  },

  /**
   * Set single tick number for either base or value axis.
   * @param  {Object} e change event
   * @return {void}
   */
  setSingleTicks(e) {
    const actions = this.props.actions;
    const value = parseFloat(e.target.value);
    switch (this.props.type) {
      case 'base':
        if (this.state.mirrorOpts) {
          actions.setBaseSingleTicks(value);
          actions.setBaseDoubleTicks(value);
        } else {
          actions.setBaseSingleTicks(value);
        }
        break;
      case 'value':
        if (this.state.mirrorOpts) {
          actions.setValueSingleTicks(value);
          actions.setValueDoubleTicks(value);
        } else {
          actions.setValueSingleTicks(value);
        }
        break;
      default:
        break;
    }
  },

  /**
   * Set double tick number for either base or value axis.
   * @param  {Object} e change event
   * @return {void}
   */
  setDoubleTicks(e) {
    const actions = this.props.actions;
    const value = parseFloat(e.target.value);
    if (this.props.type === 'base') {
      actions.setBaseDoubleTicks(value);
    } else {
      actions.setValueDoubleTicks(value);
    }
  },

  /**
   * Set single custom ticks for either base or value axis.
   * @param  {Object} e Change event
   * @return {void}
   */
  setSingleCustom(e) {
    const actions = this.props.actions;
    const ticks = this.parseCustomTicks(e.target.value);
    switch (this.props.type) {
      case 'base':
        if (this.state.mirrorOpts) {
          actions.setBaseSingleCustomTicks(ticks);
          actions.setBaseDoubleCustomTicks(ticks);
        } else {
          actions.setBaseSingleCustomTicks(ticks);
        }
        break;
      case 'value':
        if (this.state.mirrorOpts) {
          actions.setValueSingleCustomTicks(ticks);
          actions.setValueDoubleCustomTicks(ticks);
        } else {
          actions.setValueSingleCustomTicks(ticks);
        }
        break;
      default:
        break;
    }
    this.setState({
      singleCustomValue: e.target.value,
    });
  },

  /**
   * Change double custom ticks for either base or value axis.
   * @param  {Object} e Change event
   * @return {void}
   */
  setDoubleCustom(e) {
    const actions = this.props.actions;
    const ticks = this.parseCustomTicks(e.target.value);
    if (this.props.type === 'base') {
      actions.setBaseDoubleCustomTicks(ticks);
    } else {
      actions.setValueDoubleCustomTicks(ticks);
    }
    this.setState({
      doubleCustomValue: e.target.value,
    });
  },

  /**
   * Get either base or value axis min or max.
   * @param  {String} m Either min or max
   * @return {Number}   Min or max value
   */
  getMinMax(m) {
    const werk = this.props.werk;
    switch (this.props.type) {
      case 'base':
        return m === 'min' ?
          werk.axes.base.min : werk.axes.base.max;
      case 'value':
        return m === 'min' ?
          werk.axes.value.min : werk.axes.value.max;
      default:
        break;
    }
    return false;
  },

  /**
   * Set either base or value axis min or max.
   * @param  {String} m Either min or max
   * @param  {Object} e Change event
   * @return {void}
   */
  setMinMax(m, e) {
    const actions = this.props.actions;
    let value = parseFloat(e.target.value);

    // For cases where someone types the '-' first in a negative value
    if (isNaN(value)) {
      value = undefined;
    }

    switch (this.props.type) {
      case 'base':
        if (m === 'min') {
          actions.setBaseMin(value);
        } else {
          actions.setBaseMax(value);
        }
        break;
      case 'value':
        if (m === 'min') {
          actions.setValueMin(value);
        } else {
          actions.setValueMax(value);
        }
        break;
      default:
        break;
    }
  },

  /**
   * Set either base or value axis label.
   * @param  {Object} e Change event
   * @return {void}
   */
  setLabel(e) {
    const actions = this.props.actions;
    switch (this.props.type) {
      case 'base':
        actions.setBaseLabel(e.target.value);
        break;
      case 'value':
        actions.setValueLabel(e.target.value);
        break;
      default:
        break;
    }
  },

  /**
   * Get either base or value axis label.
   * @return {String} The label
   */
  getLabel() {
    const werk = this.props.werk;
    return this.props.type === 'base' ?
      werk.axes.base.label : werk.axes.value.label;
  },

  /**
   * Set either base or value axis prefix.
   * @param  {Object} e Change event
   * @return {void}
   */
  setPrefix(e) {
    const actions = this.props.actions;
    switch (this.props.type) {
      case 'base':
        actions.setBasePrefix(e.target.value);
        break;
      case 'value':
        actions.setValuePrefix(e.target.value);
        break;
      default:
        break;
    }
  },

  /**
   * Get either base or value axis prefix.
   * @return {String} The prefix
   */
  getPrefix() {
    const werk = this.props.werk;
    return this.props.type === 'base' ?
      werk.axes.base.prefix : werk.axes.value.prefix;
  },

  /**
   * Set either base or value axis suffix.
   * @param  {Object} e Change event
   * @return {void}
   */
  setSuffix(e) {
    const actions = this.props.actions;
    switch (this.props.type) {
      case 'base':
        actions.setBaseSuffix(e.target.value);
        break;
      case 'value':
        actions.setValueSuffix(e.target.value);
        break;
      default:
        break;
    }
  },

  /**
   * Get either base or value axis suffix.
   * @return {String} The suffix
   */
  getSuffix() {
    const werk = this.props.werk;
    return this.props.type === 'base' ?
      werk.axes.base.suffix : werk.axes.value.suffix;
  },

  render() {
    const actions = this.props.actions;
    return (
      <div className="inline-exclusive-format clearfix numeric">
        <small>
          Pick how many ticks you would like on the axis. You can also set
          custom ticks by entering them into the text box, separated by commas.
          Tick options for the single and double-column chart sizes are linked by default.
          Click a size button to set options independently.
        </small>
        <div className="form-group size-switch">
          <label>
            Size
            <i
              className={this.state.mirrorOpts ? 'fa fa-link' : 'fa fa-chain-broken'}
              style={{
                marginLeft: '3px',
                color: this.state.mirrorOpts ? 'grey' : '#aaa',
              }}
              title={this.state.mirrorOpts ? 'Options linked' : 'Options independent'}
            />
          </label>
          <img
            onClick={() => {
              this.setState({ mirrorOpts: false });
              actions.changePreview('single');
            }}
            src={`${window.chartwerkConfig.static_prefix}img/icons/singleColumn.png`}
            title="Single-wide"
            className={this.activeClass('single')}
            alt="Single-wide"
          />
          <img
            onClick={() => {
              this.setState({ mirrorOpts: false });
              actions.changePreview('double');
            }}
            src={`${window.chartwerkConfig.static_prefix}img/icons/doubleColumn.png`}
            title="Double-wide"
            className={this.activeClass('double')}
            alt="Double-wide"
          />
        </div>
        <div className={this.disabledClass('single')} >
          <label htmlFor="numTicks-single">Number</label>
          <input
            name="numTicks-single"
            type="number"
            min="4"
            max="10"
            step="1"
            value={this.getTicks('single')}
            className={this.disableInput('single')}
            onChange={this.setSingleTicks}
          />
        </div>
        <div className={this.disabledClass('single')} >
          <label htmlFor="customTicks-single">Custom ticks</label>
          <input
            name="customTicks-single"
            type="text"
            placeholder="Comma-separated"
            className="form-control"
            value={this.state.singleCustomValue}
            onChange={this.setSingleCustom}
          />
        </div>
        <div className={this.disabledClass('double')}>
          <label htmlFor="numTicks-double">Number</label>
          <input
            name="numTicks-double"
            type="number"
            min="4"
            max="10"
            step="1"
            value={this.getTicks('double')}
            className={this.disableInput('double')}
            onChange={this.setDoubleTicks}
          />
        </div>
        <div className={this.disabledClass('double')}>
          <label htmlFor="customTicks-double">Custom ticks</label>
          <input
            name="customTicks-double"
            type="text"
            placeholder="Comma-separated"
            className="form-control"
            value={this.state.doubleCustomValue}
            onChange={this.setDoubleCustom}
          />
        </div>
        <br />
        <small>
          Optionally, choose min and max values for the axis. In many cases,
          the min should be 0. <b>In all cases</b>, the min should be below
          your lowest data value and the max, above the highest.
        </small>
        <div className="form-group">
          <label htmlFor="axis-min">Min</label>
          <input
            name="axis-min"
            type="number"
            className="form-control minmax"
            value={this.getMinMax('min')}
            onChange={this.setMinMax.bind(this,'min')} // eslint-disable-line
          />
        </div>
        <div className="form-group">
          <label htmlFor="axis-max">Max</label>
          <input
            name="axis-max"
            type="number"
            className="form-control minmax"
            value={this.getMinMax('max')}
            onChange={this.setMinMax.bind(this,'max')} // eslint-disable-line
          />
        </div>
        <br />
        <small>
          Add any needed annotations to the axis. The label is placed above
          the axis, while the prefix and suffix are placed before and after
          each tick on the axis, for example, currency symbols.
        </small>
        <div className="form-group">
          <label htmlFor="axis-label">Label</label>
          <input
            name="axis-label"
            type="text"
            className="form-control"
            value={this.getLabel()}
            onChange={this.setLabel}
          />
        </div>
        <div className="form-group">
          <label htmlFor="axis-prefix">Prefix</label>
          <input
            name="axis-prefix"
            type="text"
            className="form-control presuffix"
            value={this.getPrefix()}
            onChange={this.setPrefix}
          />
        </div>
        <div className="form-group">
          <label htmlFor="axis-suffix">Suffix</label>
          <input
            name="axis-suffix"
            type="text"
            className="form-control presuffix"
            value={this.getSuffix()}
            onChange={this.setSuffix}
          />
        </div>
      </div>
    );
  },

});
