WW.Carto = function(map, userName, datasetQuery) {
    this.map = map;
    this.userName = userName;
    this.datasetQuery = datasetQuery;
};

WW.Carto.prototype = {
    init: function() {
        // 2 Defining a carto.Client
        var client = new carto.Client({
            apiKey: '84fdbd587e4a942510270a48e843b4c1baa11e18',
            username: 'cartojs-test'
        });

        // Europe cities layer
        this.sql = new carto.source.SQL(this.datasetQuery);
        this.style = new carto.style.CartoCSS(`
           #layer {
             marker-width: 7;
             marker-fill: #FF583E;
             marker-fill-opacity: 0.9;
             marker-line-color: #FFFFFF;
             marker-line-width: 0.5;
             marker-line-opacity: 1;
             marker-type: ellipse;
             marker-allow-overlap: false;
           }`);
        this.layer = new carto.layer.Layer(this.sql, this.style);

        // 3.2 Adding the layers to the client
        client.addLayers([this.layer]);

        // 3.3. Adding the layers to the map
        client.getLeafletLayer().addTo(this.map);

        // 4 Creating a formula widgets
        // 4.1 Defining a formula dataviews
        var averagePopulation = new carto.dataview.Formula(this.sql, 'pop_max', {
            operation: carto.operation.AVG
        });
        var totalPopulation = new carto.dataview.Formula(this.sql, 'pop_max', {
            operation: carto.operation.SUM
        });

        // 4.2 Listening to data changes on the dataviews
        averagePopulation.on('dataChanged', function(newData) {
            refreshAveragePopulationWidget(newData.result);
        });
        totalPopulation.on('dataChanged', function(newData) {
            refreshTotalPopulationWidget(newData.result);
        });

        var refreshAveragePopulationWidget = function(avgPopulation) {
            console.log(avgPopulation);
            // var $widget = document.querySelector('#avgPopulationWidget');
            // var $averagePopulation = $widget.querySelector('.js-average-population');
            // $averagePopulation.innerText = Math.floor(avgPopulation);
        };

        var refreshTotalPopulationWidget = function(totalPopulation) {
            console.log(totalPopulation);
            // var $widget = document.querySelector('#totalPopulationWidget');
            // var $totalPopulation = $widget.querySelector('.js-total-population');
            // $totalPopulation.innerText = totalPopulation;
        };
    },
    start: function() {
        this.correctAnswers = [];
        this.badAnswers = [];
        var newSql = this.datasetQuery + ' and cartodb_id is null';
        this.sql.setQuery(newSql);
    },
    correctAnswer: function(question) {
        this.correctAnswers.push(question.id);
        var newSql = this.datasetQuery + ' and cartodb_id in (' + this.correctAnswers.join(',') + ')';
        this.sql.setQuery(newSql);
    },
    badAnswer: function(question) {
        this.badAnswers.push(question.id);
        console.log(question.id);
    }
}