import React from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
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
            _.keys(nextProps.werk.data[0]).sort()) // New props
    ) {
      if (this.props.werk.axes.color.byFacet) {
        this.props.actions.colorByFacet();
      }
      actions.unsetLegend();
      actions.resetDatamap();
      actions.resetColor();
    }
  },

  /**
   * Select dropdown options.
   * @returns {array}     Array of options.
   */
  setOptions(column) {
    const datamap = this.props.werk.datamap;
    const ui = this.props.werk.ui;

    // Start with available options
    const opts = _.filter(ui.datamap, { available: true }).map(d => ({
      value: d.class,
      label: d.alias,
    }));

    // Helper to get index of opt object
    const getOptIndex = classification => _.indexOf(
      opts, _.find(opts, { value: classification }));

    /**
     * DISABLING OPTIONS
     * We set some hard logic for disabling options based on other
     * selections below.
     */

    /**
     * Disables options for which only one column can be selected, namely,
     * base, value, scale and facet options.
     * @param  {string} valueString String that matches value prop on datamap
     *                              object.
     * @return {void}
     */
    const disableExclusiveOpt = (valueString) => {
      const i = getOptIndex(valueString);
      if (i === -1) { return; }  // Skip during API load
      opts[i].disabled = datamap[valueString];
    };

    disableExclusiveOpt('base');
    disableExclusiveOpt('value');
    disableExclusiveOpt('scale');
    disableExclusiveOpt('facet');

    // All custom classifications are exclusive opts
    _.forOwn(datamap.custom, (value, classification) => {
      const i = getOptIndex(classification);
      /**
       * If value of datamap custom prop is empty, then do not disable.
       * If not empty, then check whether value is this column. If not, disable.
       */
      if (i === -1) { return; }  // Skip during API load
      opts[i].disabled = value === '' ? false : value !== column;
    });

    /**
     * Manually set disabled prop. Logic for conditions below.
     * @param {string} valueString String that matches value prop on datamap
     *                             object.
     * @param {boolean} disabled    Whether option should be disabled.
     */
    const setDisabled = (valueString, disabled) => {
      const i = getOptIndex(valueString);
      if (i === -1) { return; }  // Skip during API load
      opts[i].disabled = disabled;
    };

    /**
     * Data series are mutually exclusive with value and scale axes.
     * So if there is more than one data series, or there is one data series
     * but it's not the option set we're creating, disable value and scale.
     */
    if (
      datamap.series.length > 1 ||
      (datamap.series.length === 1 && datamap.series[0] !== column)
    ) {
      setDisabled('value', true);
      setDisabled('scale', true);
    }
    /**
     * Disable dataseries when value or scale axis is selected, unless only one
     * is selected and that is the option set we're creating.
     */
    setDisabled('series',
      (datamap.value && datamap.scale) ||
      (datamap.value && datamap.value !== column) ||
      (datamap.scale && datamap.scale !== column));

    return opts;
  },

  /**
   * Set value
   * @param  {string} column  column name
   * @param  {string} v   Value selected, ie, data classification
   * @returns {void}
   */
  changeValue(column, v) {
    const actions = this.props.actions;
    const dataClass = this.traverseDatamap(column);

    /**
     * Remove the previously selected value from datamap and do any
     * necessary cleanup.
     */
    switch (dataClass) {
      case null:
        break;
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
      case 'ignore':
        actions.removeIgnore(column);
        break;
      default:
        actions.setCustomValue(dataClass, '');
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
      case 'ignore':
        actions.addIgnore(column);
        break;
      default:
        actions.setCustomValue(v.value, column);
        break;
    }
  },

  /**
   * Traverses the data map API and returns the classification for the column
   * @param  {String} column column name
   * @return {String}        Data classification
   */
  traverseDatamap(column) {
    const datamap = this.props.werk.datamap;

    if (datamap.base === column) { return 'base'; }
    if (datamap.value === column) { return 'value'; }
    if (datamap.scale === column) { return 'scale'; }
    if (datamap.series.indexOf(column) > -1) { return 'series'; }
    if (datamap.facet === column) { return 'facet'; }
    if (datamap.ignore.indexOf(column) > -1) { return 'ignore'; }
    const customClass = _.findKey(datamap.custom, d => d === column);
    return customClass || null;
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

    const scaleArray = werk.data.map(d => d[scaleColumn]);
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
    // Ternary prevents ColorPicker being initialized on an array with undefined members.
    const groups = column ? _.filter( // Filter out any empty values
      _.uniq(werk.data.map(datum => datum[column])), // Take unique values from column
      d => d.trim() !== '') : [];
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
        </tr>));

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
              (<ColorPicker
                column={column}
                werk={werk}
                actions={actions}
              />) : null;
          break;
        case 'series':
          addOption = !werk.axes.color.byFacet &&
            !werk.axes.color.quantize ?
              (<ColorPicker
                column={column}
                werk={werk}
                actions={actions}
              />) : null;
          break;
        case 'facet':
          addOption = (
            <label>
              <input type="checkbox" value="" onChange={this.colorFacetSwitch} />
              <i className="fa fa-square-o" />
              <i className="fa fa-check-square-o" /> Color by facet?
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
              <i className="fa fa-square-o" />
              <i className="fa fa-check-square-o" /> Scale by size, not color?
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
          article = 'a';
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
          <h4>Describe the columns in your data</h4>
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
              <i className="fa fa-arrow-circle-o-right" aria-hidden="true" />
            </a>
          </h4>
        </div>
      </div>

    );
  },
});
