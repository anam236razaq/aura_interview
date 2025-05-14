const express = require('express');
const router = express.Router();
const db = require('../config/db');
const checkRole = require('../middleware/roleMiddleware');

const ADMIN_ROLE = 1;

// POST /api/jobs - Create a new job posting (Admin only)
router.post('/', checkRole([ADMIN_ROLE]), async (req, res) => {
    const { title, description, location, salary_range, application_deadline } = req.body;
    const organization_id = req.user.organization_id;

    if (!title) {
        return res.status(400).json({ message: 'Job title is required.' });
    }

    try {
        const [result] = await db.query(
            'INSERT INTO jobs (organization_id, title, description, location, salary_range, application_deadline) VALUES (?, ?, ?, ?, ?, ?)',
            [organization_id, title, description, location, salary_range, application_deadline]
        );
        res.status(201).json({ 
            id: result.insertId, 
            organization_id, 
            title, 
            description, 
            location, 
            salary_range, 
            application_deadline 
        });
    } catch (error) {
        console.error('Error creating job:', error);
        res.status(500).json({ message: 'Error creating job posting.' });
    }
});

// GET /api/jobs - List all jobs for the organization (All authenticated users)
router.get('/', async (req, res) => {
    const organization_id = req.user.organization_id;
    try {
        const [jobs] = await db.query('SELECT * FROM jobs WHERE organization_id = ? ORDER BY created_at DESC', [organization_id]);
        res.json(jobs);
    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({ message: 'Error fetching job postings.' });
    }
});

// GET /api/jobs/:id - Get details for a specific job (All authenticated users)
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const organization_id = req.user.organization_id;
    try {
        const [jobs] = await db.query('SELECT * FROM jobs WHERE id = ? AND organization_id = ?', [id, organization_id]);
        if (jobs.length === 0) {
            return res.status(404).json({ message: 'Job not found or access denied.' });
        }
        res.json(jobs[0]);
    } catch (error) {
        console.error('Error fetching job:', error);
        res.status(500).json({ message: 'Error fetching job posting.' });
    }
});

// PUT /api/jobs/:id - Update a job posting (Admin only)
router.put('/:id', checkRole([ADMIN_ROLE]), async (req, res) => {
    const { id } = req.params;
    const organization_id = req.user.organization_id;
    const { title, description, location, salary_range, application_deadline } = req.body;

    // Basic check if any data is provided
    if (!title && !description && !location && !salary_range && application_deadline === undefined) {
        return res.status(400).json({ message: 'No update fields provided.' });
    }

    try {
        // Check ownership first
        const [existing] = await db.query('SELECT id FROM jobs WHERE id = ? AND organization_id = ?', [id, organization_id]);
        if (existing.length === 0) {
            return res.status(404).json({ message: 'Job not found or access denied.' });
        }

        // Build query dynamically
        let query = 'UPDATE jobs SET ';
        const params = [];
        if (title !== undefined) { query += 'title = ?, '; params.push(title); }
        if (description !== undefined) { query += 'description = ?, '; params.push(description); }
        if (location !== undefined) { query += 'location = ?, '; params.push(location); }
        if (salary_range !== undefined) { query += 'salary_range = ?, '; params.push(salary_range); }
        if (application_deadline !== undefined) { query += 'application_deadline = ?, '; params.push(application_deadline); }
        
        query = query.slice(0, -2); // Remove trailing comma and space
        query += ' WHERE id = ? AND organization_id = ?';
        params.push(id, organization_id);

        await db.query(query, params);

        // Fetch updated job
        const [updatedJobs] = await db.query('SELECT * FROM jobs WHERE id = ?', [id]);
        res.json(updatedJobs[0]);

    } catch (error) {
        console.error('Error updating job:', error);
        res.status(500).json({ message: 'Error updating job posting.' });
    }
});

// DELETE /api/jobs/:id - Delete a job posting (Admin only)
router.delete('/:id', checkRole([ADMIN_ROLE]), async (req, res) => {
    const { id } = req.params;
    const organization_id = req.user.organization_id;

    try {
        // TODO: Consider implications - what happens to CVs linked to this job_id?
        // Maybe prevent deletion if CVs are linked, or set job_id to NULL on linked CVs.
        const [result] = await db.query('DELETE FROM jobs WHERE id = ? AND organization_id = ?', [id, organization_id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Job not found or access denied.' });
        }

        res.status(204).send(); // No content
    } catch (error) {
        console.error('Error deleting job:', error);
        // Handle potential foreign key issues if CVs are linked and constraints exist
        res.status(500).json({ message: 'Error deleting job posting.' });
    }
});

module.exports = router;
