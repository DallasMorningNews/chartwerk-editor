import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import _ from 'lodash';
import * as d3 from 'd3';
import chroma from 'chroma-js';
import geostats from 'geostats';
import colors from '../../constants/colors';
import QuantizerViz from './QuantizerViz';


module.exports = React.createClass({

  propTypes: {
    actions: React.PropTypes.object,
    werk: React.PropTypes.object,
    data: React.PropTypes.object,
  },

  /**
   * State used to track changes in color scheme, cf. componentWillReceiveProps.
   */
  getInitialState() {
    return {
      scheme: this.props.werk.axes.color.scheme,
    };
  },


  /**
   * Set initial state tree
   * @return {void}
   */
  componentWillMount() {
    const actions = this.props.actions;
    const werk = this.props.werk;
    if (werk.axes.color.quantizeProps.groups === 0) {
      actions.setQuantizeGroups(4);
      this.setQuantizeRange(4);
    }
  },

  /**
   * If color scheme is reset, we also reset color range here.
   * (Why here? For non-quantized color schemes, we wait for user to pick colors
   * that should be in color range. For quantized, we already know what colors
   * should make up range based on Quantizer UI opts.)
   */
  componentWillReceiveProps(nextProps) {
    if (this.state.scheme !== nextProps.werk.axes.color.scheme) {
      this.setState({ scheme: nextProps.werk.axes.color.scheme });
      this.props.actions.setQuantizeRange(
        this.equidistantColors(nextProps.werk.axes.color.quantizeProps.groups));
    }
  },

  /**
   * Sets color domain.
   * @param {Array} thresholds Quantize thresholds
   * @return {void}
   */
  setQuantizeDomain(thresholds) {
    const actions = this.props.actions;
    actions.setQuantizeDomain(thresholds);
  },

  /**
   * Sets color range.
   * @param {Integer} groups Number of groups.
   * @return {void}
   */
  setQuantizeRange(groups) {
    const actions = this.props.actions;
    actions.setQuantizeDomain(this.equalGroups(groups));
    actions.setQuantizeRange(this.equidistantColors(groups));
  },

  /**
   * Calculate equidistant thresholds.
   * @param  {Number} groups Number of quantize groups
   * @return {Array}        Array of thresholds of length groups - 1.
   */
  equalGroups(groups) {
    const data = this.props.data;
    const range = data.extent[1] - data.extent[0];
    const band = range / groups;

    return _.map(new Array(groups - 1), (k, i) =>
      (
        parseFloat((data.extent[0] + (band * (i + 1))).toPrecision(4))
      ));
  },

  /**
   * Calcualte logarithmic thresholds.
   * @param  {Integer} groups Number of quantize groups
   * @return {Array}        Array of thresholds of length groups - 1.
   */
  logGroups(groups) {
    const data = this.props.data;

    const logScale = d3.scaleLog()
        .range(data.extent)
        .domain(data.extent);

    return _.map(this.equalGroups(groups), d =>
      (
        parseFloat(logScale(d).toPrecision(4))
      ));
  },

  /**
   * Calculate squared thresholds.
   * @param  {Integer} groups Number of quantize groups
   * @return {Array}        Array of thresholds of length groups - 1.
   */
  sqrGroups(groups) {
    const data = this.props.data;

    const sqrScale = d3.scalePow().exponent(2)
        .range(data.extent)
        .domain(data.extent);

    return _.map(this.equalGroups(groups), d =>
      (
        parseFloat(sqrScale(d).toPrecision(4))
      ));
  },

  /**
   * Calcualted sqaure root thresholds.
   * @param  {Integer} groups Number of quantize groups
   * @return {Array}        Array of thresholds of length groups - 1.
   */
  sqtGroups(groups) {
    const data = this.props.data;

    const sqtScale = d3.scalePow().exponent(0.5)
        .range(data.extent)
        .domain(data.extent);

    return _.map(this.equalGroups(groups), d =>
      (
        parseFloat(sqtScale(d).toPrecision(4))
      ));
  },

  /**
   * Calculate thresholds by Jenks natural breaks formula.
   * @param  {Integer} groups Number of quantize groups
   * @return {Array}        Array of thresholds of length groups - 1.
   */
  jnkGroups(groups) {
    const data = this.props.data;
    const statSeries = new geostats(data.series);  // eslint-disable-line
    const bounds = statSeries.getJenks(groups);
    // Remove max and min thresholds
    bounds.shift();
    bounds.pop();
    return bounds;
  },

  /**
   * Creates a color range of equidistant hues from lightest and darkest
   * color in scheme.
   * @param  {Number} groups Number of quantize groups.
   * @return {Array}        Array of hex colors interpolated for each
   *                        quantize group.
   */
  equidistantColors(groups) {
    const quantizeProps = this.props.werk.axes.color.quantizeProps;
    const color = this.props.werk.axes.color;
    let scheme = _.get(colors, color.scheme);

    // Reverse the color range
    if (quantizeProps.reverseColors) {
      scheme = _.clone(scheme).reverse();
    }

    return chroma
      .scale(scheme)
      .mode('lab')
      .colors(groups);
  },

  /**
   * Return 2% offset, which serves as min size of group.
   * @return {Float} 2% offset
   */
  offset() {
    const data = this.props.data;
    return (data.extent[1] - data.extent[0]) * 0.02; // 2% offset minimum
  },

  /**
   * Get max input value, offset by 2% of data extent.
   * @return {Float} Max input value
   */
  maxCeil() {
    const data = this.props.data;
    return data.extent[1] - this.offset();
  },

  /**
   * Get min input value, offset by 2% of data extent.
   * @return {Float} Min input value
   */
  minCeil() {
    const data = this.props.data;
    return data.extent[0] + this.offset();
  },

  /**
   * Determine maximum value of the input based on neighboring theshold values.
   * @param  {Number} threshold Threshold for this group.
   * @return {Number}           Maximum value for group, or null of last group.
   */
  inputMax(threshold) {
    const i = this.props.werk.axes.color.domain.indexOf(threshold);
    return i < this.props.werk.axes.color.domain.length - 1 ?
      this.props.werk.axes.color.domain[i + 1] - this.offset()
      : this.maxCeil();
  },

  /**
   * Determine minimum value of the input based on neighboring theshold values.
   * @param  {Number} threshold Threshold for this group.
   * @return {Number}           Minimum value for group, or null of first group.
   */
  inputMin(threshold) {
    const i = this.props.werk.axes.color.domain.indexOf(threshold);
    return i > 0 ?
      this.props.werk.axes.color.domain[i - 1] + this.offset()
      : this.minCeil();
  },

  /**
   * Change a quantile threshold via input change.
   * @param  {Integer} i Index of threshold
   * @param  {Object} e event with target value
   * @return {void}
   */
  changeThreshold(i, e) {
    const thresholds = this.props.werk.axes.color.domain;
    thresholds[i] = Number(e.target.value);
    this.setQuantizeDomain(thresholds);
  },

  /**
   * Change a quantile threshold via drag on viz.
   * @param  {Integer} i Index of threshold
   * @param  {Float} v New threshold value
   * @return {void}
   */
  dragThreshold(i, v) {
    const thresholds = this.props.werk.axes.color.domain;
    thresholds[i] = Number(v);
    this.setQuantizeDomain(thresholds);
  },

  /**
   * Add quantile group, up to 8 groups.
   * @return {void}
   */
  addGroup() {
    const actions = this.props.actions;
    const quantizeProps = this.props.werk.axes.color.quantizeProps;

    if (quantizeProps.groups >= 8) {
      return;
    }
    const groups = quantizeProps.groups + 1;
    this.setQuantizeRange(groups);
    actions.setQuantizeGroups(groups);
  },

  /**
   * Remove quantile group, down to 2 groups.
   * @return {void}
   */
  removeGroup() {
    const actions = this.props.actions;
    const quantizeProps = this.props.werk.axes.color.quantizeProps;

    if (quantizeProps.groups <= 2) {
      return;
    }
    const groups = quantizeProps.groups - 1;
    this.setQuantizeRange(groups);
    actions.setQuantizeGroups(groups);
  },

  /**
   * Set groupings
   * @param  {String} transform A type of transform to do on groups
   * @return {void}
   */
  setGroups(transform) {
    const quantizeProps = this.props.werk.axes.color.quantizeProps;

    switch (transform) {
      case 'log':
        this.setQuantizeDomain(this.logGroups(quantizeProps.groups));
        break;
      case 'sqr':
        this.setQuantizeDomain(this.sqrGroups(quantizeProps.groups));
        break;
      case 'sqt':
        this.setQuantizeDomain(this.sqtGroups(quantizeProps.groups));
        break;
      case 'jnk':
        this.setQuantizeDomain(this.jnkGroups(quantizeProps.groups));
        break;
      default:
        this.setQuantizeDomain(this.equalGroups(quantizeProps.groups));
    }
  },

  /**
   * Reverse the color range.
   * @return {void}
   */
  reverseColor() {
    const actions = this.props.actions;

    actions.setQuantizeReverse();

    const quantizeProps = this.props.werk.axes.color.quantizeProps;

    actions.setQuantizeRange(
      this.equidistantColors(quantizeProps.groups));
  },


  /**
   * Determine active/inactive button states.
   * @param  {String} type Type of input to check.
   * @return {String}      Disabled class or null.
   */
  activeButton(type) {
    let classed;
    const werk = this.props.werk;
    const data = this.props.data;
    const quantizeProps = werk.axes.color.quantizeProps;
    switch (type) {
      case 'max':
        classed = quantizeProps.groups >= 8 ? 'disabled' : null;
        break;
      case 'min':
        classed = quantizeProps.groups <= 2 ? 'disabled' : null;
        break;
      case 'eql':
        classed = _.isEqual(werk.axes.color.domain, this.equalGroups(quantizeProps.groups)) ?
          'disabled' : null;
        break;
      case 'sqr':
        classed = _.isEqual(werk.axes.color.domain, this.sqrGroups(quantizeProps.groups)) ?
          'disabled' : null;
        break;
      case 'sqt':
        classed = _.isEqual(werk.axes.color.domain, this.sqtGroups(quantizeProps.groups)) ?
          'disabled' : null;
        break;
      case 'log':
        // Log scales also can't have a domain that spans 0.
        classed = _.isEqual(werk.axes.color.domain, this.logGroups(quantizeProps.groups)) ||
          ((data.extent[0] > 0 && data.extent[1] <= 0) ||
              (data.extent[0] < 0 && data.extent[1] >= 0)) ?
          'disabled' : null;
        break;
      case 'jnk':
        classed = _.isEqual(werk.axes.color.domain, this.jnkGroups(quantizeProps.groups)) ?
          'disabled' : null;
        break;
      default:
        break;
    }
    return classed;
  },

  /**
   * Remove quantize column (ie, ask user to pick data series again)
   * @return {void}
   */
  resetSeries() {
    this.props.actions.unsetQuantizeColumn();
  },

  render() {
    const werk = this.props.werk;
    const thresholds = werk.axes.color.domain;
    const quantizeProps = werk.axes.color.quantizeProps;

    const groupInputs = _.map(thresholds, (n, i) =>
      (<div key={i}>
        <input
          type="number"
          className="form-control"
          value={n}
          min={this.inputMin(n)}
          max={this.inputMax(n)}
          onChange={this.changeThreshold.bind(this, i)}
        />
      </div>));

    return (
      <div className="quantize-select">
        <h4>Quantized color scale</h4>
        <small>
          Add or remove color groups below. While in most cases the default
          thresholds should be used, you can adjust them in the
          boxes below, by dragging the threshold borders in the chart or by
          choosing a calculated scheme. The strokes above the chart represent
          the distribution of your data.
        </small>

        <QuantizerViz
          werk={werk}
          thresholds={thresholds}
          colorRange={this.equidistantColors(quantizeProps.groups)}
          dragThreshold={this.dragThreshold}
        />
        <table>
          <tbody>
            <tr>
              <td>
                <ReactCSSTransitionGroup
                  transitionName="slide"
                  transitionEnterTimeout={250}
                  transitionLeaveTimeout={250}
                >
                  <h5>Thresholds</h5>
                  {groupInputs}
                </ReactCSSTransitionGroup>
              </td>
              <td>
                <div className="quantize-group-buttons clearfix">
                  <h5>Groups</h5>
                  <div onClick={this.addGroup} className={this.activeButton('max')}>
                    <i className="fa fa-plus" aria-hidden="true" />
                  </div>
                  <div onClick={this.removeGroup} className={this.activeButton('min')}>
                    <i className="fa fa-minus" aria-hidden="true" />
                  </div>
                  <div onClick={this.reverseColor}>Reverse</div>
                </div>
                <div className="quantize-group-buttons clearfix">
                  <h5>Calculate thresholds</h5>
                  <div
                    onClick={this.setGroups.bind(this, 'eql')}
                    className={this.activeButton('eql')}
                  >Equal</div>
                  <div
                    onClick={this.setGroups.bind(this, 'log')}
                    className={this.activeButton('log')}
                  >Log</div>
                  <div
                    onClick={this.setGroups.bind(this, 'sqr')}
                    className={this.activeButton('sqr')}
                  >Squared</div>
                </div>
                <div className="quantize-group-buttons clearfix">
                  <div
                    onClick={this.setGroups.bind(this, 'sqt')}
                    className={this.activeButton('sqt')}
                  >Square root</div>
                  <div
                    onClick={this.setGroups.bind(this, 'jnk')}
                    className={this.activeButton('jnk')}
                  >Natural breaks</div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

      </div>
    );
  },

});
