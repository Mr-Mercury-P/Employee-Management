const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { body, validationResult } = require('express-validator');

// Get all dependents
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM DEPENDENT');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get dependents for a specific employee
router.get('/employee/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM DEPENDENT WHERE Essn = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'No dependents found for this employee' });
        }
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add a new dependent
router.post('/', 
    [
        body('Dependent_name').isLength({ min: 2 }).withMessage('Dependent_name is required'),
        body('Essn').isInt().withMessage('Essn must be a valid employee SSN'),
        body('Sex').isIn(['M', 'F']).withMessage('Sex must be either M or F'),
        body('Relationship').isLength({ min: 2 }).withMessage('Relationship is required')
    ], 
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { Dependent_name, Essn, Sex, Bdate, Relationship } = req.body;
        try {
            await db.query('INSERT INTO DEPENDENT (Dependent_name, Essn, Sex, Bdate, Relationship) VALUES (?, ?, ?, ?, ?)', 
            [Dependent_name, Essn, Sex, Bdate, Relationship]);
            res.status(201).json({ message: 'Dependent added successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

// Delete a dependent
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query('DELETE FROM DEPENDENT WHERE Dependent_name = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Dependent not found' });
        }
        res.status(200).json({ message: 'Dependent deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
