const express = require('express'),
    morgan = require('morgan');

const app = express();

let topMovies = [
    {
        title: 'Kiki\'s Delivery Service',
        year: 1989,
        studio: 'Studio Ghibli',
        director: ['Hayao Miyazaki'],
        genre: ['Adventure', 'Comedy', 'Drama', 'Fantasy']
    },
    {
        title: 'Digimon: Our War Game!',
        year: 2000,
        studio: 'Toei Animation',
        director: ['Mamoru Hosoda'],
        genre: ['Adventure', 'Comedy', 'Sci-Fi']
    },
    {
        title: 'Card Captor Sakura Movie 2: The Sealed Card',
        year: 2000,
        studio: 'Madhouse',
        director: ['Morio Asaka'],
        genre: ['Comedy', 'Drama', 'Fantasy', 'Romance']
    },
    {
        title: 'Detective Conan Movie 06: The Phantom of Baker Street',
        year: 2002,
        studio: 'TMS Entertainment',
        director: ['Kenji Kodama'],
        genre: ['Adventure', 'Mystery']
    },
    {
        title: 'The Girl Who Leapt Through Time',
        year: 2006,
        studio: 'Madhouse',
        director: ['Mamoru Hosoda'],
        genre: ['Drama', 'Romance', 'Sci-Fi']
    },
    {
        title: 'The Disappearance of Haruhi Suzumiya',
        year: 2010,
        studio: 'Kyoto Animation',
        director: ['Tatsuya Ishihara', 'Yasuhiro Takemoto'],
        genre: ['Mystery', 'Romance', 'Sci-Fi', 'Supernatural']
    },
    {
        title: 'PERSONA 3 THE MOVIE - #4 Winter of Rebirth',
        year: 2016,
        studio: 'A-1 Pictures',
        director: ['Tomohisa Taguchi'],
        genre: ['Action', 'Fantasy', 'Supernatural']
    },
    {
        title: 'Digimon Adventure tri. 6: Bokura no Mirai',
        year: 2018,
        studio: 'Toei Animation',
        director: ['Keitarou Motonaga'],
        genre: ['Action', 'Adventure', 'Comedy', 'Drama']
    },
    {
        title: 'Fate/stay night Movie: Heaven\'s Feel - III. Spring Song',
        year: 2020,
        studio: 'ufotable',
        director: ['Tomonori Sudou'],
        genre: ['Action', 'Fantasy', 'Supernatural']
    },
    {
        title: 'Belle',
        year: 2021,
        studio: 'Studio Chizu',
        director: ['Mamoru Hosoda'],
        genre: ['Drama', 'Fantasy']
    }
];

// Morgan
app.use(morgan('common'));

// GET Requests
app.get('/', (req, res) => {
    res.send('TOP 10 ANIME MOVIES. NOT BY WATCHMOJO.');
});

app.get('/movies', (req, res) => {
    res.json(topMovies);
});

app.get('/movies/:title', (req, res) => {
    res.json(topMovies.find( (movie) => {
        return movie.title === req.params.title
    }));
})

app.get('/movies/:title/genre', (req, res) => {
    res.json(topMovies.find( (movie) => {
        return movie.title === req.params.title
    }).genre);
})

app.get('/movies/:director', (req, res) => {
})

app.get('/documentation', (req, res) => {
    res.sendFile('public/documentation.html', { root: __dirname });
});

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