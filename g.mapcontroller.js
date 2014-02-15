WW.ModestMapsController = function(map, isMobile) {
    this.map = map;
    this.game = null;
    this.isMobile = isMobile;
    //pass this to the site.js as the guycenter var
    this.offset = {
            x: (map.dimensions.x * 0.75) - 500 - 50,
            y: (map.dimensions.y * 0.3) + 100 + 60     
    };  

    this.registerForMapAnswers();
};

WW.ModestMapsController.prototype = {
    map: null,
    offset: null,

    registerForMapAnswers: function() {
        var self = this;
        if (this.isMobile) {
            $('body').bind('map-tap', function(event, pos) {
                var game = self.game;
                // alert('tap');
                if (!game || !game.question) {
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
                if (!game || !game.question) {
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
        var markersLayer = this.map.getLayerAt(1);
        var geoJSON = markersLayer.geojson();
        geoJSON.features.push(point);
        markersLayer.geojson(geoJSON);
    },

    reset: function() {
        this.map.zoom(5).center({ lat: 0, lon: 0 });
        this.offset = {
            x: (map.dimensions.x * 0.75) - 500 - 50,
            y: (map.dimensions.y * 0.3) + 100 + 60     
        };
    }
};
