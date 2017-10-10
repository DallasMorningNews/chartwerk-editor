import React from 'react';
import _ from 'lodash';
import colors, { black, white } from '../../constants/colors';


export default React.createClass({

  propTypes: {
    actions: React.PropTypes.object,
    werk: React.PropTypes.object,
    index: React.PropTypes.number,
  },

  getInitialState() {
    return {
      pickerVisible: false,
    };
  },


  showPicker() {
    this.setState({ pickerVisible: !this.state.pickerVisible });
  },

  selectColor(e) {
    const actions = this.props.actions;
    const color = e.target.getAttribute('color');
    actions.changeAnnotationColor(this.props.index, color);
    this.setState({ pickerVisible: false });
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

    const defaultBlack = (
      <div
        className="color-square"
        color={black}
        style={{ backgroundColor: black }}
        onClick={this.selectColor}
      ></div>
    );

    const defaultWhite = (
      <div
        className="color-square"
        color={white}
        style={{ backgroundColor: white }}
        onClick={this.selectColor}
      ></div>
    );

    choices.unshift(defaultBlack);
    choices.push(defaultWhite);

    const picker = this.state.pickerVisible ?
      (<div className="colorpicker-panel clearfix">
        {choices}
      </div>) : '';


    const buttonStyle = {
      color: werk.text.annotations[this.props.index].color,
    };

    return (
      <div className="btn-group" role="group" aria-label="Color">
        <button
          type="button"
          className="btn btn-sm btn-secondary"
          title="Color"
          onClick={this.showPicker}
        >
          <i className="fa fa-square" style={buttonStyle} />
        </button>
        {picker}
      </div>
    );
  },
});
