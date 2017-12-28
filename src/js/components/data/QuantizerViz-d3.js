import * as d3 from 'd3';
import _ from 'lodash';

module.exports = {

  create(el, props, state, that) {
    const margin = props.margin;
    const width = props.width - margin.left - margin.right;
    const height = props.height - margin.top - margin.bottom;

    const svg = d3.select(el)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('class', 'quant-chart')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    svg
        .append('g')
        .attr('class', 'quant-axis');

    this.update(el, props, state, that);
  },

  update(el, props, state, that) {
    const data = state.data;
    const thresholds = state.thresholds;
    const colorRange = state.colorRange;

    const scales = this.scales(el, props, data, thresholds, colorRange);

    this.draw(el, props, scales, data, thresholds, that);
  },

  scales(el, props, data, thresholds, colorRange) {
    const width = props.width - props.margin.right - props.margin.left;

    const x = d3.scaleLinear()
      .domain(d3.extent(data))
      .range([0, width]);

    const color = d3.scaleThreshold()
        .domain(_.slice(thresholds, 1)) // Without min point
        .range(colorRange);

    return { x, color };
  },

  draw(el, props, scales, data, thresholds, that) {
    // http://blog.magnetiq.com/post/497605344/rounding-to-a-certain-significant-figures-in
    function sigFigs(n, sig) {
      const mult = Math.pow(10,
          sig - Math.floor(Math.log(n) / Math.LN10) - 1);
      return Math.round(n * mult) / mult;
    }

    const height = props.height - props.margin.top - props.margin.bottom;

    const chartThresholds = _.slice(thresholds, 1);

    const drag = d3.drag()
              .on('drag', function(d, i) { // eslint-disable-line

                const I = thresholds.indexOf(d);
                const next = I < thresholds.length - 1 ?
                            thresholds[I + 1] : null;
                const prev = I > 1 ?
                            thresholds[I - 1] : null;

                const extent = d3.extent(data);
                const offset = (extent[1] - extent[0]) * 0.02; // 2% offest minimum
                const x = d3.event.x;

                let newX;

                // Limit values be neighboring threshold and minimum offsets
                if (next && prev) {
                  if (scales.x.invert(x) <= prev + offset) {
                    newX = scales.x(prev + offset);
                  } else if (scales.x.invert(x) >= next - offset) {
                    newX = scales.x(next - offset);
                  } else {
                    newX = x;
                  }
                } else if (next) {
                  newX = scales.x.invert(x) < next - offset ?
                  x : scales.x(next - offset);
                } else {
                  newX = scales.x.invert(x) < prev + offset ?
                  scales.x(prev + offset) : x;
                }

                // No values past data max or min
                if (scales.x.invert(newX) < extent[0] + offset) {
                  newX = scales.x(extent[0] + offset);
                } else if (scales.x.invert(newX) > extent[1] - offset) {
                  newX = scales.x(extent[1] - offset);
                }

                d3.select(this)
                .attr('x1', newX)
                .attr('x2', newX);
                that.dragThreshold(i, sigFigs(scales.x.invert(newX), 4));
              });

    const svg = d3.select(el).select('.quant-chart');

    const xAxis = d3.axisTop()
      .scale(scales.x)
      .ticks(5)
      .tickPadding(10);

    const bars = svg.selectAll('.quant-bars')
      .data(thresholds);

    bars.enter().append('rect')
      .attr('class', 'quant-bars');

    bars
      .attr('x', d => scales.x(d))
      .attr('height', height)
      .attr('width', (d, i) => {
        const max = i + 1 < thresholds.length ?
                  scales.x(thresholds[i + 1]) : scales.x.range()[1];
        return max - scales.x(d);
      })
      .attr('fill', d => scales.color(d));

    bars.exit().remove();

    const delimiters = svg.selectAll('.quant-lines')
        .data(chartThresholds);

    delimiters.enter().append('line')
      .attr('class', 'quant-lines');

    delimiters
      .attr('class', 'quant-lines')
      .attr('y1', 0)
      .attr('y2', height)
      .attr('x1', d => scales.x(d))
      .attr('x2', d => scales.x(d))
      .call(drag);

    delimiters.exit().remove();

    const distribs = svg.selectAll('.quant-distribs')
      .data(data);

    distribs.enter().append('line')
      .attr('class', 'quant-distribs');

    distribs
      .attr('y1', -2)
      .attr('y2', -12)
      .attr('x1', d => scales.x(d))
      .attr('x2', d => scales.x(d));

    distribs.exit().remove();

    d3.select('.quant-axis')
      .call(xAxis);
  },
};
