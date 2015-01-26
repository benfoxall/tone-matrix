var el = d3.select('body')
  .append('div')
  .attr('class', 'grid')

var b = boxLayout()
  .width(window.innerWidth)
  .height(window.innerHeight)
  .padding(0);


function Note(i, j){
  this.i = i;
  this.j = j;
}

Note.prototype.handle = function(element) {
  this.active = !this.active;

  // shortcut the active classes
  element.className = this.active ? 'item active' :'item';
};


var timesteps = 16,
    notes = [];

for(var i = 0; i < timesteps; i++){
  for(var j = 0; j < 7; j++){
    notes.push(new Note(i,j))
  }
}

// var notes2 = [];

// for(var i = 0; i < 5; i++){
//   for(var j = 0; j < 5; j++){
//     notes2.push(new Note(i,j))
//   }
// }

var timeButtons = [
  {i: 0, j:0, handle: function(){
    console.log("asdfas")
  }},{i: 1, j:0},{i: 2, j:0},{i: 3, j:0}
]



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
    // .style('transform', 'translate(0,0)')



  item
    .style('transform', function(d){return 'translate('+d.x+'px, '+d.y+'px)'})
    .transition()
    .delay(function(d,i){return 200+(i*10)})
    // .transition()
    // .delay(function(d,i){return i*10})
    .style('width', function(d){return d.width + 'px'})
    .style('height', function(d){return d.height + 'px'})

  item
    .exit()
    .transition()
    .style('width', 0)
    .remove();

item.attr('class', function(d){return d.active ? 'item active' :'item'})

  function handler(d){  
    // stop touches from firing mouse/click event
    d3.event.stopPropagation();
    d3.event.preventDefault();
    console.log(this)

    d.handle && d.handle(this)
  }

})

b(notes);

// this could be any timestamp, or tween of timestamps
// or whatever
var now = (function(){
  var serverOffset = 0;
  reqwest('http://js-time.herokuapp.com/')
  .then(function(d){ 
    serverOffset = Date.now() - parseInt(d);
    console.log(serverOffset)
  })

  return function now(){
    return Date.now() - serverOffset;
  }
})();


var duration = 2;
var timescale = d3.scale.linear()
  .domain([0, timesteps])
  .range([0,duration])

var cscale = [880, 783.99, 698.46, 659.26, 587.33, 523.25, 493.88];

function schedule(){

  var off = (duration*1000) - (now() % (duration*1000));
  // console.log(off);


  notes.forEach(function(n,i){
    if(n.active){
      var f = cscale[n.j], // 1200 - (n.j*100),
          t = timescale(n.i) + (off/1000);
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
  gainNode.gain.exponentialRampToValueAtTime(0.2, now+0.2);
  gainNode.gain.linearRampToValueAtTime(0, now+0.5);
  oscillator.connect(gainNode);
  gainNode.connect(context.destination);

  // gainNode.start(0)
  oscillator.start(now);
  oscillator.stop(now+1);

}


notes.reduce(function(list, note){
  if(list.indexOf(note.i + '_' + note.j) > -1){
    note.active = true;
  }
  return list;
}, ["0_3", "4_4", "8_5", "10_6", "12_7", "14_9"])



// ting
// var tingBuffer;

// var xhr = new XMLHttpRequest();
// xhr.open('GET', '_ting.mp3', true);
// xhr.responseType = 'arraybuffer';

// // Decode asynchronously
// xhr.onload = function() {
//   context.decodeAudioData(xhr.response, function(buffer) {
//     tingBuffer = buffer;
//     // if(!firstLoaded) firstLoaded = name;
//   }, function(e){
//       console.log("an error occured requesting ", url, e)
//   });
// }
// xhr.send();



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

var teardowns = [];


var timers = [ 
  {
    i: 0, j:0,
    handle: function(){
      console.log("set timer one")
    }
  },
  {
    i: 1, j:0,
    handle: function(){
      console.log("set timer two")
    }
  },
  {
    i: 2, j:0,
    handle: function(){
      console.log("set timer three")
    }
  },
  {
    i: 3, j:0,
    handle: function(){
      console.log("set timer four")
    }
  }
  
]

function showTimings(){
  b.padding(0.3)(timers)
}

function showNotes(){
  b.padding(0)(notes)
}

function showSingle(){
  b.padding(0)([{i:0,j:0}])
}




function fitWindow(){
  b
    .width(window.innerWidth)
    .height(window.innerHeight)
  ()
}

fitWindow();

d3.select(window).on('resize', fitWindow)
