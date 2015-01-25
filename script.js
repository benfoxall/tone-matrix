// var frequencies = [880, 783.99, 698.46, 659.26, 587.33, 523.25, 493.88];

function boxLayout(){
  var width = 400,
      height = 400,
      padding = .2,
      update = function(){},
      data;

  var x = d3.scale.linear(),
      y = d3.scale.linear();

  function layout(_data){
    if(!(data = _data || data)) return;

    var x_max = d3.max(data.map(prop('i')));
    var y_max = d3.max(data.map(prop('j')));

    console.log(x_max, y_max);

    x
      .domain([0,x_max+1])
      .range([0,width]);

    y
      .domain([0,y_max+1])
      .range([0,height]);

    var w = x(1), h = y(1);

    data.forEach(function(d){
      d.width  = w*(1-padding);
      d.height = h*(1-padding);
      d.x = x(d.i)+(w*padding*.5);
      d.y = y(d.j)+(h*padding*.5);
    });

    update(data);
  }

 layout.update = function(_){
    return (typeof(_) === 'undefined') ? 
      update : ((update = _), this);
  }

  layout.width = function(_){
    return (typeof(_) === 'undefined') ? 
      width : ((width = _), this);
  }

  layout.height = function(_){
    return (typeof(_) === 'undefined') ? 
      height : ((height = _), this);
  }

  layout.padding = function(_){
    return (typeof(_) === 'undefined') ? 
      padding : ((padding = _), this);
  }

  return layout

  function prop(p){
    return function(obj){
      return obj[p]
    }
  }
}


var el = d3.select('body')
  .append('div')
  .attr('class', 'grid')


var b = boxLayout()
  .width(window.innerWidth)
  .height(window.innerHeight);


function Note(i, j){
  this.i = i;
  this.j = j;
}

Note.prototype.handle = function() {  
  this.active = !this.active;
  item.attr('class', function(d){return d.active ? 'item active' :'item'})
};


var timesteps = 16,
    notes = [];

for(var i = 0; i < timesteps; i++){
  for(var j = 0; j < 10; j++){
    notes.push(new Note(i,j))
  }
}

var item = el.selectAll('.item')
  .data(notes);

b.update(function(data){

  item = item.data(data)

  item
    .enter()
    .append('div')
    .style('width', 0)
    .style('height', 0)
    .attr('class', 'item')
    .on('touchstart', handler)
    .on('mousedown', handler)
    // .style('transition-delay', function(d){return ((d.j+d.i) / 70) + 's'});

  item
    .exit()
    .transition()
    .style('width', 0)
    .remove();

  item
    .style('transform', function(d){return 'translate('+d.x+'px, '+d.y+'px)'})
    .style('width', function(d){return d.width + 'px'})
    .style('height', function(d){return d.height + 'px'})

  function handler(d){
    d.handle && d.handle()
  }

})

b(notes);

var duration = 2;
var timescale = d3.scale.linear()
  .domain([0, timesteps])
  .range([0,duration])

function schedule(){
  notes.forEach(function(n,i){
    if(n.active){
      var f = 1200 - (n.j*100),
          t = timescale(n.i);
      play(f, t);
      setTimeout(function(){
        item[0][i].className = 'item playing'
        setTimeout(function(){
          item[0][i].className = n.active ? 'item active' : 'item'
        }, 500)
      }, t*1000)
    }
  });
}

setInterval(schedule, duration*1000)


context =
  typeof(webkitAudioContext) !== 'undefined' ? 
     new webkitAudioContext() :
     new AudioContext();

function play(f, off){

  var now = context.currentTime + (off||0);

  var oscillator = context.createOscillator();

  oscillator.frequency.value = f;
  // Create sound source  

  var gainNode = context.createGain();
  gainNode.gain.value = 0;
  gainNode.gain.exponentialRampToValueAtTime(0.4, now+0.2);
  gainNode.gain.linearRampToValueAtTime(0, now+0.5);
  oscillator.connect(gainNode);
  gainNode.connect(context.destination);

  // gainNode.start(0)
  oscillator.start(now);
  oscillator.stop(now+1);

}

//19.55 -> 20:14







// ting
var tingBuffer;

var xhr = new XMLHttpRequest();
xhr.open('GET', '_ting.mp3', true);
xhr.responseType = 'arraybuffer';

// Decode asynchronously
xhr.onload = function() {
  context.decodeAudioData(xhr.response, function(buffer) {
    tingBuffer = buffer;
    // if(!firstLoaded) firstLoaded = name;
  }, function(e){
      console.log("an error occured requesting ", url, e)
  });
}
xhr.send();



/*
var filter = context.createBiquadFilter();
filter.type = "lowshelf";
filter.frequency.value = 1000;
filter.gain.value = 25;
filter.connect(context.destination);

function play(f, off){

  if(!tingBuffer) return;

  var now = context.currentTime + (off||0);

  var rate =  f/200

  var source = context.createBufferSource();
      source.buffer = tingBuffer;
      source.playbackRate.value = rate;
      // source.connect(context.destination);
      source.connect(filter)
      source.start(now);

}
*/


function fitWindow(){

  b.width(window.innerWidth);
  b.height(window.innerHeight);
  b();
}

fitWindow();

d3.select(window).on('resize', fitWindow)
