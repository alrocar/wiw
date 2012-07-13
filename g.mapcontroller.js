WW.ModestMapsController = function(map) {
    this.map = map;
    //pass this to the site.js as the guycenter var
    this.offset = {
            x: (map.dimensions.x * 0.75) - 500 - 20,
            y: (map.dimensions.y * 0.3) + 100 + 30     
    };  

    this.registerForMapAnswers();
};

WW.ModestMapsController.prototype = {
    map: null,
    offset: null,

    registerForMapAnswers: function() {
        this.map.addCallback('drawn', _.throttle(function() {
            var destinationPixel = map.locationPoint(new MM.Location(game.question.lat, game.question.lon));
            var distance = MM.Point.distance(game.mapController.offset, destinationPixel);
            console.log(distance);
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
    }
};
