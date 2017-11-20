WW.ModestMapsController = function(map, isMobile) {
    this.map = map;
    this.game = null;
    this.isMobile = isMobile;
    this.hasMarkerLayer = false;
    //pass this to the site.js as the guycenter var
    this.offset = {
        x: (map._size.x * 0.75) - 500 - 50,
        y: (map._size.y * 0.3) + 100 + 60
    };

    this.initMarkerLayer();
    this.registerForMapAnswers();
};

WW.ModestMapsController.prototype = {
    map: null,
    offset: null,

    point: function(lat, lon) {
        return L.latLng(lat, lon);
    },

    toPixel: function(point) {
        return this.map.latLngToContainerPoint(point);
    },

    distance: function(p1, p2) {
        return Math.sqrt(
            Math.pow(p2.x - p1.x, 2) +
            Math.pow(p2.y - p1.y, 2));
    },

    initMarkerLayer: function() {
        this.gj = {
            "type": "FeatureCollection",
            "features": []
        };
        // window.geojson = gj;
        // var markers = mmg().map(this.map).factory(function(x) {
        //     var elem = document.createElement('div');
        //     elem.className = 'mapplace ' + (x.properties.klass || '');
        //     elem.innerHTML = x.properties.text || '';
        //     return elem;
        // }).geojson(gj);

        // markers.destroy = function() {
        //   $('.mapplace').remove();
        // }

        // this.layer = L.geoJSON(this.gj.features);
        // this.map.addLayer(this.layer);
        this.hasMarkerLayer = true;
    },

    registerForMapAnswers: function() {
        var self = this;
        if (this.isMobile) {
            $('body').bind('map-tap', function(event, pos) {
                var map = self.map,
                    game = self.game;
                // alert('tap');
                if (!game || !game.question || !game.isStarted) {
                    return;
                }
                // alert('pass');
                var destinationLocation = self.point(game.question.lat, game.question.lon);
                var mapPoint = map.pointLocation(new MM.Point(pos.x, pos.y));
                var distance = MM.Location.distance(mapPoint, destinationLocation) / 1000;
                // console.log(distance);
                //calculate the answer values
                var answer = new WW.Answer(mapPoint, destinationLocation, distance);
                game.isAnswerCorrect(answer);
            });
        } else {
            this.map.on('move', _.throttle(function() {
                var map = self.map,
                    game = self.game;
                if (!game || !game.question || !game.isStarted) {
                    return;
                }
                var destinationPixel = self.toPixel(self.point(game.question.lat, game.question.lon));
                var distance = self.distance(game.mapController.offset, destinationPixel);
                console.log(distance);
                //calculate the answer values
                var answer = new WW.Answer(game.mapController.offset, destinationPixel, distance);
                game.isAnswerCorrect(answer);
            }));
        }
    },

    addPointToGeoJSON: function(point) {
        if (!this.game.isStarted) {
            return;
        }

        // var markersLayer = this.map.getLayerAt(1);
        // var geoJSON = markersLayer.geojson();
        // this.map.removeLayer(this.layer);
        // this.gj.features.push(point);
        // this.layer = L.geoJSON(this.gj.features);
        var marker = L.marker([point.geometry.coordinates[1], point.geometry.coordinates[0]]).addTo(this.map)
            .bindPopup(point.properties.text)
            .openPopup();
        this.map.addLayer(marker);
        // markersLayer.geojson(geoJSON);
    },

    goToInitPosition: function() {
        // this.game.map.zoom(5).center({ lat: 0, lon: 0 });
        this.game.map
            .flyTo(L.latLng(0, 0), 5);
    },

    reset: function() {
        this.goToInitPosition();
        this.offset = {
            x: (this.map._size.x * 0.75) - 500 - 50,
            y: (this.map._size.y * 0.3) + 100 + 60
        };
        if (this.hasMarkerLayer) {
            // this.map.removeLayerAt(1);
            this.hasMarkerLayer = false;
            this.initMarkerLayer();
        }
    }
};