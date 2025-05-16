const express = require('express');
const router = express.Router();
const db = require('../config/db'); 

router.get('/', async (req, res) => {

    const organization_id = req.user.organization_id;
    const selectedSkill = req.query.skills
      ? req.query.skills.split(',').map(skill => skill.trim().toLowerCase())
      : [];


    try {
      //Get all Skills
      const [rows] = await db.query(`
        SELECT DISTINCT cs.skill 
        FROM cvs_skills cs
        JOIN cvs c ON cs.cv_id = c.id WHERE c.organization_id = ?
      `, [organization_id]);

      // Flatten and normalize all skills
      let allSkills = rows.flatMap((row) => 
        row.skill.split(/[,\/&]+/)
        .map(s=>s.trim().toLowerCase())
      ).filter(skill => skill.length > 1);

      // Remove exact duplicates
      let uniqueSkills = Array.from(new Set(allSkills))
      
      // Remove skills that are extensions of already present base skills
      const finalSkills =[];
      for (const skill of uniqueSkills.sort((a, b) => a.length - b.length)) {
        if (!finalSkills.some(s => skill !== s && skill.includes(s))) {
          finalSkills.push(skill);
        }
      }

      //if a skill is selected, internally match candidates
      let matchedCandidates = [];
      if (selectedSkill.length > 0) {
          const likeClauses = selectedSkill.map(() => `LOWER(cs.skill) LIKE ?`).join(' OR ');
          const likeParams = selectedSkill.map(skill => `%${skill}%`);

          const query = `
              SELECT DISTINCT c.id AS candidateId,
              JSON_UNQUOTE(JSON_EXTRACT(c.personal_info, '$.email')) AS email
              FROM cvs_skills cs
              JOIN cvs c ON cs.cv_id = c.id
              WHERE c.organization_id = ?
              AND (${likeClauses})
              GROUP BY c.id
              HAVING COUNT(DISTINCT LOWER(cs.skill)) >= ?
            `;

            const params = [organization_id, ...likeParams, selectedSkill.length];
            [matchedCandidates] = await db.query(query, params);
        }

        res.json({
          skills: finalSkills.sort(),
          matchedCandidates: matchedCandidates.map(c => ({
            candidateId: c.candidateId,
            email: c.email
          }))
        });

        } catch (error) {
          console.error('Error fetching skills:', error);
          res.status(500).json({ message: 'Server error' });
        }
      });

module.exports = router