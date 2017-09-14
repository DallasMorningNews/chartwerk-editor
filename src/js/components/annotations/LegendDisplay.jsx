import React from 'react';


export default React.createClass({

  propTypes: {
    actions: React.PropTypes.object,
    werk: React.PropTypes.object,
  },


  render() {
    const werk = this.props.werk;
    const actions = this.props.actions;

    if (!werk.text.legend.active) {
      return null;
    }

    const options = werk.text.legend[werk.ui.size].inside ? (
      <div id="legend-inside-opts">
        <button type="button"
          className={werk.text.legend[werk.ui.size].background ?
            'btn btn-sm btn-secondary active' : 'btn btn-sm btn-secondary'
          }
          title="Background"
          onClick={() => actions.changeLegendBackground(werk.ui.size)}
        >
          BG
        </button>
      </div>
    ) : (
      <div id="legend-inside-opts">
        <button type="button"
          className={werk.text.legend[werk.ui.size].align === 'l' ?
            'btn btn-sm btn-secondary active' : 'btn btn-sm btn-secondary'
          }
          title="Align legend container left"
          onClick={() => actions.changeLegendAlign(werk.ui.size, 'l')}
        >
          <i className="fa fa-align-left" aria-hidden="true" />
        </button>
        <button type="button"
          className={werk.text.legend[werk.ui.size].align === 'r' ?
            'btn btn-sm btn-secondary active' : 'btn btn-sm btn-secondary'
          }
          title="Align legend container right"
          onClick={() => actions.changeLegendAlign(werk.ui.size, 'r')}
        >
          <i className="fa fa-align-right" aria-hidden="true" />
        </button>
      </div>
    );


    return (
      <div id="legend-display-opts">
        <h5>Title</h5>
        <small>If necessary, add a <b>short</b> title.</small>
        <input
          id="legend-title"
          type="text"
          className="form-control"
          maxLength="50"
          placeholder="Legend title"
          value={werk.text.legend.title}
          onChange={e => actions.changeLegendTitle(e.target.value)}
        />
        <h5>Display options</h5>
        <small>Set display options for single and double-column chart sizes independently.
        </small>
        <div className="form-group size-switch">
          <img
            src={`${window.chartwerkConfig.static_prefix}img/icons/singleColumn.png`}
            title="Single-wide"
            className={werk.ui.size === 'single' ? 'active' : 'inactive'}
            onClick={() => actions.changePreview('single')}
            alt="Single-wide"
          />
          <img
            src={`${window.chartwerkConfig.static_prefix}img/icons/doubleColumn.png`}
            title="Double-wide"
            className={werk.ui.size === 'single' ? 'inactive' : 'active'}
            onClick={() => actions.changePreview('double')}
            alt="Double-wide"
          />
          <button type="button"
            className={werk.text.legend[werk.ui.size].inside ?
              'btn btn-sm btn-secondary active' : 'btn btn-sm btn-secondary'
            }
            title="Legend inside the chart space?"
            onClick={() => actions.changeLegendInside(werk.ui.size)}
          >
            Inside
          </button>
          {options}
        </div>

      </div>
    );
  },

});
