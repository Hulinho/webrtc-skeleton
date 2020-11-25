const express = require('express');
const router = express.Router();
const siteController = require('../controllers/siteController');

router.get('/', siteController.index_get);
router.get('/:room', siteController.room_get);

module.exports = router;