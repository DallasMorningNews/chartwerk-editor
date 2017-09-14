import React from 'react';
import marked from './../../misc/utils';
import ColorPicker from './ColorPicker';
import Legend from './Legend';
import { black } from './../../constants/colors';

export default React.createClass({

  propTypes: {
    actions: React.PropTypes.object,
    werk: React.PropTypes.object,
  },

  componentDidMount() {
    this.renderEditable();
  },

  componentDidUpdate() {
    if ($('#chart').length) {
      this.renderEditable();
    } else {
      setTimeout(() => this.renderEditable(), 500);
    }
  },

  addAnnotation() {
    const werk = this.props.werk;
    const actions = this.props.actions;
    const newNote = {
      size: werk.ui.size === 'single' ? 's' : 'd',
      w: 150,
      x: 0.0,
      y: 0.0,
      align: 'l',
      fontSize: 'm',
      background: true,
      text: '',
      color: black,
    };

    actions.addAnnotation(newNote);
  },

  focusNote(i) {
    $('.annotation.label').removeClass('editing');
    $('.annotation-formats')
      .not(`#annotation-editor-${i} .annotation-formats`)
      .slideUp(250);
    $(`.annotation.label[data-id='${i}']`).addClass('editing');
    $(`#annotation-editor-${i} .annotation-formats`).slideDown(250);
  },

  dragMove() {
    const actions = this.props.actions;

    $('.annotation.label .inner').on('mousedown', (e) => {
      e.stopPropagation();
      if (e.button > 0) return;

      const div = $(e.currentTarget).parent('.annotation.label');
      const id = div.data('id');
      const width = div.width();
      const height = div.height();
      const chartWidth = $('#chart').width();
      const chartHeight = $('#chart').height();

      let x = parseInt(div.css('left'), 10);
      let y = parseInt(div.css('top'), 10);

      const oX = x;
      const oY = y;
      const sX = e.pageX;
      const sY = e.pageY;

      $(document).on('mousemove.drag', (dragEvent) => {
        dragEvent.stopPropagation();
        x = Math.max(Math.min(oX + (dragEvent.pageX - sX), chartWidth - width), 0);
        y = Math.max(Math.min(oY + (dragEvent.pageY - sY), chartHeight - height), 0);
        div.css({ left: x, top: y });
      });

      $(document).one('mouseup', () => {
        $(document).off('mousemove.drag');
        actions.changeAnnotationPosition(id, x, y);
      });
    });
  },

  resize() {
    const actions = this.props.actions;

    $('.handle', '.annotation').on('mousedown', (e) => {
      e.stopPropagation();
      if (e.button > 0) return;

      const div = $(e.currentTarget).closest('.annotation.label');
      const id = div.data('id');
      const x = parseInt(div.css('left'), 10);
      const width = div.width();
      const maxWidth = $('#chart').width() - x;
      const minWidth = 20;

      let w;

      const oX = e.pageX;

      $(document).on('mousemove.drag', (dragEvent) => {
        dragEvent.stopPropagation();
        w = Math.max(Math.min(maxWidth, width + (dragEvent.pageX - oX)), minWidth);
        div.css({ width: w });
      });

      $(document).one('mouseup', () => {
        $(document).off('mousemove.drag');
        actions.changeAnnotationDimensions(id, w);
      });
    });
  },

  renderEditable() {
    const werk = this.props.werk;

    const chart = $('#chart');

    chart.css({ position: 'relative' });

    $('#chart .annotation.label').remove();

    werk.text.annotations.map((d, i) => {
      if (
        (d.size === 's' && werk.ui.size === 'double') ||
        (d.size === 'd' && werk.ui.size === 'single')
      ) {
        return false;
      }

      const text = d.text === '' ? 'Add text' :
          marked.inlineLexer(d.text, []);


      const editable =
      `<div class="annotation label" data-id="${i}">
        <div class="inner center">
          <p>${text}</p>
          <div class="handle"></div>
        </div>
      </div>`;

      $(editable)
        .css({
          position: 'absolute',
          left: d.x,
          top: d.y,
          width: d.w,
          height: 'auto',
          color: d.color || black,
        })
        .addClass(() => {
          let cls = `${d.align} ${d.fontSize}`;
          cls = d.background ? `${cls} bg` : cls;
          return cls;
        })
        .appendTo(chart);

      return false;
    });

    this.dragMove();
    this.resize();
  },

  changeTab(e) {
    e.preventDefault();
    $('a[href="#publish"]').tab('show');
    $('#editor-pane').animate({ scrollTop: 0 }, 300);
  },

  render() {
    const werk = this.props.werk;
    const actions = this.props.actions;

    const notes = werk.text.annotations.map((d, i) => (
      <div key={i} id={`annotation-editor-${i}`} className="annotation-editor">
        <div className="form-group size-switch">
          <img
            src={`${window.chartwerkConfig.static_prefix}img/icons/singleColumn.png`}
            title="Single-wide"
            className={d.size === 's' ? 'active' : 'inactive'}
            onClick={() => {
              actions.changeAnnotationSize(i, 's');
              this.focusNote(i);
              actions.changePreview('single');
            }}
            alt="Single-wide"
          />
          <img
            src={`${window.chartwerkConfig.static_prefix}img/icons/doubleColumn.png`}
            title="Double-wide"
            className={d.size === 'd' ? 'active' : 'inactive'}
            onClick={() => {
              actions.changeAnnotationSize(i, 'd');
              this.focusNote(i);
              actions.changePreview('double');
            }}
            alt="Double-wide"
          />
        </div>
        <div>
          <input
            type="text"
            className="form-control annotation-text"
            placeholder="Text here"
            onChange={e => actions.changeAnnotationText(i, e.target.value)}
            onFocus={() => this.focusNote(i)}
            value={d.text}
          />
          <i
            className="fa fa-times"
            onClick={() => actions.removeAnnotation(i)}
            title="Remove"
            role="button"
            tabIndex={0}
          />
        </div>
        <div className="annotation-formats">
          <div className="btn-group" role="group" aria-label="Alignment">
            <button
              type="button"
              className="btn btn-sm btn-secondary"
              title="Align left"
              onClick={() => actions.changeAnnotationAlign(i, 'l')}
            >
              <i
                className="fa fa-align-left"
                aria-hidden="true"
              />
            </button>
            <button
              type="button"
              className="btn btn-sm btn-secondary"
              title="Align center"
              onClick={() => actions.changeAnnotationAlign(i, 'c')}
            >
              <i
                className="fa fa-align-center"
                aria-hidden="true"
              />
            </button>
            <button
              type="button"
              className="btn btn-sm btn-secondary"
              title="Align right"
              onClick={() => actions.changeAnnotationAlign(i, 'r')}
            >
              <i
                className="fa fa-align-right"
                aria-hidden="true"
              />
            </button>
          </div>
          <div className="btn-group" role="group" aria-label="Size" >
            <button
              type="button"
              className="btn btn-sm btn-secondary"
              title="Small font"
              onClick={() => actions.changeAnnotationFontSize(i, 's')}
            >
              <i className="fa fa-font" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="btn btn-sm btn-secondary"
              title="Regular font"
              onClick={() => actions.changeAnnotationFontSize(i, 'm')}
            >
              <i className="fa fa-font fa-lg" aria-hidden="true" />
            </button>
          </div>
          <div className="btn-group" role="group" aria-label="Size">
            <button
              type="button"
              className="btn btn-sm btn-secondary"
              title="Background"
              onClick={() => actions.changeAnnotationBackground(i)}
            >
              BG
            </button>
          </div>
          <ColorPicker {...this.props} index={i} />
          <span>
            <em>_italic_</em> <strong>**bold**</strong>
          </span>
        </div>
      </div>
    ));

    return (
      <div>
        <h4>Free Annotations</h4>
        <small
          style={{ display: 'block' }}
        >Add free standing annotations below. Annotations must be created
        separately for each chart size.</small>
        <button className="btn btn-sm" onClick={this.addAnnotation}>Add +</button>
        <div className="annotations">
          {notes}
        </div>
        <Legend {...this.props} />

        <div className="guidepost">
          <h4>
            <a onClick={this.changeTab} href="">
              <b>Next:</b> Publish
              <i className="fa fa-arrow-circle-o-right" aria-hidden="true" />
            </a>
          </h4>
        </div>
      </div>
    );
  },

});
