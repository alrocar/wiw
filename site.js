$(document).ready(function() {
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

  osm = new modLayer(new MM.Template('/wiw/LOCAL_flatx/{Z}/{X}/{Y}.png'), sepia);
   //osm = new MM.TemplatedLayer('http://c.tiles.mapbox.com/v3/tmcw.map-5vaivzxq/{Z}/{X}/{Y}.png');
  var th = new MM.ThrowableHandler();
  var handlers = [th, easey_handlers.DragHandler(),
                easey_handlers.TouchHandler()/*,
                easey_handlers.MouseWheelHandler(),
                easey_handlers.DoubleClickHandler()*/];
  
  // var handlers = [th, new MM.DragHandler(), new MM.TouchHandler()];
  
  var map = new MM.Map('back-map', osm, null, handlers);
  var ui = new UI.ui();
  var game = new WW.Game(new WW.gcapitals(WW.wcapitals), new WW.User('alrocar', 'void', 'void'), ui, null, map, new WW.ModestMapsController(map));
  var character = new WW.Character(game, th, players.sotmus);
  ui.setGame(game);
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

  map.zoom(5).center({ lat: 0, lon: 0 });  
});