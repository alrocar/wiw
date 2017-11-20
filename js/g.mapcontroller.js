WW.ModestMapsController = function(map, isMobile) {
    this.map = map;
    this.game = null;
    this.isMobile = isMobile;
    this.hasMarkerLayer = false;
    //pass this to the site.js as the guycenter var
    this.offset = {
            x: (map.dimensions.x * 0.75) - 500 - 50,
            y: (map.dimensions.y * 0.3) + 100 + 60     
    };  

    this.initMarkerLayer();
    this.registerForMapAnswers();
};

WW.ModestMapsController.prototype = {
    map: null,
    offset: null,

    initMarkerLayer: function() {
        var gj = {
            "type": "FeatureCollection",
            "features": [
            ]
          };
          window.geojson = gj;
          var markers = mmg().map(this.map).factory(function(x) {
              var elem = document.createElement('div');
              elem.className = 'mapplace ' + (x.properties.klass || '');
              elem.innerHTML = x.properties.text || '';
              return elem;
          }).geojson(gj);
          
          markers.destroy = function() {
            $('.mapplace').remove();
          }

          this.map.addLayer(markers);
          this.hasMarkerLayer = true;
    },

    registerForMapAnswers: function() {
        var self = this;
        if (this.isMobile) {
            $('body').bind('map-tap', function(event, pos) {
                var map = self.map, game = self.game;
                // alert('tap');
                if (!game || !game.question || !game.isStarted) {
                    return;
                }
                // alert('pass');
                var destinationLocation = new MM.Location(game.question.lat, game.question.lon);
                var mapPoint = map.pointLocation(new MM.Point(pos.x, pos.y));
                var distance = MM.Location.distance(mapPoint, destinationLocation) / 1000;
                // console.log(distance);
                //calculate the answer values
                var answer = new WW.Answer(mapPoint, destinationLocation, distance);
                game.isAnswerCorrect(answer);
            });
        } else {
            this.map.addCallback('drawn', _.throttle(function() {
                var map = self.map, game = self.game;
                if (!game || !game.question || !game.isStarted) {
                    return;
                }
                var destinationPixel = map.locationPoint(new MM.Location(game.question.lat, game.question.lon));
                var distance = MM.Point.distance(game.mapController.offset, destinationPixel);
                // console.log(distance);
                //calculate the answer values
                var answer = new WW.Answer(game.mapController.offset, destinationPixel, distance);
                game.isAnswerCorrect(answer);
                })
            );
        }
    },

    addPointToGeoJSON: function(point) {
        if (!this.game.isStarted) {
            return;
        }

        var markersLayer = this.map.getLayerAt(1);
        var geoJSON = markersLayer.geojson();
        geoJSON.features.push(point);
        markersLayer.geojson(geoJSON);
    },

    goToInitPosition: function() {
        // this.game.map.zoom(5).center({ lat: 0, lon: 0 });
        easey().map(this.game.map)
          .to(this.game.map.locationCoordinate({lat: 0, lon: 0}))
          .zoom(5).run(1000);
      },

    reset: function() {
        this.goToInitPosition();
        this.offset = {
            x: (this.map.dimensions.x * 0.75) - 500 - 50,
            y: (this.map.dimensions.y * 0.3) + 100 + 60     
        };
        if (this.hasMarkerLayer) {
            this.map.removeLayerAt(1);
            this.hasMarkerLayer = false;
            this.initMarkerLayer();
        }
    }
};
