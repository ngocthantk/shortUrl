var express = require('express');
var mongoose = require('mongoose');
var ShortUrl = require('./models/shortUrl');
var app = express();

mongoose.connect('mongodb://localhost/urlShortener',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});
app.set('view engine','ejs');
app.use(express.urlencoded({ extended: false }));

app.get('/', async (req,res) => {
    const shortUrls = await ShortUrl.find();

    res.render('index', {shortUrls: shortUrls});
});

app.post('/shortUrls', async (req, res) => {
    await ShortUrl.create({ full: req.body.fullUrl });
    res.redirect('/');
});

app.get('/:shortUrl', async (req, res) => {
    const shortUrl = await ShortUrl.findOne({short: req.params.shortUrl});
    shortUrl.clicks++;
    shortUrl.save();
    res.redirect(shortUrl.full);
});
app.listen(process.env.PORT || 8000);