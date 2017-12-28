import * as d3 from 'd3';

export default {

  create(el, props, that) {
    const svg = d3.select(el)
      .append('svg')
      .attr('width', props.width + 40 + 40)
      .attr('height', props.height + 20 + 20)
    .append('g')
      .attr('class', 'margin-chart')
      .attr('transform', 'translate(40, 20)');

    svg
      .append('rect')
        .attr('class', 'margin-background')
        .attr('width', props.width)
        .attr('height', props.height)
        .attr('x', 0)
        .attr('y', 0);

    svg
      .append('text')
      .attr('class', 'margin-label top')
      .attr('text-anchor', 'middle')
      .attr('x', props.width / 2)
      .attr('y', -6);

    svg
      .append('text')
      .attr('class', 'margin-label bottom')
      .attr('text-anchor', 'middle')
      .attr('x', props.width / 2)
      .attr('y', props.height + 20);

    svg
      .append('text')
      .attr('class', 'margin-label left')
      .attr('text-anchor', 'end')
      .attr('x', -6)
      .attr('y', (props.height / 2) + 6);

    svg
      .append('text')
      .attr('class', 'margin-label right')
      .attr('text-anchor', 'start')
      .attr('x', props.width + 6)
      .attr('y', (props.height / 2) + 6);

    svg
      .append('rect')
        .attr('class', 'margin-foreground');
    svg
      .append('rect')
      .attr('class', 'margin-handle top');
    svg
      .append('rect')
      .attr('class', 'margin-handle bottom');
    svg
      .append('rect')
      .attr('class', 'margin-handle right');
    svg
      .append('rect')
      .attr('class', 'margin-handle left');


    this.update(el, props, that);
  },

  update(el, props, that) {
    const scales = this.scales(props);

    this.draw(el, props, scales, that);
  },

  margins(props) {
    return {
      top: props.top * props.height,
      bottom: props.bottom * props.height,
      right: props.right * props.width,
      left: props.left * props.width,
    };
  },

  scales(props) {
    const x = d3.scaleLinear()
      .domain([0, 1])
      .range([0, props.width]);
    const y = d3.scaleLinear()
      .domain([0, 1])
      .range([0, props.height]);

    return { x, y };
  },

  draw(el, props, scales, that) {
    const rect = d3.select(el).select('.margin-foreground');
    const handleLeft = d3.select(el).select('.margin-handle.left');
    const handleRight = d3.select(el).select('.margin-handle.right');
    const handleTop = d3.select(el).select('.margin-handle.top');
    const handleBottom = d3.select(el).select('.margin-handle.bottom');
    const labelTop = d3.select(el).select('.margin-label.top');
    const labelBottom = d3.select(el).select('.margin-label.bottom');
    const labelLeft = d3.select(el).select('.margin-label.left');
    const labelRight = d3.select(el).select('.margin-label.right');
    const margin = this.margins(props);
    const innerWidth = props.width - margin.left - margin.right;
    const innerHeight = props.height - margin.top - margin.bottom;


    function ldrag() {
      const x = scales.x.invert(d3.event.x);
      const newX = d3.max([0, d3.min([x, 0.25])]).toFixed(2);
      that.dragMargin(newX, 'left');
    }

    function rdrag() {
      const x = scales.x.invert(d3.event.x);
      const newX = d3.max([0.75, d3.min([x, 1])]).toFixed(2);
      that.dragMargin(1 - newX, 'right');
    }

    function tdrag() {
      const y = scales.y.invert(d3.event.y);
      const newY = d3.max([0, d3.min([y, 0.25])]).toFixed(2);
      that.dragMargin(newY, 'top');
    }

    function bdrag() {
      const y = scales.y.invert(d3.event.y);
      const newY = d3.max([0.75, d3.min([y, 1])]).toFixed(2);
      that.dragMargin(1 - newY, 'bottom');
    }

    const dragLeft = d3.drag()
        .on('drag', ldrag);
    const dragRight = d3.drag()
        .on('drag', rdrag);
    const dragTop = d3.drag()
        .on('drag', tdrag);
    const dragBottom = d3.drag()
        .on('drag', bdrag);

    labelTop
      .text(`${Math.round(props.top * 100).toString()}%`);
    labelBottom
      .text(`${Math.round(props.bottom * 100).toString()}%`);
    labelLeft
      .text(`${Math.round(props.left * 100).toString()}%`);
    labelRight
      .text(`${Math.round(props.right * 100).toString()}%`);

    rect
      .attr('width', innerWidth)
      .attr('height', props.height - margin.top - margin.bottom)
      .attr('x', margin.left)
      .attr('y', margin.top);

    const thick = 16;

    handleLeft
      .attr('width', thick)
      .attr('height', innerHeight - (thick * 2))
      .attr('x', margin.left)
      .attr('y', margin.top + thick)
      .call(dragLeft);

    handleRight
      .attr('width', thick)
      .attr('height', innerHeight - (thick * 2))
      .attr('x', props.width - margin.right - thick)
      .attr('y', margin.top + thick)
      .call(dragRight);

    handleTop
      .attr('width', innerWidth)
      .attr('height', thick)
      .attr('x', margin.left)
      .attr('y', margin.top)
      .call(dragTop);

    handleBottom
      .attr('width', innerWidth)
      .attr('height', thick)
      .attr('x', margin.left)
      .attr('y', props.height - margin.bottom - thick)
      .call(dragBottom);
  },
};
