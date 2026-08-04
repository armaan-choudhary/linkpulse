import { nanoid } from 'nanoid';

export function requestIdMiddleware(req, res, next) {
  const existingId = req.headers['x-request-id'];
  const requestId = existingId ? String(existingId) : `req_${nanoid(12)}`;
  
  req.id = requestId;
  res.setHeader('X-Request-Id', requestId);
  next();
}
