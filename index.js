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
//let allowedOrigins = ['http://localhost:8080'];
// app.use(cors({
//     origin: (origin, callback) => {
//         if(!origin) return callback(null, true);
//         if(allowedOrigins.indexOf(origin) === -1) {
//             let message = 'The CORS policy for this application doesn\'t allow access from origin ' + origin;
//             return callback(new Error(message), false);
//         }
//         return callback(null, true);
//     }
// }));

mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });

// Importing Auth
let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

let users = [
    {
        id: 1,
        name: 'Dan',
        favoriteMovies: []
    },
    {
        id: 2,
        name: 'Danny',
        favoriteMovies: ['PERSONA 3 THE MOVIE 4 - Winter of Rebirth']
    }
]

let movies = [
    {
        title: 'Kiki\'s Delivery Service',
        year: 1989,
        studio: 'Studio Ghibli',
        director: {
                name: 'Hayao Miyazaki',
                birth: 1941,
                death: 'N/A'
        },
        genre: {
            name: 'Adventure',
            description: 'The adventure genre consists of books or movies where the protagonist goes on an epic journey, either personally or geographically.'
        }
    },
    {
        title: 'Digimon: Our War Game!',
        year: 2000,
        studio: 'Toei Animation',
        director: {
            name: 'Mamoru Hosoda',
            birth: 1967,
            death: 'NA'
        },
        genre: {
            name: 'Adventure',
            description: 'The adventure genre consists of books or movies where the protagonist goes on an epic journey, either personally or geographically.'
        }
    },
    {
        title: 'Card Captor Sakura Movie 2: The Sealed Card',
        year: 2000,
        studio: 'Madhouse',
        director: {
            name: 'Morio Asaka',
            birth: 1967,
            death: 'NA'
        },
        genre: {
            name: 'Fantasy',
            description: 'A genre in which a plot cannot occur in the real world. The plot usually involves witchcraft or magic.'
        }
    },
    {
        title: 'Detective Conan Movie 06: The Phantom of Baker Street',
        year: 2002,
        studio: 'TMS Entertainment',
        director: {
            name: 'Kenji Kodama',
            birth: 1949,
            death: 'NA'
        },
        genre: {
            name: 'Mystery',
            description: 'A genre whose stories focus on a puzzling crime, situation, or circumstance that needs to be solved'
        }
    },
    {
        title: 'The Girl Who Leapt Through Time',
        year: 2006,
        studio: 'Madhouse',
        director: {
            name: 'Mamoru Hosoda',
            birth: 1967,
            death: 'NA'
        },
        genre: {
            name: 'Romance',
            description: 'A genre that consists of stories that involves a love or romantic relationship.'
        }
    },
    {
        title: 'The Disappearance of Haruhi Suzumiya',
        year: 2010,
        studio: 'Kyoto Animation',
        director: {
            name: 'Tatsuya Ishihara',
            birth: 1966,
            death: 'NA'
        },
        genre: {
            name: 'Supernatural',
            description: 'A genre of speculative fiction that exploits or is centered on supernatural themes'
        }
    },
    {
        title: 'PERSONA 3 THE MOVIE 4 - Winter of Rebirth',
        year: 2016,
        studio: 'A-1 Pictures',
        director: {
            name: 'Tomohisa Taguchi',
            birth: 'NA',
            death: 'NA'
        },
        genre: {
            name: 'Fantasy', 
            description: 'A genre in which a plot cannot occur in the real world. The plot usually involves witchcraft or magic.'
        }
    },
    {
        title: 'Digimon Adventure tri. 6: Bokura no Mirai',
        year: 2018,
        studio: 'Toei Animation',
        director: {
            name: 'Keitarou Motonaga',
            birth: 'NA',
            death: 'NA'
        },
        genre: {
            name: 'Adventure',
            description:'The adventure genre consists of books or movies where the protagonist goes on an epic journey, either personally or geographically.'
        }
    },
    {
        title: 'Fate/stay night Movie: Heaven\'s Feel - III. Spring Song',
        year: 2020,
        studio: 'ufotable',
        director: {
            name: 'Tomonori Sudou',
            birth: 1978,
            death: 'NA'
        },
        genre: {
            name: 'Supernatural',
            description: 'A genre of speculative fiction that exploits or is centered on supernatural themes'
        }
    },
    {
        title: 'Belle',
        year: 2021,
        studio: 'Studio Chizu',
        director: {
            name: 'Mamoru Hosoda',
            birth: 1967,
            death: 'NA'
        },
        genre: {
            name: 'Drama',
            description:'The drama genre is strongly based in a character, or characters, that are in conflict at a crucial moment in their lives'
        }
    }
];

// Morgan
app.use(morgan('common'));

// GET Requests
app.get('/', (req, res) => {
    res.send('TOP 10 ANIME MOVIES. NOT BY WATCHMOJO.');
});

// Get all Movies
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.find().then(movies => res.json(movies))
    .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
    });
    //res.status(200).json(movies);
});

// Find movie by Title
app.get('/movies/:title', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne({ Title: req.params.title })
        .then((movie) => {
            res.json(movie)
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
            res.json(genre)
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
            res.json(director)
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
        } else {
            res.json(updatedUser);
        }
    });
});

// Delete User
app.delete('/users/:username', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndRemove( { Username: req.params.username })
        .then((user) => {
            if (!user) {
                res.status(400).send(req.params.username + ' was not found.');
            } else {
                res.status(200).send(req.params.username + ' was deleted.');
            }
        })
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
    (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error: ' + err);
        } else {
            res.send(req.params.movieID + ' has been added to ' + req.params.username + '\'s Favorites.');
        }
    });
});

// Delete movie to Favorites
app.delete('/users/:username/movies/:movieID', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndUpdate( { Username: req.params.username }, {
        $pull: { FavoriteMovies: req.params.movieID }
    },
    { new: true },
    (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error: ' + err);
        } else {
            res.send(req.params.movieID + ' has been deleted from ' +  req.params.username + '\'s Favorites.');
        }
    });
});

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