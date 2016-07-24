import React from 'react';
import _ from 'lodash';


export default React.createClass({

  propTypes: {
    actions: React.PropTypes.object,
    werk: React.PropTypes.object,
  },

  componentWillMount() {
    this.setInitialKeys(this.props.werk);
  },

  componentWillReceiveProps(nextProps) {
    this.setInitialKeys(nextProps.werk);
  },

  /**
   * Checks if legend keys need to be reset because color range has changed.
   * @param {Object} werk Current werk prop object
   */
  setInitialKeys(werk) {
    const actions = this.props.actions;

    if (
      !_.isEqual(
        werk.text.legend.keys.map((key) => key.color).sort(),
        werk.axes.color.range.sort()
      )
    ) {
      // Default values for text are blank...
      const defaultText = werk.axes.color.range.map(() => '');

      // ...unless we're using a quantized scale, in which case we use
      // minimum thresholds as over-writable default text.
      if (werk.axes.color.quantize) {
        // Always one less domain member as range in quantize scale. So need
        // to get the min of the dataset first.
        defaultText[0] = _.min(werk.data.map((datum) =>
          datum[werk.axes.color.quantizeProps.column]
        )).toString();

        // Now set rest of thresholds as default text.
        werk.axes.color.domain.map((limit, i) => {
          defaultText[i + 1] = limit.toString();
          return defaultText;
        });
      }

      const keys = werk.axes.color.range.map((color, i) => ({
        text: defaultText[i],
        color,
      }));
      actions.setLegendKeys(keys);
    }
  },

  render() {
    const werk = this.props.werk;
    const actions = this.props.actions;

    if (!werk.text.legend.active) {
      return null;
    }

    const keySet = werk.text.legend.keys.map((key, i) =>
      (
      <div className="legend-key" key={i}>
        <div
          className="color-square"
          style={{ backgroundColor: key.color }}
        ></div>
        <input
          className="form-control"
          type="text"
          maxLength="50"
          value={key.text}
          placeholder="Text to display"
          onChange={(e) => actions.changeLegendKey(i, key.color, e.target.value)}
        />
        <div className="key-sort">
          <i
            className={`fa fa-caret-up ${i === 0 ||
              werk.axes.color.quantize ? 'disabled' : ''}`}
            aria-hidden="true"
            title="Reorder"
            onClick={() => actions.changeLegendKeyOrderUp(i)}
          ></i>
          <i
            className={`fa fa-caret-down ${
              i === werk.text.legend.keys.length - 1 ||
              werk.axes.color.quantize ? 'disabled' : ''
            }`}
            aria-hidden="true"
            title="Reorder"
            onClick={() => actions.changeLegendKeyOrderDown(i)}
          ></i>
        </div>
      </div>
      )
    );

    return (
      <div id="legend-keys">
        <h5>Keys</h5>
        {keySet}
      </div>
    );
  },
});
