const express = require('express');
const router = express.Router();
const { getConstructionData } = require('../controllers/constructionController');

router.get('/', getConstructionData);
module.exports = router;