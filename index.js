/* eslint-disable no-undef */
const express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    uuid = require('uuid');

const app = express();

app.use(bodyParser.json());

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

app.get('/movies', (req, res) => {
    res.status(200).json(movies);
});

app.get('/movies/:title', (req, res) => {
    const { title } = req.params;
    const movie = movies.find( movie => movie.title === title);
    
    if (movie) {
        res.status(200).json(movie);
    } else {
        res.status(400).send('No such movie is in this list')
    }
});

app.get('/movies/genre/:genreName', (req, res) => {
    const { genreName } = req.params;
    const genre = movies.find( movie => movie.genre.name === genreName).genre;

    if (genre) {
        res.status(200).json(genre);
    } else {
        res.status(400).send('No such genre in this list')
    }
})

app.get('/movies/directors/:directorName', (req, res) => {
    const { directorName } = req.params;
    const director = movies.find( movie => movie.director.name === directorName).director;

    if (director) {
        res.status(200).json(director);
    } else {
        res.status(400).send('No such director in this list')
    }
})

app.get('/documentation', (req, res) => {
    res.sendFile('public/documentation.html', { root: __dirname });
});


// Create New Users
app.post('/users', (req, res) => {
    const newUser = req.body;
    if (newUser.name) {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).json(newUser)
    } else {
        res.status(400).send('Users need names.')
    }
})

// Update User Data
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const updatedUser = req.body;

    let user = users.find( user => user.id == id);
    if (user) {
        user.name = updatedUser.name;
        res.status(200).json(user);
    } else {
        res.status(400).send('User not found.')
    }
})

// Delete User
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;

    let user = users.find( user => user.id == id);
    if (user) {
        users = users.filter( user => user.id != id );
        res.status(200).send(`User ${id} has been deleted.`);
    } else {
        res.status(400).send('User not found.')
    }
})

// Add movie to Favorites
app.post('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;

    let user = users.find( user => user.id == id);
    if (user) {
        user.favoriteMovies.push(movieTitle);
        res.status(200).send(`${movieTitle} has been added to user ${id}'s array`);
    } else {
        res.status(400).send('User not found.')
    }
})

// Delete movie to Favorites
app.delete('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;

    let user = users.find( user => user.id == id);
    if (user) {
        user.favoriteMovies = user.favoriteMovies.filter( title => title !== movieTitle );
        res.status(200).send(`${movieTitle} has been removed from user ${id}'s array`);
    } else {
        res.status(400).send('User not found.')
    }
})

// Serve documentation file using express static
app.use(express.static('public'));

// Error-handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(8080, () => {
    console.log('Your app is listening on port 8080');
});