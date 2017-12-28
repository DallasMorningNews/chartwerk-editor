import React from 'react';
import _ from 'lodash';
import viz from './MarginViz-d3';


export default React.createClass({

  propTypes: {
    actions: React.PropTypes.object,
    werk: React.PropTypes.object,
    dragMargin: React.PropTypes.func,
    size: React.PropTypes.string,
  },


  /**
   * Gets data needed for d3 scales
   * @return {Object} Margins
   */
  getChartState() {
    const werk = this.props.werk;
    return this.props.size === 'single' ? {
      top: werk.margins.single.top,
      right: werk.margins.single.right,
      bottom: werk.margins.single.bottom,
      left: werk.margins.single.left,
      width: 200,
      height: 120,
    } : {
      top: werk.margins.double.top,
      right: werk.margins.double.right,
      bottom: werk.margins.double.bottom,
      left: werk.margins.double.left,
      width: 200,
      height: 120,
    };
  },

  /**
   * After first render, chart SVG els for chart.
   * @return {void}
   */
  componentDidMount() {
    viz.create(
      this.node,
      this.getChartState(),
      this,
    );
  },

  /**
   * On subsequent renders, update SVG els.
   * @return {void}
   */
  componentDidUpdate() {
    viz.update(
      this.node,
      this.getChartState(),
      this,
    );
  },


  dragMargin: _.throttle(function(percent, margin){ // eslint-disable-line
    this.props.dragMargin(parseFloat(percent), margin);
  }, 100),

  render() {
    return (
      <div id="margin-viz" ref={(node) => { this.node = node; }} />
    );
  },
});
