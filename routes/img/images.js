const express = require('express');
const router = express.Router();

router.get('/1', function (req, res, next) {
    console.log(req.url.toString());
    res.sendFile('md.jpg', { root: './public/images/actors'}, function (err) {
        if (err) {
            next(err);
        }
    });
});

router.get('/2', function (req, res, next) {
    console.log(req.url.toString());
    res.sendFile('st.jpg', { root: './public/images/actors'}, function (err) {
        if (err) {
            next(err);
        }
    });
});

router.get('/3', function (req, res, next) {
    console.log(req.url.toString());
    res.sendFile('th.jpg', { root: './public/images/actors'}, function (err) {
        if (err) {
            next(err);
        }
    });
});

router.get('*', function (req, res, next) {
    console.log(req.url.toString());
    res.sendFile('nophoto.jpg', { root: './public/images/actors'}, function (err) {
        if (err) {
            next(err);
        }
    });
});

module.exports = router;