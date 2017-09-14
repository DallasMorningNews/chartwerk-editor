import React from 'react';
import Modal from 'react-modal';
import fetch from 'isomorphic-fetch';
import inliner from 'svg-style-inliner';
import _ from 'lodash';
import html2canvas from 'html2canvas';
import Cookies from 'js-cookie';
import urljoin from 'url-join';
import { locations } from './../../misc/config';
import SimpleMDE from './MDEditor';
import EmbedCode from './EmbedCode';
import DatamapOpts from './DatamapOpts';

export default React.createClass({
  propTypes: {
    actions: React.PropTypes.object,
    werk: React.PropTypes.object,
  },

  getInitialState() {
    return {
      templateModal: false,
      screenshotChatter: false,
      templateTags: [],
      newTemplate: false,
      newChart: false,
      chartTitle: null,
      templateTitle: null,
      templateDescription: null,
    };
  },

  dispatchChartTitle() {
    // Debounce pattern
    this.props.actions.setChartTitle(this.state.chartTitle);
  },

  dispatchTemplateTitle() {
    // Debounce pattern
    this.props.actions.setTemplateTitle(this.state.templateTitle);
  },

  dispatchTemplateDescription() {
    // Debounce pattern
    this.props.actions.setTemplateDescription(this.state.templateDescription);
  },

  componentWillMount() {
    this.dispatchChartTitle = _.debounce(this.dispatchChartTitle, 200);
    this.dispatchTemplateDescription = _.debounce(this.dispatchTemplateDescription, 200);
    this.dispatchTemplateTitle = _.debounce(this.dispatchTemplateTitle, 200);
  },

  componentWillReceiveProps(nextProps) {
    // Update state only after returning initial data from the API.
    // These depend on initial state being null for these props in reducer.
    if (this.state.chartTitle === null) {
      this.setState({
        chartTitle: nextProps.werk.text.title,
      });
    }
    if (this.state.templateTitle === null) {
      this.setState({
        templateTitle: nextProps.werk.template.title,
      });
    }
    if (this.state.templateDescription === null) {
      this.setState({
        templateDescription: nextProps.werk.template.description,
      });
    }
  },

  shouldComponentUpdate(nextProps) {
    // We prohibit the component from updating if all that's changing is
    // the redux state because we are controlling inputs with local state.
    const werk = this.props.werk;
    if (nextProps.werk.text.title !== werk.text.title &&
      this.state.chartTitle !== null) {
      return false;
    }
    if (nextProps.werk.template.title !== werk.template.title &&
      this.state.templateTitle !== null) {
      return false;
    }
    if (nextProps.werk.template.description !== werk.template.description &&
      this.state.templateDescription !== null) {
      return false;
    }
    return true;
  },

  setChartTitle(value) {
    // Immediately set state. Debounced dispatch.
    this.setState({ chartTitle: value });
    this.dispatchChartTitle();
  },

  setTemplateTitle(value) {
    // Immediately set state. Debounced dispatch.
    this.setState({ templateTitle: value });
    this.dispatchTemplateTitle();
  },

  setTemplateDescription(value) {
    // Immediately set state. Debounced dispatch.
    this.setState({ templateDescription: value });
    this.dispatchTemplateDescription();
  },

  componentDidMount() {
    // Get template tag options
    // Template tags are expected to be formated as objects like
    // {slug: 'some-tag', property: 'Some tag'}
    fetch(locations.templateTag)
      .then(
        response => response.json())
      .then(
        (data) => {
          this.setState({ templateTags: data.map(d => ({
            slug: d.slug,
            property: d.property,
          })) });
        });

    // For Django use, we intercept the csrf cookie and set
    // the header for AJAX requests
    const csrftoken = Cookies.get('csrftoken');

    function csrfSafeMethod(method) {
      return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }

    if (csrftoken) {
      $.ajaxSetup({
        beforeSend(xhr, settings) {
          if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader('X-CSRFToken', csrftoken);
          }
        },
      });
    }
  },

  getDimensions() {
    const actions = this.props.actions;
    const size = this.props.werk.ui.size;
    const that = this;

    const singleDims = {};
    const doubleDims = {};

    $('#loading-modal .loading-text span').text('Saving');
    $('#loading-modal').show();

    if (size === 'single') {
      singleDims.height = $('#chartwerk').height();
      singleDims.width = $('#chartwerk').width();
      actions.changePreview('double');
      setTimeout(() => {
        doubleDims.height = $('#chartwerk').height();
        doubleDims.width = $('#chartwerk').width();
        actions.changePreview(size);
      }, 1000); // Allow 1 sec for rendering
    } else {
      doubleDims.height = $('#chartwerk').height();
      doubleDims.width = $('#chartwerk').width();
      actions.changePreview('single');
      setTimeout(() => {
        singleDims.height = $('#chartwerk').height();
        singleDims.width = $('#chartwerk').width();
        actions.changePreview(size);
      }, 1000);
    }

    setTimeout(() => {
      const dimensions = {
        single: singleDims,
        double: doubleDims,
      };

      actions.setEmbedDimensions(dimensions);

      that.saveChart();
    }, 2250);
  },

  saveChart() {
    function reset() {
      $('#loading-modal').hide();
      $('#save-chart-check').show();
      $('#save-chart-spinner').hide();
    }

    function waiting() {
      $('#save-chart-check').hide();
      $('#save-chart-spinner').show();
    }

    const actions = this.props.actions;

    const data = JSON.stringify({
      title: this.props.werk.text.title,
      data: this.props.werk,
      author: window.chartwerkConfig.user,
      embed_data: this.props.werk.embed.dimensions,
    });

    const newChart = this.state.newChart;

    const component = this;

    // If updating an existing chart
    if (window.chartwerkConfig.chart_id && !newChart) {
      waiting();
      $.ajax({
        url: locations.chart,
        data,
        type: 'PATCH',
        contentType: 'application/json',
        dataType: 'json',
      })
      .done((response) => {
        console.log('Successful save.', response);
        reset();
        $('#chart-save-alerts .alert-success').slideDown();
        setTimeout(() => {
          $('#chart-save-alerts .alert-success').slideUp();
        }, 3500);
      })
      .fail(() => {
        reset();
        $('#chart-save-alerts .alert-danger').slideDown();
        setTimeout(() => {
          $('#chart-save-alerts .alert-danger').slideUp();
        }, 3500);
      });
    // If creating a new chart
    } else {
      waiting();
      $.ajax({
        url: newChart ? window.chartwerkConfig.chart_api : locations.chart,
        data,
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json',
      })
      .done((response) => {
        console.log('Successful save.', response);
        window.chartwerkConfig.chart_id = response.slug;
        locations.chart = `${urljoin(
          window.chartwerkConfig.chart_api,
          window.chartwerkConfig.chart_id
        )}/`; // Have to add trailing slash, cf. https://github.com/jfromaniello/url-join/issues/10
        reset();
        $('#chart-save-alerts .alert-success').slideDown();
        setTimeout(() => {
          $('#chart-save-alerts .alert-success').slideUp();
        }, 3500);

        /*
          For cloned charts, we redirect to the URL of the new chart after save.
          This parses the current URL, presuming the URL is constructed
          RESTfully, and replaces the chart ID as the last path param of the
          target URL.
         */
        if (newChart) {
          $('#loading-modal .loading-text span').text('Redirecting');
          $('#loading-modal').show();
          const url = window.location.href;
          const i = url
                      .substr(0, url.length - 1) // With or w/o trailing slash
                      .lastIndexOf('/');
          const newUrl = `${url.substr(0, i)}/${response.slug}/`;
          setTimeout(() => {
            window.location.href = newUrl;
          }, 2000);
        }

        component.forceUpdate(); // Force update to activate embed options.
      })
      .fail(() => {
        reset();
        $('#chart-save-alerts .alert-danger').slideDown();
        setTimeout(() => {
          $('#chart-save-alerts .alert-danger').slideUp();
        }, 3500);
      });
    }
  },

  saveTemplate() {
    function reset() {
      $('#save-template-check').show();
      $('#save-template-spinner').hide();
    }

    function waiting() {
      $('#save-template-check').hide();
      $('#save-template-spinner').show();
    }

    const data = JSON.stringify({
      title: this.props.werk.template.title,
      description: this.props.werk.template.description,
      template_properties: this.props.werk.template.tags.map(tag => ({
        slug: tag,
      })),
      data: this.props.werk,
      author: window.chartwerkConfig.user,
    });

    // If updating an existing template
    if (window.chartwerkConfig.template_id && !this.state.newTemplate) {
      waiting();
      $.ajax({
        url: locations.template,
        data,
        type: 'PATCH',
        contentType: 'application/json',
        dataType: 'json',
      })
      .done((response) => {
        console.log('Successful save.', response);
        reset();
        $('#template-save-alerts .alert-success').slideDown();
        setTimeout(() => {
          $('#template-save-alerts .alert-success').slideUp();
        }, 3500);
      })
      .fail(() => {
        reset();
        $('#template-save-alerts .alert-danger').slideDown();
        setTimeout(() => {
          $('#template-save-alerts .alert-danger').slideUp();
        }, 3500);
      });
    // If creating a new template
    } else {
      waiting();
      $.ajax({
        url: window.chartwerkConfig.template_api,
        data,
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json',
      })
      .done((response) => {
        console.log('Successful save.', response);
        window.chartwerkConfig.template_id = response.slug;
        locations.template = `${urljoin(
          window.chartwerkConfig.template_api,
          window.chartwerkConfig.template_id
        )}/`; // Have to add trailing slash, cf. https://github.com/jfromaniello/url-join/issues/10
        reset();
        $('#template-save-alerts .alert-success').slideDown();
        setTimeout(() => {
          $('#template-save-alerts .alert-success').slideUp();
        }, 3500);
      })
      .fail(() => {
        reset();
        $('#template-save-alerts .alert-danger').slideDown();
        setTimeout(() => {
          $('#template-save-alerts .alert-danger').slideUp();
        }, 3500);
      });
    }
  },

  screenshot() {
    const selector = this.state.screenshotChatter ? '#chartwerk' : '#chart';
    // Inline all styles before taking screenshot.
    inliner($('#chartwerk #chart')[0]);
    html2canvas($(selector)[0]).then((canvas) => {
      console.log('HI');
      const a = document.createElement('a');
      a.href = canvas
        .toDataURL('image/jpeg')
        .replace('image/jpeg', 'image/octet-stream');
      a.download = 'chartwerk.jpg';
      a.click();
      a.remove();
    });
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

    const templateTags = this.state.templateTags.map((tag, i) => {
      const active = werk.template.tags.indexOf(tag.slug) > -1 ? 'active' : '';
      return (
        <div
          key={i}
          className={`template-tag-option ${active}`}
          onClick={() => {
            if (werk.template.tags.indexOf(tag.slug) > -1) {
              actions.removeTemplateTag(tag.slug);
            } else {
              actions.addTemplateTag(tag.slug);
            }
          }}
        >
          {tag.property}
        </div>
      );
    });

    return (
      <div>
        <div id="chart-save-alerts">
          <div className="alert alert-success" hidden>
            <strong>Nice werk!</strong> Successfully saved your chart.
          </div>
          <div className="alert alert-danger" hidden>
            <strong>Ack!</strong> There was an error and your chart wasn't saved. Try again?
          </div>
        </div>
        <div>
          <div>
            <h4>Save to Chartwerk</h4>
            <small>
              Ready to publish? Save your chart before collecting an
              embed code below, download a shareable image of your chart or
              save this chart as a template for others to use.
            </small>
          </div>
          <div className="form-group">
            <label>Title</label>
            <input
              className="form-control"
              placeholder="What will we call it?"
              maxLength="100"
              type="text"
              value={this.state.chartTitle}
              onChange={(e) => this.setChartTitle(e.target.value)}
            />
          </div>
          <button
            className="btn btn-lg btn-huge"
            onClick={this.getDimensions}
            disabled={!werk.text.title}
          >
            <i id="save-chart-check" className="fa fa-check-circle-o" aria-hidden="true"></i>
            <i id="save-chart-spinner" className="fa fa-circle-o-notch fa-spin" hidden></i>
            &nbsp;Save chart
          </button>
          <div>
            <label className="section section-option right borderless">
              Clone to new chart?
              <input
                type="checkbox"
                checked={this.state.newChart}
                onClick={() => this.setState({ newChart: !this.state.newChart })}
              />
              <i className="fa fa-square-o"></i>
              <i className="fa fa-check-square-o"></i>
            </label>
          </div>
        </div>
        <EmbedCode {...this.props} location={locations.chart} />
        <div className="fifty-fifty">
          <h4>Download an image</h4>
          <button
            className="btn btn-lg"
            onClick={this.screenshot}
          >
            <i className="fa fa-camera" aria-hidden="true"></i>
            &nbsp;Screenshot
          </button>
          <div>
            <label className="section section-option">
              Include chatter?
              <input
                type="checkbox"
                checked={this.state.screenshotChatter}
                onClick={() => this.setState({ screenshotChatter: !this.state.screenshotChatter })}
              />
              <i className="fa fa-square-o"></i>
              <i className="fa fa-check-square-o"></i>
            </label>
          </div>
        </div>
        <div className="fifty-fifty">
          <div>
            <h4>Save as a template</h4>
          </div>
          <button
            className="btn btn-lg"
            onClick={() => this.setState({ templateModal: true })}
          >Save template</button>
        </div>

        <Modal
          isOpen={this.state.templateModal}
          onRequestClose={() => this.setState({ templateModal: false })}
          style={modalStyles}
        >
          <i className="fa fa-times" onClick={() => this.setState({ templateModal: false })}></i>
          <p>
            <em>Template developers can save charts as templates, which allows other
            users to more easily create similar charts.
            </em>
          </p>
          <div className="form-group">
            <h4>Metadata</h4>
            <label htmlFor="template-title">What&rsquo;s the title of this template?</label>
            <input
              type="text"
              className="form-control"
              id="template-title"
              placeholder="e.g., Scatterplot with linear trendline"
              value={this.state.templateTitle}
              onChange={(e) => this.setTemplateTitle(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="template-description">
              Add a detailed description of your template.
            </label>
            <SimpleMDE
              id="template-description"
              onChange={(value) => { this.setTemplateDescription(value); }}
              value={this.state.templateDescription}
              options={{
                autofocus: false,
                spellChecker: false,
                initialValue: this.state.templateDescription,
              }}
            />
          </div>
          <DatamapOpts {...this.props} />
          <div className="form-group">
            <h4>Tags</h4>
            <label>Add all appropriate tags for this template.</label>
            <div>
              {templateTags}
            </div>
          </div>
          <div id="template-save-alerts">
            <div className="alert alert-success" hidden>
              <strong>Nice werk!</strong> Successfully saved your template.
            </div>
            <div className="alert alert-danger" hidden>
              <strong>Ack!</strong> There was an error and your
                template wasn&rsquo;t saved. Try again?
            </div>
          </div>
          <div className="form-group">
            <div>
              <label className="section section-option center borderless">
                Save as new template?
                <input
                  type="checkbox"
                  checked={this.state.newTemplate}
                  onClick={() => this.setState({ newTemplate: !this.state.newTemplate })}
                />
                <i className="fa fa-square-o"></i>
                <i className="fa fa-check-square-o"></i>
              </label>
            </div>
            <button
              className="btn btn-huge"
              disabled={!werk.template.title}
              onClick={this.saveTemplate}
            >
              <i id="save-template-check" className="fa fa-check-circle-o" aria-hidden="true"></i>
              <i id="save-template-spinner" className="fa fa-circle-o-notch fa-spin" hidden></i>
              &nbsp;Save Template
            </button>
          </div>
        </Modal>
      </div>
    );
  },
});
