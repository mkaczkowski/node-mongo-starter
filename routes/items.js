const express = require('express');
const router = express.Router();
const { catchErrors } = require('../handlers/errorHandlers');
const itemsController = require('../controllers/itemController');

//TODO display how many times were bought
router.get('/top', catchErrors(itemsController.getTopItems));

router.get('/search', catchErrors(itemsController.searchItems));

router.get('/:id', catchErrors(itemsController.getItemById));

router.patch('/:id',
  catchErrors(itemsController.updateItem)
);

router.delete('/:id',
  catchErrors(itemsController.deleteItem)
);

router.get('/', catchErrors(itemsController.getItems));

TODO photo upload
router.post('/',
  catchErrors(itemsController.validateItem),
  itemsController.uploadPhoto,
  catchErrors(itemsController.resizePhoto),
  catchErrors(itemsController.createItem)
);

router.get('/tags/:tag', catchErrors(itemsController.getItemsByTag));

module.exports = router;
