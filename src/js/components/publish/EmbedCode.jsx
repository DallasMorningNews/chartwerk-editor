require('es6-promise').polyfill();

import fetch from 'isomorphic-fetch';
import React from 'react';
import copy from 'copy-to-clipboard';
import urljoin from 'url-join';

export default React.createClass({
  propTypes: {
    actions: React.PropTypes.object,
    werk: React.PropTypes.object,
    location: React.PropTypes.string,
  },

  getInitialState() {
    return {
      single: true,
      code: '',
    };
  },

  copyVal() {
    copy(this.state.code);
    // Successful copy
    $('#publish .embed-copy-btn').addClass('success');
    setTimeout(() => {
      $('#publish .embed-copy-btn').removeClass('success');
    }, 2000);
  },

  /**
   * Returns an embed code from the server, or returns the URL
   * of the current chart if oEmbed is configured.
   * @param  {string} size Preferred size of the chart, which
   *                       is only used for embed codes.
   * @return {null}
   */
  getEmbedCode(size) {
    const dewhite = code => code.replace(/[\t\n]/g, '') // Remove whitespaces from HTML...
                                .replace(/\s{2}/g, ' ')
                                .replace(/\s{2}/g, ' ')
                                .replace(/\s{2}/g, ' ')
                                .replace(/> </g, '><');
    const embedEndpoint = `${urljoin(
      window.chartwerkConfig.embed_api,
      window.chartwerkConfig.chart_id)}/?size=${size}`;

    if (window.chartwerkConfig.oembed) {
      this.setState({
        code: this.props.location,
      });
    } else {
      fetch(embedEndpoint)
        .then(
          response => response.json())
        .then(
          (response) => {
            this.setState({
              code: dewhite(response.embed_code),
            });
          });
    }
  },

  render() {
    return (
      <div id="embed-opts">
        <h4>Embed code</h4>
        <button
          type="button"
          className="btn btn-default btn-lg"
          disabled={window.chartwerkConfig.chart_id === ''}
          onClick={() => this.getEmbedCode('single')}
        >
          Single
        </button>
        <button
          type="button"
          className="btn btn-default btn-lg"
          disabled={window.chartwerkConfig.chart_id === ''}
          onClick={() => this.getEmbedCode('double')}
        >
          Double/Single
        </button>
        <input
          type="text"
          className="embed-code-copy"
          value={this.state.code}
        />
        <button
          className="btn btn-sm embed-copy-btn"
          onClick={this.copyVal}
          disabled={this.state.code === ''}
        >
          Copy <i className="fa fa-clipboard" aria-hidden="true" />
        </button>
      </div>
    );
  },
});
