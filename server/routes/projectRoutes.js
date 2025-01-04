const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { body, validationResult } = require('express-validator');

// Get all projects
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM PROJECT');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a project by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM PROJECT WHERE Pnumber = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add a new project
router.post('/', 
    [
        body('Pnumber').isInt().withMessage('Pnumber must be an integer'),
        body('Pname').isLength({ min: 2 }).withMessage('Pname is required'),
        body('Plocation').isLength({ min: 2 }).withMessage('Plocation is required'),
        body('Dnum').isInt().withMessage('Dnum must be a valid department number')
    ], 
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { Pnumber, Pname, Plocation, Dnum } = req.body;
        try {
            await db.query('INSERT INTO PROJECT (Pnumber, Pname, Plocation, Dnum) VALUES (?, ?, ?, ?)', 
            [Pnumber, Pname, Plocation, Dnum]);
            res.status(201).json({ message: 'Project added successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

// Update an existing project
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { Pname, Plocation, Dnum } = req.body;
    try {
        const [result] = await db.query('UPDATE PROJECT SET Pname = ?, Plocation = ?, Dnum = ? WHERE Pnumber = ?', 
                                        [Pname, Plocation, Dnum, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.status(200).json({ message: 'Project updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a project
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query('DELETE FROM PROJECT WHERE Pnumber = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
