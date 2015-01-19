var frequencies = [800, 750, 700, 650, 600, 550, 500, 450, 400, 350, 300],

    duration    = 2000,
    steps       = 10,
    step        = duration/steps,
    timings     = d3.range(step, duration, step);

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
  .attr('rx', x(.1))
  .attr('ry', y(.1))
  .attr('x', function(d){return x(d.t_i)})
  .attr('y', function(d){return y(d.f_i)})
  .style('fill', fill)
  .style('cursor', 'pointer')
  .on('click', function(data){
    data.active = !data.active;

    items
      .filter(eq(data))
      .transition()
      .style('fill', fill)
  })



// audio stuff
// it's more important to be in sync, rather than continous

// HACKY / TEMPORARY


// queue a bar of music TEMP
function queue(){
  matrix.forEach(function(notes, i){
    setTimeout(function(){
      notes.filter(function(d){
        return d.active
      }).forEach(function(d){
        play(d.f)
      });

      items
        .style('fill', fill)

        .filter(function(d){
          if(notes.indexOf(d) > -1){
            return true;
          }
        })
        // .transition()
        .style('fill', function(d){
          return d.active ? '#f08' : '#ddd';
        })



    },step*i);
  });

  setTimeout(queue, duration-step);
}

queue();




context = new webkitAudioContext();

function play(f){

  var now = context.currentTime;

  var oscillator = context.createOscillator();

  oscillator.frequency.value = f;
  // Create sound source  

  var gainNode = context.createGain();
  gainNode.gain.value = 0;
  gainNode.gain.exponentialRampToValueAtTime(1.0, now+0.2);
  gainNode.gain.linearRampToValueAtTime(0, now+0.5);
  oscillator.connect(gainNode);
  gainNode.connect(context.destination);


  // gainNode.start(0)
  oscillator.start(now);
  oscillator.stop(now+1);

}
