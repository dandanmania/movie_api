/* eslint-disable no-undef */
const express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    uuid = require('uuid'),
    mongoose = require('mongoose'),
    Models = require('./models.js'),
    cors = require('cors');

const app = express();
const Genres = Models.Genre;
const Directors = Models.Director;
const Movies = Models.Movie;
const Users = Models.User;
const { check, validationResult } = require('express-validator');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//CORS
let allowedOrigins = ['http://localhost:8080', 'http://localhost:4200', 'http://testsite.com', 'http://localhost:1234', 'https://dandan-myflix.netlify.app', 'https://main--dandan-myflix.netlify.app', 'https://dandanmania.github.io'];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) { // If a specific origin isn't found on the list of alloweed origins
            let message = `The CORS policy for this application doesn't allow access from origin ` + origin;
            return callback(new Error(message), false);
        }
        return callback(null, true);
    }
}));

mongoose.connect( process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Importing Auth
let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

// Morgan
app.use(morgan('common'));

/**
 * GET: Welcome Message from '/' URL
 * @module Welcome
 * @returns {string} Welcome Message
 */
app.get('/', (req, res) => {
    res.send('TOP 10 ANIME MOVIES. NOT BY WATCHMOJO. Just a joke. Welcome to my API!');
});

/**
 * Get All movies
 * @module GETAllMovies
 * @returns {Array} All movie objects
*/
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.find().then(movies => res.json(movies))
    .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
    });
});

/**
 * Get Single movie object by Title
 * @module GETMovieByTitle
 * @param {string} title Movie Title
 * @returns {object} Movie Object
 */
