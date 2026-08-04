import { env } from '../config/env.js';

export function toLinkDto(linkDoc, baseUrl = env.publicBaseUrl) {
  return {
    id: linkDoc._id.toString(),
    shortCode: linkDoc.shortCode,
    shortUrl: `${baseUrl}/${linkDoc.shortCode}`,
    originalUrl: linkDoc.originalUrl,
    clickCount: linkDoc.clickCount,
    createdAt: linkDoc.createdAt ? linkDoc.createdAt.toISOString() : new Date().toISOString()
  };
}
