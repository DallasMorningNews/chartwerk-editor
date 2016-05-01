"use strict";
var React           = require('react');
var _               = require('lodash');
var colors          = require('../../constants/colors');
var viz             = require('./QuantizerViz-d3');


module.exports = React.createClass({

  getInitialState: function(){
    return {
      chartProps: {
        margin: {
          top: 30,
          right: 10,
          bottom: 10,
          left: 10
        },
        width: 450,
        height: 60
      }
    }
  },

  /**
   * Gets data needed for d3 scales
   * @return {Object} Data array, thresholds array (including min value)
   *                       and color range array
   */
  getChartState: function() {
    var data = _.map(
      this.props.werk.data,
      this.props.werk.datamap.series[0]
    );

    var dataMin = _.min(data);

    return {
      data: data,
      thresholds: [dataMin].concat(this.props.thresholds),
      colorRange: this.props.colorRange
    };
  },

  /**
   * After first render, chart SVG els for chart.
   * @return {void}
   */
  componentDidMount: function(){
    var el = this.getDOMNode();
    viz.create(
      el,
      this.state.chartProps,
      this.getChartState(),
      this
    )
  },

  /**
   * On subsequent renders, update SVG els.
   * @return {void}
   */
  componentDidUpdate: function(){
      var el = this.getDOMNode();
      viz.update(
        el,
        this.state.chartProps,
        this.getChartState(),
        this
      );
  },

  /**
   * Change a quantile threshold via drag on viz.
   * Passed up to parent component.
   * @param  {Integer} i Index of threshold
   * @param  {Float} v New threshold value
   * @return {void}
   */
  dragThreshold: function(i,v){
    this.props.dragThreshold(i,v);
  },

  /**
   * Renders SVG container.
   * @return {JSX} Chart container.
   */
  render: function(){
    return (
      <div id="quantize-viz"></div>
    )
  }

})
