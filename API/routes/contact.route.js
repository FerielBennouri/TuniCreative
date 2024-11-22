// routes/contact.route.js

import express from 'express';
import { sendContactForm } from '../controllers/contact.controller.js';

const router = express.Router();

router.post('/contact', sendContactForm);

export default router;
