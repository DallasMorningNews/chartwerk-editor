import React from 'react';
import _ from 'lodash';
import { renderToStaticMarkup as staticRender } from 'react-dom/server';
import Keys from './LegendKeys';
import marked from './../../misc/utils';
import LegendDisplay from './LegendDisplay';


export default React.createClass({
  propTypes: {
    actions: React.PropTypes.object,
    werk: React.PropTypes.object,
  },

  getInitialState() {
    return {
      open: false,
    };
  },

  componentWillMount() {
    this.renderLegend = _.debounce(this.renderLegend, 200);
  },

  componentDidUpdate() {
    if (this.props.werk.text.legend.active) {
      this.renderLegend();
    } else {
      this.resetLegend();
    }
  },

  resetLegend() {
    $('#chart-legend').empty();
    $('#chart .chart-legend-container').remove();
  },

  renderLegend() {
    const werk = this.props.werk;

    if (werk.axes.color.ignoreScale) {
      this.resetLegend();
      return null;
    }

    const display = werk.text.legend[werk.ui.size];
    const background = display.background ? 'bg' : '';
    const align = display.align;
    const position = display.position;

    const keys = werk.text.legend.keys.map((key, i) => {
      const spread = 100 / werk.axes.color.range.length;

      // Categorical keys
      return !werk.axes.color.quantize ? (
        <div className="key" key={i}>
          <div
            className="key-color"
            style={{ backgroundColor: key.color }}
          />
          <div className="key-label">{marked.inlineLexer(key.text, [])}</div>
        </div>

      // Quantized keys
      ) : (
        <div
          className="key quantized"
          key={i}
          style={{ width: `${spread}%` }}
        >
          <div
            className="key-label"
            style={{ borderTop: `12px solid ${key.color}` }}
          >{marked.inlineLexer(key.text, [])}</div>
        </div>
      );
    });

    const legendStyles = !display.inside ?
    {
      width: display.width,
    } :
    {
      width: display.width,
      top: position.y,
      left: position.x,
      position: 'absolute',
    };

    const legend = (
      <div
        className={`chart-legend-container clearfix ${align} ${background}`}
        style={legendStyles}
      >
        <div className="title">
          {marked.inlineLexer(werk.text.legend.title, [])}
        </div>
        {keys}
        <div className="handle" />
      </div>
    );


    // Render legend outside the chart space in #chart-legend
    if (!display.inside) {
      $('#chart-legend').empty();
      $('#chart .chart-legend-container').remove(); // Remove inside legend, if exists
      $('#chart-legend').append(staticRender(legend));

    // Render the chart inside #chart
    // NOTE: .chart-legend-container excepted from redraw container clear,
    // cf. misc/api.js redraw func
    } else {
      $('#chart-legend').empty(); // Remove outside legend, if exists
      $('#chart .chart-legend-container').remove();
      $('#chart').append(staticRender(legend));
    }

    this.resizeLegend();
    this.moveLegend();
    return null;
  },


  resizeLegend() {
    const werk = this.props.werk;
    const actions = this.props.actions;
    const align = werk.text.legend[werk.ui.size].align;

    $('.handle', '.chart-legend-container').on('mousedown', (e) => {
      e.stopPropagation();
      if (e.button > 0) return;

      const div = $(e.currentTarget).closest('.chart-legend-container');
      const maxWidth = $('#chart').width();
      const minWidth = 20;

      div.addClass('active');

      const width = div.width();
      let wDiff;
      let maxDiff;
      let minDiff;

      const oX = e.pageX;


      $(document).on('mousemove.drag', (dragEvent) => {
        dragEvent.stopPropagation();

        maxDiff = maxWidth - width;
        minDiff = (width - minWidth) * -1;

        if (!werk.text.legend.inside && align === 'l') {
          wDiff = Math.max(Math.min(maxDiff, (dragEvent.pageX - oX)), minDiff);
        } else if (!werk.text.legend.inside && align === 'r') {
          wDiff = Math.max(Math.min(maxDiff, (oX - dragEvent.pageX)), minDiff);
        }

        div.css({ width: width + wDiff });
      });

      $(document).one('mouseup', () => {
        $(document).off('mousemove.drag');
        actions.changeLegendWidth(werk.ui.size, width + wDiff);
        div.removeclass('active');
      });
    });
  },

  moveLegend() {
    const werk = this.props.werk;
    const actions = this.props.actions;

    $('.chart-legend-container').on('mousedown', (e) => {
      e.stopPropagation();
      if (e.button > 0) return;

      const div = $(e.currentTarget);
      const width = div.width();
      const height = div.height();
      const chartWidth = $('#chart').width();
      const chartHeight = $('#chart').height();

      let x = parseInt(div.css('left'), 10);
      let y = parseInt(div.css('top'), 10);

      const oX = x;
      const oY = y;
      const sX = e.pageX;
      const sY = e.pageY;

      $(document).on('mousemove.drag', (dragEvent) => {
        dragEvent.stopPropagation();
        x = Math.max(Math.min(oX + (dragEvent.pageX - sX), chartWidth - width), 0);
        y = Math.max(Math.min(oY + (dragEvent.pageY - sY), chartHeight - height), 0);
        div.css({ left: x, top: y });
      });

      $(document).one('mouseup', () => {
        $(document).off('mousemove.drag');
        actions.changeLegendPosition(werk.ui.size, x, y);
      });
    });
  },

  render() {
    const werk = this.props.werk;

    if (werk.axes.color.range.length < 2 || werk.axes.color.ignoreScale) {
      return null;
    }
    return (
      <div id="legend" className="clearfix">
        <div>
          <label className="section section-option">
            Do you want a color legend?
            <input
              type="checkbox"
              checked={werk.text.legend.active}
              onClick={() => {
                if (werk.text.legend.active) {
                  $('#chart-legend').empty();
                  $('.chart-legend-container').remove();
                }
                this.props.actions.setLegendActive();
              }}
            />
            <i className="fa fa-square-o" />
            <i className="fa fa-check-square-o" />
          </label>
        </div>
        <Keys {...this.props} />
        <LegendDisplay {...this.props} />
      </div>
    );
  },
});
