console.log("Start the music!");

var Twit = require('twit');
 
var config = require('./config.js');

var T = new Twit(config.twitter);


var music = require('musicmatch')(config.music);

//run the function again if string is empty 
var empty = "";
while (empty == ""){
    empty = getSnippet()
}

setInterval(getSnippet,60000)
function getSnippet(){
    //picks an artist from top 50 chart in US 
    music.chartArtists({page:1, page_size:50})
    .then(function(data){
        var randomize = Math.floor(Math.random()*data.message.body.artist_list.length);
        console.log(randomize)
        var artist = data.message.body.artist_list[randomize].artist.artist_name;
        console.log(artist)
    //searches for the tracks by that artist
    music.trackSearch({ 
        q: artist,
        f_has_lyrics:1, 
        page: 1, 
        page_size: 3 
    })
        //get track id
    .then(function (data) {
        var track_id = data.message.body.track_list[1].track.track_id
    //get tracj snippet
    music.trackSnippet({
        track_id:track_id
    })
        //post the snippet
    .then(function(data){
        //check for empty snippet
        if (data.message.body.snippet.snippet_body == ""){
           return ""
        }else{
        T.post('statuses/update', { status: "The artist is : "+ artist+ " \n\ " + "Guess the song by the lyric: \n\ " + '"'+ data.message.body.snippet.snippet_body + '"' }, function(err, data, response) {
        console.log("posted")
        return "success"
        })
        console.log(data.message.body.snippet.snippet_body);}
    }).catch(function(err){
        console.log(err);
    })
    }).catch(function (err) {
    console.log(err);
    })
            }).catch(function(err){
        console.log(err);
})
}

