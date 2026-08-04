import { Link } from '../models/link.model.js';
import { generateShortCode } from '../utils/codeGenerator.js';
import { validateAndNormalizeUrl } from '../validators/urlValidator.js';
import { ApiError } from '../utils/ApiError.js';
import { env } from '../config/env.js';

export const linkService = {
  /**
   * Create a new short link (or return existing link for deduplication)
   */
  async createLink(url) {
    const normalizedUrl = validateAndNormalizeUrl(url);

    // URL Deduplication: If originalUrl already exists, return existing link
    const existing = await Link.findOne({ originalUrl: normalizedUrl });
    if (existing) {
      return {
        id: existing._id.toString(),
        originalUrl: existing.originalUrl,
        shortCode: existing.shortCode,
        shortUrl: `${env.BASE_URL}/${existing.shortCode}`,
        clickCount: existing.clickCount,
        createdAt: existing.createdAt,
        isExisting: true
      };
    }

    // Generate unique short code with collision handling
    let shortCode = generateShortCode();
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 5) {
      const found = await Link.findOne({ shortCode });
      if (!found) {
        isUnique = true;
      } else {
        shortCode = generateShortCode();
        attempts++;
      }
    }

    if (!isUnique) {
      throw new ApiError(500, 'Failed to generate a unique short code.', 'CODE_GENERATION_FAILED');
    }

    const link = await Link.create({
      originalUrl: normalizedUrl,
      shortCode,
      clickCount: 0
    });

    return {
      id: link._id.toString(),
      originalUrl: link.originalUrl,
      shortCode: link.shortCode,
      shortUrl: `${env.BASE_URL}/${link.shortCode}`,
      clickCount: link.clickCount,
      createdAt: link.createdAt,
      isExisting: false
    };
  },

  /**
   * Get all links in newest-first order
   */
  async getAllLinks() {
    const links = await Link.find().sort({ createdAt: -1 });

    return links.map((link) => ({
      id: link._id.toString(),
      originalUrl: link.originalUrl,
      shortCode: link.shortCode,
      shortUrl: `${env.BASE_URL}/${link.shortCode}`,
      clickCount: link.clickCount,
      createdAt: link.createdAt
    }));
  },

  /**
   * Get destination URL by short code and atomically increment click count
   */
  async getAndTrackLink(shortCode) {
    const link = await Link.findOneAndUpdate(
      { shortCode },
      { $inc: { clickCount: 1 } },
      { new: true }
    );

    if (!link) {
      throw new ApiError(404, 'Short link not found or has expired.', 'NOT_FOUND');
    }

    return link.originalUrl;
  }
};
