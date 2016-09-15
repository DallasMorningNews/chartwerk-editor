import React from 'react';
import Select from 'react-select';
import Modal from 'react-modal';
import _ from 'lodash';
import ellipsize from 'ellipsize';
import ColorPicker from './ColorPicker';
import ColorScheme from './ColorScheme';
import BaseTypePicker from './BaseTypePicker';
import Quantizer from './Quantizer';

export default React.createClass({

  propTypes: {
    actions: React.PropTypes.object,
    werk: React.PropTypes.object,
  },

  getInitialState() {
    return {
      helpModal: false,
    };
  },

  componentWillReceiveProps(nextProps) {
    const actions = this.props.actions;
    /**
     * If data columns change, reset the state selections array to reset
     * the data selections.
     */
    if (
        !_.isEqual(
            _.keys(this.props.werk.data[0]).sort(), // Old props
            _.keys(nextProps.werk.data[0]).sort() // New props
        )
    ) {
      if (this.props.werk.axes.color.byFacet) {
        this.props.actions.colorByFacet();
      }
      actions.resetDatamap();
      actions.resetColor();
      actions.unsetLegend();
    }
  },

  /**
   * Select dropdown options.
   * @returns {array}     Array of options.
   */
  setOptions(column) {
    const datamap = this.props.werk.datamap;
    const opts = [
      { value: 'base', label: 'base axis', disabled: false },
      { value: 'value', label: 'value axis', disabled: false },
      { value: 'scale', label: 'scale axis', disabled: false },
      { value: 'series', label: 'data series', disabled: false },
      { value: 'facet', label: 'faceting column', disabled: false },
      { value: 'annotation', label: 'annotation column' },
      { value: 'ignore', label: 'ignored column' },
    ];

    opts[0].disabled = datamap.base;
    opts[1].disabled = datamap.value;
    opts[2].disabled = datamap.scale;
    opts[4].disabled = datamap.facet;
    // Data series are mutually exclusive with value and scale axis.
    // So if there is more than one data series, or the one data series
    // is the option set we're getting.
    if (
      datamap.series.length > 1 ||
      (datamap.series[0] !== column && datamap.series.length > 0)
    ) {
      // opts.splice(1, 2);
      opts[1].disabled = true;
      opts[2].disabled = true;
    }
    opts[3].disabled = (datamap.value && datamap.scale) ||
      (datamap.value && datamap.value !== column) ||
      (datamap.scale && datamap.scale !== column);

    return opts;
  },

  /**
   * Changes value of Select component via setState
   * @param  {string} column  column name
   * @param  {string} v   Value selected
   * @returns {void}
   */
  changeValue(column, v) {
    const actions = this.props.actions;

    /**
     * Remove the previously selected value from datamap and do any
     * necessary cleanup.
     */
    switch (this.traverseDatamap(column)) {
      case 'base':
        actions.removeBase();
        break;
      case 'value':
        actions.removeValue();
        actions.unsetColor(column);
        break;
      case 'scale':
        actions.removeScale();
        actions.resetColor();
        actions.unsetLegend();
        break;
      case 'series':
        actions.removeSeries(column);
        actions.unsetColor(column);
        break;
      case 'facet':
        actions.removeFacet();
        break;
      case 'annotation':
        actions.removeAnnotations(column);
        break;
      case 'ignore':
        actions.removeIgnore(column);
        break;
      default:
        break;
    }

    /**
     * Update datamap store.
     */
    if (!_.has(v, 'value')) {
      return;
    }
    switch (v.value) {
      case 'base':
        actions.addBase(column);
        break;
      case 'value':
        actions.addValue(column);
        break;
      case 'scale':
        actions.addScale(column);
        actions.resetColor();
        this.scaleSniffer(column);
        break;
      case 'series':
        actions.addSeries(column);
        break;
      case 'facet':
        actions.addFacet(column);
        break;
      case 'annotation':
        actions.addAnnotations(column);
        break;
      case 'ignore':
        actions.addIgnore(column);
        break;
      default:
        break;
    }
  },

  /**
   * Traverses the data map API and returns the type for the column
   * @param  {String} column column name
   * @return {String}        Data type
   */
  traverseDatamap(column) {
    const datamap = this.props.werk.datamap;

    if (datamap.base === column) { return 'base'; }
    if (datamap.value === column) { return 'value'; }
    if (datamap.scale === column) { return 'scale'; }
    if (datamap.series.indexOf(column) > -1) { return 'series'; }
    if (datamap.facet === column) { return 'facet'; }
    if (datamap.annotations.indexOf(column) > -1) { return 'annotation'; }
    if (datamap.ignore.indexOf(column) > -1) { return 'ignore'; }

    return null;
  },

  /**
   * Returns data attributes for Quantizer props.
   * @return {Obj} Object with series and extent properties.
   */
  getQuantizeData() {
    const werk = this.props.werk;
    const series = _.map(werk.data, werk.axes.color.quantizeProps.column);
    const extent = [
      _.min(series),
      _.max(series),
    ];
    return {
      series,
      extent,
    };
  },

  /**
   * Sniffs whether scale axis column is numeric or categorical
   * and sets quantize state accordingly.
   * @return {null}
   */
  scaleSniffer(scaleColumn) {
    const werk = this.props.werk;
    const actions = this.props.actions;

    const scaleArray = werk.data.map((d) => d[scaleColumn]);
    if (!scaleArray.some(isNaN)) {
      actions.setQuantizeColumn(scaleColumn);
      actions.setQuantize();
    } else {
      actions.unsetQuantize();
    }
  },

  colorFacetSwitch() {
    if (this.props.werk.axes.color.byFacet) {
      this.props.actions.resetColor();
    }
    this.props.actions.colorByFacet();
  },

  changeIgnoreScale() {
    const werk = this.props.werk;
    const actions = this.props.actions;

    actions.resetColor();
    /**
     * If scale axis currently ignored, run the scale sniffer to reset quantized
     * or categorical color scale. Otherwise, remove the quantize flag.
     */
    if (werk.axes.color.ignoreScale) {
      this.scaleSniffer(werk.datamap.scale);
    } else {
      actions.unsetQuantize();
    }
    actions.setIgnoreScale();
  },

  groupColors() {
    const werk = this.props.werk;
    const column = werk.datamap.scale && !werk.axes.color.quantize ?
      werk.datamap.scale : werk.datamap.facet;
    const groups = _.uniq(werk.data.map((datum) => datum[column]));
    groups.sort();

    if (groups.length > 8) {
      return (
        <div className="alert alert-fail">
          <strong>Too many groups:</strong> You&rsquo;ve selected a column
          with more than 8 unique values. That&rsquo;s more groups than the
          color scheme can accomodate.
        </div>
      );
    }

    const selects = groups.map((group, i) =>
        (<tr key={i}>
          <td>
              {ellipsize(group, 8)}
          </td>
          <td>
            <ColorPicker
              column={group}
              werk={this.props.werk}
              actions={this.props.actions}
            />
          </td>
        </tr>)
    );

    return (
      <div>
        <h4>Color scale groups</h4>
        <table id="group-selects">
          <tbody>{selects}</tbody>
        </table>
      </div>
    );
  },

  changeTab(e) {
    e.preventDefault();
    $('a[href="#axes"]').tab('show');
    $('#editor-pane').animate({ scrollTop: 0 }, 300);
  },

  render() {
    const werk = this.props.werk;
    const actions = this.props.actions;

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
        maxWidth: '800px',
        margin: 'auto',
        backgroundColor: 'white',
      },
    };

    const classifySelects = _.keys(werk.data[0]).map((column, i) => {
      let addOption;
      let article = 'a';

      switch (this.traverseDatamap(column)) {
        case 'value':
          /**
           * If there's not a scale axis or the scale axis is explicitly
           * ignored for color, give a color picker on the value axis.
           */
          addOption = !werk.datamap.scale ||
            werk.axes.color.ignoreScale ?
            <ColorPicker
              column={column}
              werk={werk}
              actions={actions}
            /> : null;
          break;
        case 'series':
          addOption = !werk.axes.color.byFacet &&
            !werk.axes.color.quantize ?
            <ColorPicker
              column={column}
              werk={werk}
              actions={actions}
            />
            : null;
          break;
        case 'facet':
          addOption = (
            <label>
              <input type="checkbox" value="" onChange={this.colorFacetSwitch} />
              <i className="fa fa-square-o"></i>
              <i className="fa fa-check-square-o"></i> Color by facet?
            </label>
          );
          break;
        case 'scale':
          addOption = (
            <label>
              <input
                type="checkbox"
                onChange={() => this.changeIgnoreScale()}
                checked={werk.axes.color.ignoreScale}
              />
              <i className="fa fa-square-o"></i>
              <i className="fa fa-check-square-o"></i> Scale by size, not color?
            </label>
          );
          break;
        case 'base':
          addOption = (
            <BaseTypePicker
              werk={werk}
              actions={actions}
            />
          );
          break;
        default:
          addOption = null;
          article = 'an';
          break;
      }

      return (
        <tr key={i}>
          <td className="column-label">
            <p><span className="column-label">{ellipsize(column, 12)}</span> is {article}
              <Select
                name={column}
                value={this.traverseDatamap(column)}
                options={this.setOptions(column)}
                onChange={this.changeValue.bind(this, column)}
                searchable={false}
                placeholder="Choose one"
                clearable
              />
              {addOption}
            </p>
          </td>
        </tr>
      );
    });

    /**
     * If we're coloring by facets OR there's a scale axis that is neither
     * quantized nor ignored, give group color pickers.
     */
    const groups = werk.axes.color.byFacet ||
      (
        werk.datamap.scale &&
        !werk.axes.color.quantize &&
        !werk.axes.color.ignoreScale
      ) ?
      this.groupColors() : null;

    const quantizer = werk.axes.color.quantize ?
    (<Quantizer
      werk={this.props.werk}
      actions={this.props.actions}
      data={this.getQuantizeData()}
    />) : null;

    return (
      <div>
        <hr />
        <div id="classify-container">
          <h4>Describe the columns in your data
            <a id="data-help-prompt"
              onClick={() => this.setState({ helpModal: true })}
            >Need help?</a>
          </h4>
          <table id="classify-selects">
            <tbody>
              {classifySelects}
            </tbody>
          </table>
        </div>
        {groups}
        {quantizer}


        <ColorScheme werk={werk} actions={actions} />

        <div className="guidepost">
          <h4>
            <a onClick={this.changeTab} href="">
              <b>Next:</b> Axes
              <i className="fa fa-arrow-circle-o-right" aria-hidden="true"></i>
            </a>
          </h4>
        </div>

        <Modal
          isOpen={this.state.helpModal}
          onRequestClose={() => this.setState({ helpModal: false })}
          style={modalStyles}
        >
          <i className="fa fa-times" onClick={() => this.setState({ helpModal: false })}></i>
          <div id="data-help-modal-content">
            <p>Describing your data columns tells ChartWerk how to translate your data
              into the chart features they are meant to represent.
              To do that, you can use a very simple grammar:
            </p>
            <h4>Base axis</h4>
            <p>A column classified as a base axis often contains data like
              dates or categorical values. These are values <em>by
              which</em> numeric data are charted. Stock prices <em>by day</em>.
              Mortality rates <em>by state</em>. For scatterplots, the base axis
              will contain numeric data plotted along the X axis.
            </p>
            <h4>Value axis</h4>
            <p>
              A single column, always of naked numeric data, used to position data
              points on the chart.
            </p>
            <h4>Scale axis</h4>
            <p>
              A single column of numeric or categorical data used to set the
              size or color of data points.
            </p>
            <h4>Data series</h4>
            <p>
              Often you structure your data such that a column represents
              both the position and color of data points. These data are in the form
              of a crosstab, where each column is a subgroup, or series, of the
              same data. For example, a column of stock prices for Company A and
              another for Company B. In this way, data series columns are a
              shortcut for a value axis and categorical scale axis (mutually
              exclusive options).
            </p>
            <p>
              Data series always contain naked numeric data, and each column
              represents a categorical color.
            </p>
            <h4>Faceting column</h4>
            <p>
              Faceting columns always contain categorical data used to create
              subgroups of data that are drawn in faceted, or small-multiple,
              charts.
            </p>
            <h4>Annotation column</h4>
            <p>Some charts allow you to include a column of annotations used in
            tooltips or other labels for each data point.</p>
            <h4>Ignored column</h4>
            <p>Sure, you could've just not copied that column over, but why not be really
            explicit about it.</p>
          </div>
        </Modal>
      </div>

    );
  },

});
