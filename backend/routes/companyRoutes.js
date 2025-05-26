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
        cb(null, 'logo-' + uniqueSuffix + path.extname(file.originalname));
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

    const {company_name, email, address, city, country, phone_number, title, state} = req.body;

    const serverBaseUrl = `${req.protocol}://${req.get('host')}`;
    const logoPath = req.file? `/uploads/logo_temp/${req.file.filename}` : null;
    const fullLogoUrl = logoPath ? `${serverBaseUrl}${logoPath}` : null;

    if(!company_name || !email || !address || !city || !country || !state || !phone_number || !title || !logoPath){
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try{
        const [result] = await db.query(
            `INSERT INTO companies
            (organization_id, company_name, email, logo, address, city, country, phone_number, title, state)
            VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [organization_id, company_name, email, fullLogoUrl, address, city, country, phone_number, title, state]
        )

        res.status(201).json({ message: 'Company added successfully', company_id: result.insertId, logo: fullLogoUrl });
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

// PUT /api/companies/:id - Update a company for the organization (All authenticated users)
router.put('/:id', uploadLogo.single('logo'),  async(req, res) => {
    const {id} = req.params;
    const organization_id = req.user.organization_id;

     const {company_name, email, address, city, country, phone_number, title, state} = req.body;

    const serverBaseUrl = `${req.protocol}://${req.get('host')}`;
    const logoPath = req.file? `/uploads/logo_temp/${req.file.filename}` : null;
    const fullLogoUrl = logoPath ? `${serverBaseUrl}${logoPath}` : null;

    try{
        const [rows] = await db.query(
        'SELECT * FROM companies WHERE id = ? AND organization_id = ?',
        [id, organization_id]
    )

    if(rows.length  === 0){
        return res.status(404).json({ message: 'Company not found' });
    }

    const [result] = await db.query(
        `UPDATE companies SET 
        company_name = ?, email = ?, logo = COALESCE(?, logo) , title = ?, address= ?, city= ?, state= ?, 
        country = ?, phone_number = ? WHERE id = ? AND organization_id = ?`,
        [company_name, email, fullLogoUrl, title, address, city, state, country, phone_number,
            id, organization_id
        ]
    )

    res.json({message: 'Company updated successfully', company_id: result.id});

    }catch(error){
        console.error('Error updating company:', error);
        res.status(500).json({ message: 'Error updating company.' });
    }

})

// DELETE /api/companies/:id - Delete a company for the organization (All authenticated users)
router.delete('/:id', async(req, res) => {
    const {id} = req.params;
    const organization_id = req.user.organization_id;

    try{
        const [rows] = await db.query(
        'DELETE FROM companies WHERE id = ? AND organization_id = ?',
        [id, organization_id]
    )

    if(rows.length  === 0){
        return res.status(404).json({ message: 'Company not found or not authorized to delete.' });
    }

    res.json({message: 'Company deleted Successfully'});

    }catch(error){
        console.error('Error deleting company:', error);
        res.status(500).json({ message: 'Error deleting company.' });
    }

})



module.exports = router;
