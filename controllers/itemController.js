const mongoose = require('mongoose');
const multer = require('multer'); //multi-part handles
const jimp = require('jimp'); //image reisze
const uuid = require('uuid');
const Item = mongoose.model('Item');

exports.getItems = async (req, res) => {
  const items = await Item.find();
  res.json(items);
};

exports.getItemById = async (req, res) => {
  const item = await Item.findOne({ _id: req.params.id });
  res.json(item);
};

exports.createItem = async (req, res) => {
  const item = new Item(req.body);
  const addedItem = await item.save();
  res.json(addedItem);
};

exports.updateItem = async (req, res) => {
  const item = await Item.findByIdAndUpdate(req.params.id, req.body, {
    new: true, // return the new item instead of the old one
    runValidators: true,
  }).exec();
  res.json(item);
};

exports.deleteItem = async (req, res) => {
  const item = await Item.findByIdAndRemove(req.params.id);
  res.send(item ? 200 : 404);
};

exports.getItemsByTag = async (req, res) => {
  const tag = req.params.tag;
  const tagQuery = tag || { $exists: true, $ne: [] };
  const tagsPromise = Item.getTagsList();
  const itemsPromise = Item.find({ tags: tagQuery });
  const [tags, items] = await Promise.all([tagsPromise, itemsPromise]);
  res.json([tags, items]);
};

exports.searchItems = async (req, res) => {
  const items = await Item.find(
    {
      $text: {
        $search: req.query.q, //use text indexes
      },
    },
    { score: { $meta: 'textScore' }, }
  )
    .sort({ score: { $meta: 'textScore' }, })
    .limit(5);
  res.json(items);
};

exports.getTopItems = async (req, res) => {
  const items = await Item.getTopItems();
  res.json(items);
};

/*
  Validation
*/
//TODO make it work
exports.validateItem = async (req, res, next) => {
  req.sanitizeBody('name');
  req.checkBody('name', 'You must supply a name!').notEmpty();
  const validationResult = await req.getValidationResult();
  const errors = validationResult.array();
  if (errors && errors.length > 0) {
    next(errors);
    return;
  }
  next();
};

/*
  Middlewares
*/
const upload = multer({
  // dest: "uploads/"
  // limits
  storage: multer.memoryStorage(),
  fileFilter: function(req, file, next) {
    const isPhoto = file.mimetype.startsWith('image/');
    if (isPhoto) {
      next(null, true);
    } else {
      next({ message: "That filetype isn't allowed" }, false);
    }
  },
});

exports.uploadPhoto = upload.single('photo');

exports.resizePhoto = async (req, res, next) => {
  if (!req || !req.file) {
    next();
    return;
  }
  const extension = req.file.mimetype.split('/')[1];
  req.body.photo = `${uuid.v4()}.${extension}`;
  const photo = await jimp.read(req.file.buffer);
  await photo.resize(800, jimp.AUTO);
  await photo.write(`./public/uploads/${req.body.photo}`);
  next();
};
