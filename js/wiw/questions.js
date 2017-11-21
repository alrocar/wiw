//game model
WW.Questions = function(dataset) {
    this.dataset = dataset;
    dataset.getData((data, error) => {
        if (data) {
            this.geoJSON = data;
            this._buildData();
        } else {
            alert(error);
        }
    });
}

WW.Questions.prototype = {

    geoJSON: null,

    data: null,

    //number of questions per block
    qBlock: 10,

    //selected questions per block. When sBlock questions are correct (or the qBlock array is over) pass to the next block.
    sBlock: 3,

    //current question correct answered in block, this should be a number between 0 and sBlock
    cBlock: 0,

    //current index in the questions block. Use this index to splice the array once the question is correctly answered
    iBlock: -1,

    //the current block of questions
    block: null,

    _buildData: function() {
        var datos = this.geoJSON;
        var props;
        var feat;
        var cities = [];
        for (var i = 0, len = datos.features.length; i < len; i++) {
            var city = {};
            feat = datos.features[i];
            props = feat.properties;
            city = new WW.Question(feat.geometry.coordinates[0], feat.geometry.coordinates[1], props["name"], props["val"], props["cartodb_id"]);
            cities.push(city);
        }

        this.data = cities.sort(function(a, b) {
            return b.p - a.p;
        });
    },

    nextQuestion: function() {
        var cities = this.data;

        if (this.cBlock == 0 || this.cBlock == this.sBlock || this.block.length < this.sBlock) {
            //first question in the block, sBlock correct answers or no more questions in the block (xq es burreras)
            //then get a new block of questions
            this.block = cities.splice(0, Math.min(10, cities.length - 1));
        }

        this.iBlock = WW.randomFromTo(0, this.block.length - 1);
        var question = this.block[this.iBlock];
        // console.log("City " + this.iBlock + ": " + JSON.stringify(question));

        return question;

        //only when the question is correct the index is removed from the array
        // c1.splice(index, 1);
    },

    timeForNextQuestion: function() {

    },

    getElapsedTime: function() {

    },

    getRemainingTime: function() {

    },

    calcScore: function() {

    },

    reset: function() {
        this.qBlock = 10;
        this.sBlock = 5;
        this.cBlock = 0;
        this.iBlock = -1;
        this.block = null;
        this._buildData();
    },

    isAnswerCorrect: function(answer, isMobile) {
        //implement the logic
        var offset = 50;
        if (isMobile) {
            offset = 100;
        }
        if (answer && answer.distance < offset) {
            //correct answer counter increase
            this.cBlock++;
            // console.log("ANSWER CORRECT");
            //remove the correct answered question form the current block
            this.block.splice(this.iBlock, 1);
            return true;
        } else {
            // console.log("answer incorrect");
            this.block.splice(this.iBlock, 1);
            return false;
        }


    }
}





//[1,34,56,76,9,67,5].randomItem();
// var fs = require('fs');

// fs.readFile('world02.json', function(err,data){
//   if(err) {
//     console.error("Could not open file: %s", err);
//     process.exit(1);
//   }

//   var datos = JSON.parse((data.toString('ascii')));
//   var props;
//   var feat;
//   var cities = [];
//   for (var i = 0, len = datos.features.length; i < len; i++) {
//  var city = {};
//  feat = datos.features[i];
//  props = feat.properties;
//  city["c"] = props["CAPITAL"];
//  city["p"] = props["CAP_POP"];
//  city["lon"] = feat.geometry.coordinates[0];
//  city["lat"] = feat.geometry.coordinates[1];
//  cities.push(city);
//   }

//   cities = cities.sort(function(a, b) {
//    return b.p - a.p;
//  });

//   var fs = require('fs');
//   fs.writeFile("cities2.json", JSON.stringify(cities), function(err) {
//     if(err) {
//         console.log(err);
//     } else {
//         console.log("The file was saved!");
//     }
//   });
//   console.log(cities);
//   console.log("Total cities: " + datos.features.length);
//   var c1 = cities.splice(0, 10);
//   var count = 0;
//   for (var j = 0, l = cities.length/10; j< l; j++) {
//     c1 = cities.splice(0, Math.min(10, cities.length - 1));
//     for (var i = 0; i<(Math.min(5, c1.length -1)); i++) {
//       count++;
//       var index = randomFromTo(0, c1.length - 1);
//       index = randomFromTo(0, c1.length - 1);
//       console.log(count + ". City " + index + ": " + JSON.stringify(c1[index]));
//       c1.splice(index, 1);
//     }
//   }
//   return cities;
// });