app.get('/movies/:title', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne({ Title: req.params.title })
        .then((movie) => {
            if(!movie) {
                res.status(404).send(req.params.title + ' does not exist.');
            } else{
                res.json(movie)
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

/**
 * Get Single movie object by ID
 * @module GETMovieByID
 * @param {string} movieId Movie ID
 * @returns {object} Movie Object
 */
app.get('/movies/:movieId', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne({ _id: req.params.movieId })
        .then((movie) => {
            if(!movie) {
                res.status(404).send(req.params.movieId + ' does not exist/is not valid.');
            } else{
                res.json(movie)
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

/**
 * Get All Genres
 * @module GetAllGenres
 * @returns {Array} All genre objects
 */
app.get('/genre', passport.authenticate('jwt', { session: false }), (req, res) => {
    Genres.find()
        .then((genres) => res.json(genres))
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

/**
 * Get Genre object by Name
 * @module GetGenreByName
 * @param {string} genreName Genre's Name
 * @returns {object} Genre Object
 */
app.get('/genre/:genreName', passport.authenticate('jwt', { session: false }), (req, res) => {
    Genres.findOne({ Name: req.params.genreName })
        .then((genre) => {
            if(!genre) {
                res.status(404).send(req.params.genreName + ' does not exist.');
            } else {
                res.json(genre)
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

/**
 * Get All Directors
 * @module GetAllDirectors
 * @returns {Array} All director objects
 */
app.get('/directors', passport.authenticate('jwt', { session: false }), (req, res) => {
    Directors.find()
        .then((director) => res.json(director))
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

/**
 * Get Director object by Name
 * @module GetDirectorByName
 * @param {string} directorName Director's Name
 * @returns {object} Director Object
 */
app.get('/directors/:directorName', passport.authenticate('jwt', { session: false }), (req, res) => {
    Directors.findOne({ Name: req.params.directorName })
        .then((director) => {
            if(!director) {
                res.status(404).send(req.params.directorName + ' does not exist.');
            } else {
                res.json(director)
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// Documentation
app.get('/documentation', (req, res) => {
    res.sendFile('public/documentation.html', { root: __dirname });
});

// Get User by Username
/**
 * Get User object by Username
 * @module GetUser
 * @param {string} username Username
 * @returns {object} User Object
 */
app.get('/users/:username', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOne({ Username : req.params.username })
        .then((user) => {
            if(!user) {
                res.status(404).send(req.params.username + ' does not exist.');
            } else {
                res.json(user)
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// Create New Users
/**
 * Create/Register new users
 * @module RegisterUser
 * @returns {object} New User Object
 */
app.post('/users',
    [
        check('Username', 'Username is required').isLength({min: 5}),
        check('Username',  'Username contains non-alphanumeric characters - not allowed').isAlphanumeric(),
        check('Password', 'Password is required').not().isEmpty(),
        check('Email', 'Email does not appear to be valid').isEmail()
    ] ,(req, res) => {
    
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array () });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username })
        .then ((user) => {
            if (user) {
                return res.status(400).send(req.body.Username + ' already exists');
            } else {
                Users
                    .create({
                        Username: req.body.Username,
                        Password: hashedPassword,
                        Email: req.body.Email,
                        Birthday: req.body.Birthday
                    })
                    .then((user) => {res.status(201).json(user)})
                .catch((error) => {
                    console.error(error);
                    res.status(500).send('Error: ' + error);
                })
            }
        }).catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
})

/**
 * Update User Data
 * @module UpdateUser
 * @param {string} username Username
 * @returns {object} Updated User Object
 */
app.put('/users/:username', passport.authenticate('jwt', { session: false }),
    [
        check('Username', 'Username is required').isLength({min: 5}),
        check('Username', 'Username contains non-alphanumeric characters - not allowed').isAlphanumeric(),
        check('Password', 'Password is required').not().isEmpty(),
        check('Email', 'Email does not appear to be valid').isEmail()
    ],
    (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOneAndUpdate( { Username: req.params.username }, {
        $set:
            {
                Username: req.body.Username,
                Password: hashedPassword,
                Email: req.body.Email,
                Birthday: req.body.Birthday
            }
    },
    { new: true },
    (err, updatedUser) => {
        if(err) {
            console.error(err);
            res.status(500).send('Error: ' + err);
        } else if(!updatedUser) {
            res.status(404).send('User does not exist.')
        } else {
            res.json(updatedUser);
        }
    });
});

/**
 * Delete a User / Unregister
 * @module DeleteUser
 * @param {string} username Username
 * @returns {string} User Removed Success Message
 */
app.delete('/users/:username', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndRemove( { Username: req.params.username })
        .then((user) => {
            if(!user) {
                res.status(400).send(req.params.username + ' was not found.')
            } else {
                res.status(200).send(req.params.username + ' was deleted.');
        }})
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

/**
 * Add movie to User's Favorites List
 * @module AddFavorite
 * @param {string} username Username
 * @param {string} movieID Movie's ID
 * @returns {string} Favorite Added Success Message
 */
app.post('/users/:username/movies/:movieID', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndUpdate( { Username: req.params.username }, {
        $push: { FavoriteMovies: req.params.movieID }
        },
        { new: true },
        (err, updatedUser) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('Error: ' + err);
                } else if(!updatedUser) {
                    res.status(404).send('User not found');
                } else {
                    res.send(req.params.movieID + ' has been added to ' + req.params.username + '\'s Favorites.');
                }
        });
    }
);

/**
 * Remove/Delete movie from User's Favorites List
 * @module DeleteFavorite
 * @param {string} username Username
 * @param {string} movieID Movie's ID
 * @returns {string} Favorite Removed Success Message
 */
app.delete('/users/:username/movies/:movieID', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndUpdate( { Username: req.params.username }, {
        $pull: { FavoriteMovies: req.params.movieID }
        },
        { new: true },
        (err, updatedUser) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('Error: ' + err);
                } else if (!updatedUser) {
                    res.status(404).send('User not found.');
                } else {
                    res.send(req.params.movieID + ' has been deleted from ' + req.params.username + '\'s Favorites.');
                }
        });
    }
);

// Serve documentation file using express static
app.use(express.static('public'));

/**
 * Error-Handling Middleware
 */
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
    console.log('Listening on Port ' + port);
});