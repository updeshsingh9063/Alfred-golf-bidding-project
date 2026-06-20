const Winner = require('../models/Winner.model');
const User = require('../models/User.model');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

// ── Multer config for proof uploads ──────────────────────────────────────────
const uploadDir = path.join(__dirname, '..', '..', '..', 'uploads', 'proof');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `proof-${uuidv4()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ['.jpg', '.jpeg', '.png', '.pdf', '.webp'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPG, PNG, WEBP) and PDFs are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880') },
});

// ── GET /api/winners ──────────────────────────────────────────────────────────
// Public: recent paid/verified winners for homepage
exports.getPublicWinners = async (req, res, next) => {
  try {
    const winners = await Winner.find({ status: { $in: ['paid', 'approved'] } })
      .select('userName drawName drawDate tier prize status')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    res.json({ success: true, data: { winners } });
  } catch (error) {
    next(error);
  }
};

// ── GET /api/winners/my ───────────────────────────────────────────────────────
// Subscriber: their own winner records
exports.getMyWinnings = async (req, res, next) => {
  try {
    const winnings = await Winner.find({ userId: req.user._id })
      .populate('drawId', 'name scheduledDate winningNumbers month year')
      .sort({ createdAt: -1 })
      .lean();

    const totalWon = winnings
      .filter((w) => w.status === 'paid')
      .reduce((sum, w) => sum + w.prize, 0);

    res.json({ success: true, data: { winnings, totalWon } });
  } catch (error) {
    next(error);
  }
};

// ── POST /api/winners/:id/upload-proof ────────────────────────────────────────
exports.uploadProofMiddleware = upload.single('proof');

exports.uploadProof = async (req, res, next) => {
  try {
    const winner = await Winner.findOne({ _id: req.params.id, userId: req.user._id });
    if (!winner) {
      return res.status(404).json({ success: false, message: 'Winner record not found.' });
    }

    if (winner.status === 'paid') {
      return res.status(400).json({ success: false, message: 'Prize has already been paid.' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a proof file.' });
    }

    const proofUrl = `/uploads/proof/${req.file.filename}`;
    winner.proofUrl = proofUrl;
    winner.proofSubmittedAt = new Date();
    winner.status = 'proof_submitted';
    await winner.save();

    res.json({
      success: true,
      message: 'Proof uploaded successfully. Our team will review within 2-3 business days.',
      data: { winner },
    });
  } catch (error) {
    next(error);
  }
};
