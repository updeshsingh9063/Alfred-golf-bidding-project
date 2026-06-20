const Charity = require('../models/Charity.model');
const User = require('../models/User.model');

// ── GET /api/charities ────────────────────────────────────────────────────────
exports.getAllCharities = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      search,
      featured,
      sort = 'name',
    } = req.query;

    const query = { isActive: true };

    if (category) query.category = category;
    if (featured === 'true') query.isFeatured = true;

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const sortObj = {};
    if (search) {
      sortObj.score = { $meta: 'textScore' };
    } else if (sort === 'contributions') {
      sortObj.totalContributed = -1;
    } else if (sort === 'subscribers') {
      sortObj.totalSubscribers = -1;
    } else {
      sortObj.name = 1;
    }

    const [charities, total] = await Promise.all([
      Charity.find(query, search ? { score: { $meta: 'textScore' } } : {})
        .sort(sortObj)
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Charity.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: {
        charities,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// ── GET /api/charities/featured ───────────────────────────────────────────────
exports.getFeaturedCharity = async (req, res, next) => {
  try {
    const featured = await Charity.findOne({ isFeatured: true, isActive: true }).lean();
    res.json({ success: true, data: { charity: featured } });
  } catch (error) {
    next(error);
  }
};

// ── GET /api/charities/:slug ──────────────────────────────────────────────────
exports.getCharityBySlug = async (req, res, next) => {
  try {
    const charity = await Charity.findOne({ slug: req.params.slug, isActive: true }).lean();
    if (!charity) {
      return res.status(404).json({ success: false, message: 'Charity not found.' });
    }
    res.json({ success: true, data: { charity } });
  } catch (error) {
    next(error);
  }
};

// ── GET /api/charities/:id ────────────────────────────────────────────────────
exports.getCharityById = async (req, res, next) => {
  try {
    const charity = await Charity.findById(req.params.id).lean();
    if (!charity) {
      return res.status(404).json({ success: false, message: 'Charity not found.' });
    }
    res.json({ success: true, data: { charity } });
  } catch (error) {
    next(error);
  }
};

// ── GET /api/charities/categories ────────────────────────────────────────────
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Charity.distinct('category', { isActive: true });
    res.json({ success: true, data: { categories } });
  } catch (error) {
    next(error);
  }
};
