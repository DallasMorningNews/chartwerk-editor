import React from 'react';
import Select from 'react-select';

export default React.createClass({

  propTypes: {
    actions: React.PropTypes.object,
    werk: React.PropTypes.object,
  },

  getInitialState() {
    return {
      mirrorOpts: true,
    };
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
   * Determine if opts are disabled, ie, not shown.
   * @param  {String} size Ie, 'single' or 'double'
   * @return {String}   Class names
   */
  disabledClass(size) {
    const active = this.props.werk.ui.size;
    return size === active ? 'form-group' : 'disabled form-group';
  },

  /**
   * Change single column date format
   * @param  {Object} e Selected value
   * @return {void}
   */
  changeSingleFormat(e) {
    const actions = this.props.actions;
    if (this.state.mirrorOpts) {
      actions.setBaseSingleDateString(e.value);
      actions.setBaseDoubleDateString(e.value);
    } else {
      actions.setBaseSingleDateString(e.value);
    }
  },

  /**
   * Change single column frequency
   * @param  {Object} e Change event
   * @return {void}
   */
  changeSingleFrequency(e) {
    const actions = this.props.actions;
    const value = parseInt(e.target.value, 10);
    if (this.state.mirrorOpts) {
      actions.setBaseSingleFrequency(value);
      actions.setBaseDoubleFrequency(value);
    } else {
      actions.setBaseSingleFrequency(value);
    }
  },

  /**
   * Change double column date format
   * @param  {Object} e Selected value
   * @return {void}
   */
  changeDoubleFormat(e) {
    const actions = this.props.actions;
    actions.setBaseDoubleDateString(e.value);
  },

  /**
   * Change double column frequency
   * @param  {Object} e Change event
   * @return {void}
   */
  changeDoubleFrequency(e) {
    const actions = this.props.actions;
    const value = parseInt(e.target.value, 10);
    actions.setBaseDoubleFrequency(value);
  },

  render() {
    const actions = this.props.actions;
    const dateOptions = [
      { value: 'Y', label: 'Year' },
      { value: 'y', label: 'Short year' },
      { value: 'M', label: 'Month' },
      { value: 'm', label: 'Short month' },
      { value: 'W', label: 'Week' },
      { value: 'w', label: 'Short week' },
      { value: 'D', label: 'Date' },
    ];

    return (
      <div className="inline-exclusive-format clearfix">
        <small>Select the format type and frequency of dates on the axis. Formats
        for the single and double-column chart sizes are linked by default.
        Click a size button to set formats independently.
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
        <div className={this.disabledClass('single')}>
          <label htmlFor="dateTickFormat-single">Format</label>
          <Select
            name="dateTickFormat-single"
            options={dateOptions}
            value={this.props.werk.axes.base.format.single.dateString}
            searchable={false}
            placeholder="Tick format"
            clearable={false}
            onChange={this.changeSingleFormat}
          />
        </div>
        <div className={this.disabledClass('single')}>
          <label htmlFor="dateTickFrequency-single">Frequency</label>
          <input
            name="dateTickFrequency-single"
            type="number"
            min="1"
            max="16"
            step="1"
            value={this.props.werk.axes.base.format.single.frequency}
            defaultValue="1"
            className="form-control"
            onChange={this.changeSingleFrequency}
          />
        </div>
        <div className={this.disabledClass('double')}>
          <label htmlFor="dateTickFormat-double">Format</label>
          <Select
            name="dateTickFormat-double"
            options={dateOptions}
            value={this.props.werk.axes.base.format.double.dateString}
            searchable={false}
            placeholder="Tick format"
            clearable={false}
            disabled={this.state.disableOpts}
            onChange={this.changeDoubleFormat}
          />
        </div>
        <div className={this.disabledClass('double')}>
          <label htmlFor="dateTickFrequency-double">Frequency</label>
          <input
            name="dateTickFrequency-double"
            type="number"
            min="1"
            max="16"
            step="1"
            value={this.props.werk.axes.base.format.double.frequency}
            defaultValue="1"
            className="form-control"
            disabled={this.state.disableOpts}
            onChange={this.changeDoubleFrequency}
          />
        </div>

      </div>
    );
  },
});
