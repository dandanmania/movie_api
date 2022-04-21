/* eslint-disable no-undef */
const mongoose = require('mongoose');
let genreSchema = mongoose.Schema({
    Name: {type: String, required: true},
    Description: {type: String}
});

let directorSchema = mongoose.Schema({
    Name: {type: String, required: true},
    Birth: {type: String},
    Death: {type: String}
});

let movieSchema = mongoose.Schema({
    Title: {type: String, required: true},
    Description: {type: String, required: true},
    Genre: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Genre'}],
    Director: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Director' }]
});

let userSchema = mongoose.Schema({
    Username: {type: String, required: true},
    Password: {type: String, required: true},
    Email: {type: String, required: true},
    Birthday: Date,
    FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
});

let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);
let Genre = mongoose.model('Genre', genreSchema);
let Director = mongoose.model('Director', directorSchema);

module.exports.Genre = Genre;
module.exports.Director = Director;
module.exports.Movie = Movie;
module.exports.User = User;