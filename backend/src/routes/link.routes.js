import { Router } from 'express';
import { createShortLink, getLinks } from '../controllers/link.controller.js';

const router = Router();

router.route('/')
  .post(createShortLink)
  .get(getLinks);

export default router;
