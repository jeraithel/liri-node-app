var moment = require('moment');
moment().format();

var Spotify = require('node-spotify-api');

require("dotenv").config();

var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);

var axios = require("axios");

var fs = require("fs");

var command = process.argv[2];
var variableString = process.argv;
variableString = variableString.splice(3);
// console.log(variableString);

function run() {
    switch (command) {
        case "concert-this":
            // console.log("concert")
            var artist = variableString.join("+");
            var urlString = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
            axios.get(urlString).then(
                function (response) {
                    for (let i = 0; i < response.data.length; i++) {
                        console.log("------ Event " + (i + 1) + " with " + variableString.join(" ") + " -----");
                        console.log("Venue Name: " + response.data[i].venue.name);
                        console.log("Location: " + response.data[i].venue.city);
                        var dates = moment(response.data[i].datetime).format("dddd, MMMM Do YYYY, h:mm:ss a");
                        console.log("Date: " + dates);
                    }
                }
            );
            break;
        case "spotify-this-song":
            console.log("song")
            var song = variableString.join("+");
            if (song) {
                spotifyPull(song);
            } else {
                song = "The Sign";
                spotifyPull(song);
            }
            break;
        case "movie-this":
            // console.log("movie");
            var movie = variableString.join("+");
            if (movie) {
                OMDB(movie);
            } else {
                movie = "Mr.+Nobody";
                OMDB(movie);
            }
            break;
        case "do-what-it-says":
            // console.log("do it")
            fs.readFile("random.text", "utf8", function (error, data) {
                if (error) {
                    return console.log(error);
                }
                var dataArr = data.split(",");
                variableString = dataArr[1].split(" ");
                // console.log (variableString);
                command = dataArr[0];
                run();
            });
    }
}

run();

function OMDB(movie) {
    axios.get("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy").then(
        function (response) {
            console.log("Title: " + response.data.Title);
            console.log("Year: " + response.data.Year);
            console.log("IMDB Rating: " + response.data.imdbRating);
            for (let i = 0; i < response.data.Ratings.length; i++) {
                if (response.data.Ratings[i].Source === "Rotten Tomatoes") {
                    console.log("Rotten Tomatoes Rating: " + response.data.Ratings[i].Value)
                }
            }
            console.log("Production Country: " + response.data.Country);
            console.log("Language: " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Actors: " + response.data.Actors);
        }
    );
}

function spotifyPull(song) {
    spotify.search({ type: 'track', query: song, limit: 1 }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log("Artist: " + data.tracks.items[0].album.artists[0].name);
        console.log("Song: " + data.tracks.items[0].name);
        console.log("Preview Link: " + data.tracks.items[0].external_urls.spotify);
        console.log("Album: " + data.tracks.items[0].album.name);
    });
}

