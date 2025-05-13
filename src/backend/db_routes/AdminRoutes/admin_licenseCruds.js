import {Router} from "express";
import dotenv from "dotenv";
import pool from "../../config/db.js";

import { authenticateToken, requireAdmin } from "../../AuthenticateUsers/AuthMiddleware.js";

const router = Router();
dotenv.config();

//get lisenser er i metadata

//legge til lisenser
router.post('/', authenticateToken, requireAdmin, async (req, res) => {

});

//endre lisenser
router.put('/:licenseId', authenticateToken, requireAdmin, async (req, res) => {
    
});

//slette lisenser
router.delete('/licenseId', authenticateToken, requireAdmin, async (req, res) => {
    
});

export default router;