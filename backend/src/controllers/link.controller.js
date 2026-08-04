import { linkService } from '../services/link.service.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const createShortLink = asyncHandler(async (req, res) => {
  const { url } = req.body || {};
  const link = await linkService.createLink(url);

  res.status(link.isExisting ? 200 : 201).json({
    success: true,
    data: link,
    message: link.isExisting
      ? 'Existing short link retrieved.'
      : 'Short URL created successfully.'
  });
});

export const getLinks = asyncHandler(async (req, res) => {
  const links = await linkService.getAllLinks();

  res.status(200).json({
    success: true,
    data: links,
    message: 'Links retrieved successfully.'
  });
});

export const redirectToDestination = asyncHandler(async (req, res) => {
  const { shortCode } = req.params;
  const originalUrl = await linkService.getAndTrackLink(shortCode);

  res.redirect(302, originalUrl);
});
