import React from 'react';
import copy from 'copy-to-clipboard';

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

  getEmbedCode(size) {
    const werk = this.props.werk;

    const code = window.chartwerkConfig.oembed === '' ?
    `<div
      class="chartwerk"
      data-id="${window.chartwerkConfig.chart_id}"
      data-embed="${JSON.stringify(werk.embed.dimensions).replace(/"/g, '&quot;')}"
      data-size="${size}">
    </div>
    <script src="${window.chartwerkConfig.embed_src}"></script>` : this.props.location;

    this.setState({
      code: code
        .replace(/[\t\n]/g, '') // Remove whitespaces from HTML...
        .replace(/\s{2}/g, ' ')
        .replace(/\s{2}/g, ' ')
        .replace(/\s{2}/g, ' ')
        .replace(/> </g, '><'),
    });
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
