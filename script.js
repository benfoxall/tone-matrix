var frequencies = [100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200],
    timings     = [0, 100, 200, 300, 400, 500, 600, 700, 800];

var matrix = timings.map(function(t, t_i){
  return frequencies.map(function(f, f_i){
    return {
      t:   t,
      f:   f,
      t_i: t_i,
      f_i: f_i,
      active: false
    }
  })
});

var flat = matrix.reduce(function(a, b) {
  return a.concat(b);
});

var width  = 400,
    height = 400;

var x = d3.scale.linear()
          .domain([0, timings.length+1])
          .range([0, width]),

    y = d3.scale.linear()
          .domain([0, frequencies.length+1])
          .range([0, height]),

    fill = function(data){
      return data.active ? '#08f' : '#eee'
    },

    eq = function(a){
      return function(b){
        return a === b;
      }
    };

var svg = d3.select('body')
            .append('svg')
            .attr('width', width)
            .attr('height', height);

var items = svg.selectAll('rect').data(flat);

items.enter()
  .append('rect')
  .attr('width', x(.9))
  .attr('height', y(.9))
  .attr('x', function(d){return x(d.t_i)})
  .attr('y', function(d){return y(d.f_i)})
  .attr('rx', x(.1))
  .attr('ry', y(.1))
  .style('fill', fill)
  .style('cursor', 'pointer')
  .on('click', function(data){
    data.active = !data.active;

    items
      .filter(eq(data))
      .transition()
      .style('fill', fill)
  })

