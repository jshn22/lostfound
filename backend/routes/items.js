const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const { cloudinary, enabled: cloudinaryEnabled } = require('../config/cloudinary');

const Item = require('../models/Item');
const auth = require('../middleware/authMiddleware');

// Multer setup: use memory storage so we can optionally upload to Cloudinary
const memoryStorage = multer.memoryStorage();
const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = './uploads/';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + '-' + file.originalname);
  }
});

// If cloudinary is enabled, accept files into memory to upload; otherwise store on disk
const upload = multer({ storage: cloudinaryEnabled ? memoryStorage : diskStorage });

// Create new item
const { body, validationResult } = require('express-validator');

router.post('/', auth, upload.single('image'),
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('status').isIn(['lost', 'found']).withMessage('Status must be "lost" or "found"'),
    body('location').trim().notEmpty().withMessage('Location is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { title, description, status, location, category } = req.body;

    try {
      const itemData = {
        title,
        description,
        status,
        location,
        category,
        postedBy: req.user._id,
      };

      if (req.file) {
        if (cloudinaryEnabled) {
          // Write buffer to disk then upload to Cloudinary (simple and reliable)
          const dir = './uploads/';
          if (!fs.existsSync(dir)) fs.mkdirSync(dir);
          const filename = Date.now() + '-' + Math.round(Math.random() * 1e9) + '-' + req.file.originalname;
          const filepath = dir + filename;
          fs.writeFileSync(filepath, req.file.buffer);
          const uploadRes = await cloudinary.uploader.upload(filepath);
          itemData.imageUrl = uploadRes.secure_url;
          itemData.cloudinaryPublicId = uploadRes.public_id;
          // remove temp file
          fs.unlinkSync(filepath);
        } else {
          itemData.imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        }
      }

      const item = new Item(itemData);
      await item.save();
      res.status(201).json(item);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Get all items with optional filters and pagination
router.get('/', async (req, res) => {
  const { status, location, category, q, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (location) filter.location = new RegExp(location, 'i');
  if (category) filter.category = category;
  if (q) filter.$or = [
    { title: new RegExp(q, 'i') },
    { description: new RegExp(q, 'i') },
    { location: new RegExp(q, 'i') }
  ];

  try {
    const skip = (Math.max(parseInt(page, 10), 1) - 1) * parseInt(limit, 10);
    const items = await Item.find(filter)
      .populate('postedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10));

    const total = await Item.countDocuments(filter);
    res.json({ total, page: parseInt(page, 10), limit: parseInt(limit, 10), items });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single item
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('postedBy', 'name email');
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete item - only owner
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (item.postedBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // remove remote image if present
    if (item.cloudinaryPublicId && cloudinaryEnabled) {
      try { await cloudinary.uploader.destroy(item.cloudinaryPublicId); } catch (e) { console.warn('Cloudinary destroy failed', e.message) }
    }

    await item.remove();
    res.json({ message: 'Item removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update item (optional)
router.put('/:id', auth, upload.single('image'),
  [
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
    body('status').optional().isIn(['lost', 'found']).withMessage('Status must be "lost" or "found"'),
    body('location').optional().trim().notEmpty().withMessage('Location cannot be empty')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (item.postedBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { title, description, status, location, category } = req.body;
    if (title) item.title = title;
    if (description) item.description = description;
    if (status) item.status = status;
    if (location) item.location = location;
    if (category) item.category = category;

    if (req.file) {
      if (cloudinaryEnabled) {
        const dir = './uploads/';
        if (!fs.existsSync(dir)) fs.mkdirSync(dir);
        const filename = Date.now() + '-' + Math.round(Math.random() * 1e9) + '-' + req.file.originalname;
        const filepath = dir + filename;
        fs.writeFileSync(filepath, req.file.buffer);
  const uploadRes = await cloudinary.uploader.upload(filepath);
  item.imageUrl = uploadRes.secure_url;
  item.cloudinaryPublicId = uploadRes.public_id;
        fs.unlinkSync(filepath);
      } else {
        item.imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
      }
    }

    await item.save();
    res.json(item);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
