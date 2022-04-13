const express = require('express'),
    morgan = require('morgan');

const app = express();

let topMovies = [
    {
        title: 'Kiki\'s Delivery Service',
        year: 1989
    },
    {
        title: 'Digimon: Our War Game!',
        year: 2000
    },
    {
        title: 'Card Captor Sakura Movie 2: The Sealed Card',
        year: 2000
    },
    {
        title: 'Detective Conan Movie 06: The Phantom of Baker Street',
        year: 2002
    },
    {
        title: 'The Girl Who Leapt Through Time',
        year: 2006
    },
    {
        title: 'The Disappearance of Haruhi Suzumiya',
        year: 2010  
    },
    {
        title: 'PERSONA 3 THE MOVIE - #4 Winter of Rebirth',
        year: 2016
    },
    {
        title: 'Digimon Adventure tri. 6: Bokura no Mirai',
        year: 2018
    },
    {
        title: 'Fate/stay night Movie: Heaven\'s Feel - III. Spring Song',
        year: 2020
    },
    {
        title: 'Belle',
        year: 2021
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