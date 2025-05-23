const express = require('express');
const router = express.Router();
const db = require('../config/db');
const multer = require('multer');
const fs = require('fs').promises; 
const path = require('path');


// --- Multer Configuration for logo Uploads ---
const logoUploadDir = path.join(__dirname, '../uploads/logo_temp');

// Ensure logo_temp directory exists
fs.mkdir(logoUploadDir, {recursive: true}).catch(console.error);

const logoStorage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, logoUploadDir);
    },
    filename: function(req, file, cb){
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'logo' + uniqueSuffix + path.extname(file.originalname));
    }
});

const logoFileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    if(allowedMimeTypes.includes(file.mimetype)){
        cb(null, true);
    }else{
        cb(new Error('Invalid file type. Only JPEG, PNG, GIF and WEBP are allowed.'), false)
    }
}

const uploadLogo = multer({storage: logoStorage, fileFilter: logoFileFilter, limits: { fileSize: 50 * 1024 * 1024 }})

// POST /api/companies
router.post('/', uploadLogo.single('logo'), async(req, res) => {
    const organization_id = req.user.organization_id;

    const {company_name, email, address, city, country, phone_number, title, state} = req.body
    const logoPath = req.file? `/uploads/logo_temp/${req.file.filename}` : null;

    if(!company_name || !email || !address || !city || !country || !state || !phone_number || !title || !logoPath){
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try{
        const [result] = await db.query(
            `INSERT INTO companies
            (organization_id, company_name, email, logo, address, city, country, phone_number, title, state)
            VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [organization_id, company_name, email, logoPath, address, city, country, phone_number, title, state]
        )

        res.status(201).json({ message: 'Company added successfully', company_id: result.insertId });
    }catch(error){
        console.error('Error adding company:', error);
        res.status(500).json({ message: 'Error adding company.' });
    }
})

// GET /api/companies - List all companies for the organization (All authenticated users)
router.get('/', async (req, res) => {
    const organization_id = req.user.organization_id;
    try {
        const [companies] = await db.query('SELECT * FROM companies WHERE organization_id = ? ORDER BY created_at DESC', [organization_id]);
        res.json(companies);
    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({ message: 'Error fetching company list.' });
    }
});

module.exports = router;
