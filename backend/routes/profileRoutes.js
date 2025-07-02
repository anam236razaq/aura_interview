const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises; 

// GET /api/profile - Get user profile the same organization
router.get('/', authMiddleware, async (req, res) => {
    const userId = req.user.id;
    const organization_id = req.user.organization_id;
    console.log(userId);
    console.log("organization_id", organization_id);

    try {
        const [userRows] = await db.query(`SELECT u.id,  u.email, u.first_name, u.last_name, u.role_id, u.status,
            r.name AS role_name, u.profile_image, u.organization_id, o.company_name AS organization_name, u.created_at
            FROM users u
            JOIN roles r ON u.role_id = r.id
            JOIN organizations o ON u.organization_id = o.id
            WHERE u.id = ? AND u.organization_id = ?`,
            [userId, organization_id]
        );

        if (userRows.length === 0) {
            return res.status(404).json({ message: 'User not found or access denied.' });
        }

        res.status(200).json(userRows[0]);
        console.log(userRows[0]);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// --- Multer Configuration for Updating profile image ---
const imgUploadDir = path.join(__dirname, '../uploads/profileImg_temp');

//Ensure Img directory exist
fs.mkdir(imgUploadDir, {recursive: true}).catch(console.error);

// Configure storage
const imgstorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, imgUploadDir);
  },
  filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'img-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const imgFileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    if(allowedMimeTypes.includes(file.mimetype)){
        cb(null, true);
    }else{
        cb(new Error('Invalid file type. Only JPEG, PNG, GIF and WEBP are allowed.'), false)
    }
}

const uploadImg = multer({ storage: imgstorage, fileFilter: imgFileFilter, limits: { fileSize: 200 * 1024 }});

//Middleware for Multer Image File Size
const multerImgUpload = (req, res, next) => {
  uploadImg.single('profile_image')(req, res, function(err) {
    if (err instanceof multer.MulterError){

      if(err.code === 'LIMIT_FILE_SIZE'){
        return res.status(413).json({message: 'File too large. Max allowed is 200KB.'})
      }

    }else if (err){
      return res.status(400).json({message: err.message})
    }
    next();
})
}

// PUT /api/profile - Update user profile
router.put('/', authMiddleware, multerImgUpload, async (req, res) => {
    const userId = req.user.id;
    const {first_name, last_name, email} = req.body;

    const serverBaseUrl = `${req.protocol}://${req.get('host')}`;
    const imgPath = req.file ? `/uploads/profileImg_temp/${req.file.filename}` : null;
    const profileImagePath = imgPath ? `${serverBaseUrl}${imgPath}` : null;
 
  try {
    const fields = [];
    const values = [];

    if (first_name) {
      fields.push('first_name = ?');
      values.push(first_name);
    }
    if (last_name) {
      fields.push('last_name = ?');
      values.push(last_name);
    }
    if (email) {
      fields.push('email = ?');
      values.push(email);
    }
    if (profileImagePath) {
      fields.push('profile_image = ?');
      values.push(profileImagePath);
    }

    if (fields.length === 0) {
      return res.status(400).json({ message: 'No fields to update.' });
    }

    values.push(userId);

    const updateQuery = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    await db.query(updateQuery, values);

    res.status(200).json({ message: 'Profile updated successfully.' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

module.exports = router;