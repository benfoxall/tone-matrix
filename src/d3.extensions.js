
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
