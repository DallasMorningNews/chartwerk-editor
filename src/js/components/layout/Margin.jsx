import React from 'react';
import MarginViz from './MarginViz';

export default React.createClass({

  propTypes: {
    actions: React.PropTypes.object,
    werk: React.PropTypes.object,
  },

  /**
   * Determine whether size selector is active.
   * @param  {String} size Ie, 'single' or 'double'
   * @return {String}   Class names
   */
  activeClass(size) {
    return size === this.props.werk.ui.size ? 'active' : null;
  },

  dragMargin(percent, margin) {
    const actions = this.props.actions;
    const activeOpts = this.props.werk.ui.size;
    switch (margin) {
      case 'left':
        if (activeOpts === 'single') {
          actions.setMarginSingleLeft(percent);
        } else {
          actions.setMarginDoubleLeft(percent);
        }
        break;
      case 'right':
        if (activeOpts === 'single') {
          actions.setMarginSingleRight(percent);
        } else {
          actions.setMarginDoubleRight(percent);
        }
        break;
      case 'top':
        if (activeOpts === 'single') {
          actions.setMarginSingleTop(percent);
        } else {
          actions.setMarginDoubleTop(percent);
        }
        break;
      case 'bottom':
        if (activeOpts === 'single') {
          actions.setMarginSingleBottom(percent);
        } else {
          actions.setMarginDoubleBottom(percent);
        }
        break;
      default:
        break;
    }
  },

  changeTab(e) {
    e.preventDefault();
    $('a[href="#text"]').tab('show');
    $('#editor-pane').animate({ scrollTop: 0 }, 300);
  },

  render() {
    const actions = this.props.actions;
    return (
      <div className="inline-exclusive-format clearfix">
        <h4>Margins</h4>
        <small>Drag the interior box below to adjust the margins around the chart
          until all text and chart elements are seen clearly.
        </small>
        <div className="form-group size-switch">
          <label>Size</label>
          <img
            onClick={() => {
              actions.changePreview('single');
            }}
            src={`${window.chartwerkConfig.static_prefix}img/icons/singleColumn.png`}
            title="Single-wide"
            className={this.activeClass('single')}
            alt="Single-wide"
          />
          <img
            onClick={() => {
              actions.changePreview('double');
            }}
            src={`${window.chartwerkConfig.static_prefix}img/icons/doubleColumn.png`}
            title="Double-wide"
            className={this.activeClass('double')}
            alt="Double-wide"
          />
        </div>
        <div>
          <MarginViz
            werk={this.props.werk}
            actions={this.props.actions}
            size={this.props.werk.ui.size}
            dragMargin={this.dragMargin}
          />
        </div>
        <div className="guidepost">
          <h4>
            <a onClick={this.changeTab} href="">
              <b>Next:</b> Text
              <i className="fa fa-arrow-circle-o-right" aria-hidden="true" />
            </a>
          </h4>
        </div>
      </div>
    );
  },
});
