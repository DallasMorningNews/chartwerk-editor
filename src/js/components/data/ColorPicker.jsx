import React from 'react';
import _ from 'lodash';
import colors from '../../constants/colors';

export default React.createClass({

  propTypes: {
    actions: React.PropTypes.object,
    werk: React.PropTypes.object,
    column: React.PropTypes.string,
  },

  getInitialState() {
    const werk = this.props.werk;
    const scheme = _.get(colors, werk.axes.color.scheme);
    const initialColor = scheme[0];

    // Color from the API
    function getPresetColor(column) {
      const i = werk.axes.color.domain.indexOf(column);
      return i >= 0 ? werk.axes.color.range[i] : null;
    }

    return {
      selectedColor: getPresetColor(this.props.column) || initialColor,
      pickerVisible: false,
    };
  },

  componentDidMount() {
    // Skip if ColorPicker is initialized without a column.
    // This sometimes happens when switching between datasets.
    if (this.props.column) {
      this.props.actions.setColor(
        this.props.column,
        this.state.selectedColor
      );
    }
  },

  showPicker() {
    this.setState({ pickerVisible: true });
  },

  selectColor(e) {
    const actions = this.props.actions;
    const color = e.target.getAttribute('color');
    actions.setColor(this.props.column, color);
    this.setState({ pickerVisible: false, selectedColor: color });
  },

  render() {
    const werk = this.props.werk;
    const choices = _.get(colors, werk.axes.color.scheme).map((color, i) => {
      const divStyle = {
        backgroundColor: color,
      };
      return (
        <div
          className="color-square"
          color={color}
          style={divStyle}
          onClick={this.selectColor}
          key={i}
        ></div>
      );
    });

    const picker = this.state.pickerVisible ?
      <div className="colorpicker-panel clearfix">
          {choices}
      </div> : '';

    const divStyle = {
      backgroundColor: this.state.selectedColor,
    };

    return (
      <div className="colorpicker">
        <div className="color-square" style={divStyle} onClick={this.showPicker}></div>
        {picker}
      </div>
    );
  },
});
