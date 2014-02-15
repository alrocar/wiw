WW.ModestMapsController = function(map) {
    this.map = map;
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
