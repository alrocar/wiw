function putbird() {
  document.getElementById('bird').style.display = 'block';
  return false;
}

window.onload = function() {
  var gj = {
    "type": "FeatureCollection",
    "features": [

      // { "type": "Feature",
      //   "geometry": { "type": "Point",
      //     "coordinates": [-122.6750, 45.5160]
      //   },
      //   "properties": {
      //     "text":  "Good!"
      //   }
      // },
      // { "type": "Feature",
      //   "geometry": { "type": "Point",
      //     "coordinates": [-122.7500, 45.5390]
      //   },
      //   "properties": {
      //     "klass": "pirate"
      //   }
      // },
      // { "type": "Feature",
      //   "geometry": { "type": "Point",
      //     "coordinates": [-122.6243, 45.5097]
      //   },
      //   "properties": {
      //     "klass": "birdbutton",
      //     "text": "<a id='bird-on-it' href='#' onclick='putbird(this);'>put a bird on it</a>"
      //   }
      // },
      // { "type": "Feature",
      //   "geometry": { "type": "Point",
      //     "coordinates": [-122.6990, 45.5505]
      //   },
      //   "properties": {
      //     "klass": "fish"
      //   }
      // },
      // { "type": "Feature",
      //   "geometry": { "type": "Point",
      //     "coordinates": [-122.6972, 45.5509]
      //   },
      //   "properties": {
      //     "klass": "fish_slow"
      //   }
      // },
      // { "type": "Feature",
      //   "geometry": { "type": "Point",
      //     "coordinates": [-122.6622, 45.4871]
      //   },
      //   "properties": {
      //     "klass": "fish_slow"
      //   }
      // },
      // { "type": "Feature",
      //   "geometry": { "type": "Point",
      //     "coordinates": [-122.6566, 45.4725]
      //   },
      //   "properties": {
      //     "klass": "fish"
      //   }
      // },
      // { "type": "Feature",
      //   "geometry": { "type": "Point",
      //     "coordinates": [-122.6643, 45.5097]
      //   },
      //   "properties": {
      //     "klass": "right-side",
      //     "text":  "The awesome <a href='http://www.omsi.edu/'>OMSI Science Museum</a> would make a perfect stop on a Portland bike tour. <hr /> 1945 SE Water Ave"
      //   }
      // },
      // { "type": "Feature",
      //   "geometry": { "type": "Point",
      //     "coordinates": [-122.6846, 45.5272]
      //   },
      //   "properties": {
      //     "text":  "<a href='http://www.powells.com/locations/powells-city-of-books/'>Powell's City of Books</a> is the largest independent bookseller in the world and this store occupies an entire city block. They have everything. <hr /> 1005 W Burnside Ave  "
      //   }
      // },
      // { "type": "Feature",
      //   "geometry": { "type": "Point",
      //     "coordinates": [-122.6712, 45.5221]
      //   },
      //   "properties": {
      //     "klass": "right-side",
      //     "text":  "<a href='http://stumptowncoffee.com/location/downtown/'>Stumptown</a> makes some of the best and most well-known coffee in town. <hr /> 128 SW 3rd Ave"
      //   }
      // },
      // { "type": "Feature",
      //   "geometry": { "type": "Point",
      //     "coordinates": [-122.6910, 45.5219]
      //   },
      //   "properties": {
      //   "klass": "left-side",
      //     "text":  "Portland is <a href='http://www.foodcartsportland.com/'>home to hundreds of food carts</a> and this is one of the largest pods where they gather, with dozens to choose from. <hr />SW Alder Street between 9th and 11th Aves"
      //   }
      // },
      // { "type": "Feature",
      //   "geometry": { "type": "Point",
      //     "coordinates": [-122.6832, 45.5131]
      //   },
      //   "properties": {
      //   "klass": "left-side",
      //     "text":  "<a href='http://en.wikipedia.org/wiki/Tom_McCall_Waterfront_Park'>Tom McCall Waterfront Park</a> runs along the Willamette River and has great views of the city and surrounding mountains."
      //   }
      // },
      // { "type": "Feature",
      //   "geometry": { "type": "Point",
      //     "coordinates": [-122.667, 45.5325]
      //   },
      //   "properties": {
      //     "text":  "We picked the <a href='http://www.oregoncc.org/'>Oregon Convention Center</a> because it is modern, green, and tech friendly.<hr />777 NE ML King Blvd."
      //   }
      // },
      // { "type": "Feature",
      //   "geometry": { "type": "Point",
      //     "coordinates": [-122.6535, 45.5320]
      //   },
      //   "properties": {
      //     "klass": "right-side",
      //     "text":  "<a href='http://www.nacis.org/'>NACIS</a> is right nearby and held from October 17-19th.<hr />The DoubleTree by Hilton <br>1000 NE Multnomah Street"
      //   }
      // },
      //       { "type": "Feature",
      //   "geometry": { "type": "Point",
      //     "coordinates": [-122.6600, 45.5280]
      //   },
      //   "properties": {
      //     "klass": "right-side",
      //     "text":  "<a href='http://wherecamppdx.org/'>WhereCamp PDX</a> is a mapping unconference happening on October 13-14.<hr /> Metro Regional Center <br>600 NE Grand Ave"
      //   }
      // },
      // { "type": "Feature",
      //   "geometry": { "type": "Point",
      //     "coordinates": [-122.6505, 45.5427]
      //   },
      //   "properties": {
      //     "klass": "big tokyo",
      //     "text":  "<p>Looking for <a href='http://www.stateofthemap.org/'>State of the Map Tokyo?</a></p>"
      //   }
      // }
    ]
  };

  var islands = [
      // Nauru
      { lat: -0.527288, lon: 166.936724,
          content: '<marquee>welcome to <a href="http://en.wikipedia.org/wiki/Nauru">Nauru</a>!</marquee>' }
  ];

  osm = new modLayer(new MM.Template('http://localhost/sotmus/STAMEN_TONER_flatx/{Z}/{X}/{Y}.jpg'), sepia);
   //osm = new MM.TemplatedLayer('http://c.tiles.mapbox.com/v3/tmcw.map-5vaivzxq/{Z}/{X}/{Y}.png');
  var th = new MM.ThrowableHandler();
  
  var map = new MM.Map('back-map', osm, null, [th]);
  var game = new WW.Game(new WW.gcapitals(WW.wcapitals), null, null, null, map, new WW.ModestMapsController(map));
  var markers = mmg().map(map).factory(function(x) {
      var elem = document.createElement('div');
      elem.className = 'mapplace ' + (x.properties.klass || '');
      elem.innerHTML = x.properties.text || '';
      return elem;
  }).geojson(gj);
  map.addLayer(markers);
  window.map = map;
  window.geojson = gj;
  window.game = game;
  game.start();

  var hintshown = true;

  // there are 8 frames in the sequence
  var frame = 0;
  var lastdate = +new Date();

   var spritetypes = {
     left:  -140,
     right: -210,
     down: 0,
     down_left: -280,
     down_right: -350,
     up_left: -420,
     up_right: -490,
     up: -70,
     idle: -560
   };

  /*var spritetypes = {
    left:  -607,
    right: -202,
    down: 0,
    down_left: -708,
    down_right: -101,
    up_left: -506,
    up_right: -303,
    up: -405,
    idle: -560
  };*/

   function f2y(y) {
     return y * -60;
   }
   var totalFrames = 8;
/*  var totalFrames = 10;
  function f2y(y) {
    return y * -75;
  }*/

  var dir, guydir = 'down';

  th.callback(function(speed) {
    dir = Math.atan2(speed.y, speed.x) / (Math.PI / 4);

    var x;
    switch (Math.round(dir)) {
      case 2:  guydir = 'up'; break;
      case 3:  guydir = 'up_right'; break;
      case 1:  guydir = 'up_left'; break;
      case -2: guydir = 'down'; break;
      case -1: guydir = 'down_left'; break;
      case -3: guydir = 'down_right'; break;
      case 4:  guydir = 'right'; break;
      case -4: guydir = 'right'; break;
      case 0:  guydir = 'left'; break;
    }

    // Euclidean distance, normalize
    var spd = Math.round(Math.sqrt(Math.pow(speed.x, 2) + Math.pow(speed.y, 2)) / 5);

    if ((+new Date() - lastdate) > (110 / spd)) {
        frame++;
        lastdate = +new Date();
        if (frame > 8) frame = 0;
    }

    if (spd < 1) {
        frame = 0;
    }

    if (hintshown) {
        var ks = document.getElementById('keyboard-shortcuts');
        ks.parentNode.removeChild(ks);
        hintshown = false;
    }

     document.getElementById('person-marker').style.backgroundPosition = spritetypes[guydir] + 'px ' + f2y(frame) + 'px';
    //document.getElementById('person-marker').style.backgroundPosition =  f2y(frame) + 'px ' + spritetypes[guydir] + 'px';
  });

  var frt = 80,
      lastIdle = +new Date();

  function drawidle() {
    if ((+new Date() - lastIdle) > frt) {
        var speed = th.speed();
        var spd = Math.round(Math.sqrt(Math.pow(speed.x, 2) + Math.pow(speed.y, 2)) / 5);
        if (spd < 1) {
            document.getElementById('person-marker').style.backgroundImage = 'url(img/idle-cycle.png)';
            frame++;
            if (frame > 8) frame = 0;
            document.getElementById('person-marker').style.backgroundPosition = spritetypes[guydir] + 'px ' + f2y(frame) + 'px';
        } else {
            document.getElementById('person-marker').style.backgroundImage = 'url(img/walk-cycle.png)';
        }
        lastIdle = +new Date();
    }
    MM.getFrame(drawidle);
  }

  MM.getFrame(drawidle);

  map.zoom(5).center({ lat: 0, lon: 0 });


  // Non map related
  // --------------------------------------------------------------------------

  var home_page = document.getElementById('home');
  var venue_page = document.getElementById('venue');

  function go_venue() {
    home_page.style.display = 'none';
    venue_page.style.display = 'block';
  }

  function go_home() {
    home_page.style.display = 'block';
    venue_page.style.display = 'none';
  }

  document.getElementById('go-venue').onclick = go_venue;
  document.getElementById('go-home').onclick = go_home;

  if (window.location.hash) {
    if (window.location.hash == '#home') return;
    if (window.location.hash == '#venue') go_venue();
  }

  // Extras
  // ----------------------------------------------------------------

  function inbounds(pos) {
      return (pos.x > 0 && pos.x < map.dimensions.x &&
          pos.y > 0 && pos.y < map.dimensions.y);
  }

var guycenter = {
      x: (map.dimensions.x * 0.75) - 90,
      y: (map.dimensions.y * 0.3) + 100      
  };

  var piratecenter = new MM.Location(45.5390, -122.7500);

  var pirateinterval;
  var stabframe = 0;

  map.addCallback('drawn', _.throttle(function() {
      var dist = MM.Location.distance(
          map.pointLocation(guycenter),
          piratecenter);
      if (dist < 400 && !pirateinterval) {
          var pirate = document.getElementsByClassName('pirate')[0];
          document.getElementById('status-message').innerHTML = 'stop, that hurts';
          document.getElementById('status-message').className = 'blinktag';
          pirateinterval = window.setInterval(function() {
              stabframe++;
              if (stabframe > 1) stabframe = 0;
              pirate.style.backgroundPosition = '0px ' + (stabframe * -65) + 'px';
          }, 300);
      }
      if (dist > 400 && pirateinterval) {
          window.clearInterval(pirateinterval);
          pirateinterval = null;
          document.getElementById('status-message').innerHTML = '';
          document.getElementById('status-message').className = '';
      }

  }, 100));



  function throwBall() {
      var ball = document.createElement('div');
      ball.className = 'ball';
      map.parent.appendChild(ball);

      var ballpos = {
          x: (map.dimensions.x * 0.75) - 110,
          y: (map.dimensions.y * 0.3) + 100
      };

      var ballrun = (function(ballpos, ball, dir) {
          return function() {
              if (inbounds(ballpos)) {
                  MM.moveElement(ball, ballpos);
                  ballpos.x -= Math.cos(dir);
                  ballpos.y -= Math.sin(dir);
                  MM.getFrame(ballrun);
              } else {
                  ball.parentNode.removeChild(ball);
              }
          };
      })(ballpos, ball, dir);

      MM.getFrame(ballrun);
  }

  function goisland() {
      var island = islands[0];
      map.center(island);
      document.getElementById('status-message').innerHTML = island.content;
      document.getElementById('status-message').className = 'blinktag';
  }

  var keymap = {
      32: [throwBall],
      73: [goisland, true]
  };

  MM.addEvent(document, 'keydown', function(e) {
      if (e.keyCode in keymap) {
          if (keymap[e.keyCode][1] && !e.ctrlKey) {
              return;
          }
          keymap[e.keyCode][0]();
      }
  });
};


