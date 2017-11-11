import { Router } from 'express';
import * as monitor from 'express-status-monitor';

const router = Router();
router.use(monitor());
router.get('/status', monitor().pageRoute);

export default router;
