var inquirer = require("inquirer");
var keys = require("./keys.js");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var omdb = require("request");
var fs = require("fs");

inquirer.prompt([{
        type: "list",
        message: "Pick a Command:",
        choices: ["my-tweets", "spotify-this-song", "movie-this", "do-what-it-says"],
        name: "command"
    }])
    .then(function(response) {

        if (response.command === "my-tweets") {

            var client = new Twitter(keys);


            var params = {
                screen_name: 'StitchingDream',
                count: 20

            };

            client.get('statuses/user_timeline', params, function(error, tweets, response) {
                if (error) throw error;

                for (i = 0; i < tweets.length; i++) {
                    console.log(tweets[i].created_at); // The favorites. 
                    console.log(tweets[i].text);
                }
            });

        }


        if (response.command === "spotify-this-song") {

            spotify();

        }


        if (response.command === "movie-this") {

            inquirer.prompt([{
                    type: "input",
                    message: "Movie Name:",
                    name: "movie"
                }])
                .then(function(movieInput) {

                    var movieName = movieInput.movie;
                    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

                    omdb(queryUrl, function(error, response, body) {
                        console.log('error:', error); // Print the error if one occurred
                        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                        console.log("Release Year: " + JSON.parse(body).Year);
                        console.log("IMDBRating: " + JSON.parse(body).imdbRating);
                        console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
                        console.log("Country: " + JSON.parse(body).Country);
                        console.log("Language: " + JSON.parse(body).Language);
                        console.log("Plot: " + JSON.parse(body).Plot);
                        console.log("Actors: " + JSON.parse(body).Actors);

                    });
                });




        }


        if (response.command === "do-what-it-says") {
            fs.readFile("random.txt", "utf8", function(error, data) {

                // If the code experiences any errors it will log the error to the console.
                if (error) {
                    return console.log(error);
                }

                var dataArr = data.split(",");

                console.log(dataArr);

                if (dataArr[0] === "spotify-this-song") {
                    var songSearch = dataArr[1];
                    console.log(songSearch);

                    spotify = new Spotify({
                        id: "22fe8dfd76b4454b821c022b5673bb94",
                        secret: "a4d6594ce3164f74910270abbf882c0b"
                    });

                    spotify.search({ type: 'track', query: songSearch, limit: 1 }, function(err, data) {
                        if (err) {
                            return console.log('Error occurred: ' + err);
                        }
                        var info = data.tracks.items;

                        for (var j = 0; j < info.length; j++) {
                            console.log("Artist: " + JSON.stringify(info[j].album.artists[0].name, null, 2));
                            console.log("Song Album: " + JSON.stringify(info[j].album.name, null, 2));
                            console.log("Song Name: " + JSON.stringify(info[j].name, null, 2));
                            console.log("Preview: " + JSON.stringify(info[j].external_urls.spotify, null, 2));
                        }


                    });
                }

            });
        }

    });


function spotify() {
    inquirer.prompt([{
            type: "input",
            message: "Song:",
            name: "song"
        }])
        .then(function(songInput) {

            var songSearch = songInput.song;

            var spotify = new Spotify({
                id: "22fe8dfd76b4454b821c022b5673bb94",
                secret: "a4d6594ce3164f74910270abbf882c0b"
            });

            spotify.search({ type: 'track', query: songSearch, limit: 1 }, function(err, data) {
                if (err) {
                    return console.log('Error occurred: ' + err);
                }
                var info = data.tracks.items;

                for (var j = 0; j < info.length; j++) {
                    console.log("Artist: " + JSON.stringify(info[j].album.artists[0].name, null, 2));
                    console.log("Song Album: " + JSON.stringify(info[j].album.name, null, 2));
                    console.log("Song Name: " + JSON.stringify(info[j].name, null, 2));
                    console.log("Preview: " + JSON.stringify(info[j].external_urls.spotify, null, 2));
                }


            });
        });
}
