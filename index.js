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
app.use(cors());

mongoose.connect( process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Importing Auth
let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

// Morgan
app.use(morgan('common'));

// GET Requests
app.get('/', (req, res) => {
    res.send('TOP 10 ANIME MOVIES. NOT BY WATCHMOJO. Just a joke. Welcome to my API!');
});

// Get all Movies
app.get('/movies', { session: false }), (req, res) => {
    Movies.find().then(movies => res.json(movies))
    .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
    });
});

// Find movie by Title
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

// Get Genre Data
app.get('/movies/genre/:genreName', passport.authenticate('jwt', { session: false }), (req, res) => {
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

// Get Director Data
app.get('/movies/directors/:directorName', passport.authenticate('jwt', { session: false }), (req, res) => {
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

// Create New Users
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

// Update User Data
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

// Delete User
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

// Add movie to Favorites
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

// Delete movie to Favorites
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

// Error-handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
    console.log('Listening on Port ' + port);
});