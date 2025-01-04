const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { body, validationResult } = require('express-validator');

// Get all work assignments
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM WORKS_ON');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get work assignments for a specific employee
router.get('/employee/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM WORKS_ON WHERE Essn = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'No work assignments found for this employee' });
        }
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add a new work assignment
router.post('/', 
    [
        body('Essn').isInt().withMessage('Essn must be an integer'),
        body('Pno').isInt().withMessage('Pno must be a valid project number'),
        body('Hours').isDecimal().withMessage('Hours must be a valid number')
    ], 
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { Essn, Pno, Hours } = req.body;
        try {
            await db.query('INSERT INTO WORKS_ON (Essn, Pno, Hours) VALUES (?, ?, ?)', 
            [Essn, Pno, Hours]);
            res.status(201).json({ message: 'Work assignment added successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

// Update an existing work assignment
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { Hours } = req.body;
    try {
        const [result] = await db.query('UPDATE WORKS_ON SET Hours = ? WHERE Essn = ? AND Pno = ?', 
                                        [Hours, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Work assignment not found' });
        }
        res.status(200).json({ message: 'Work assignment updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a work assignment
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query('DELETE FROM WORKS_ON WHERE Essn = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Work assignment not found' });
        }
        res.status(200).json({ message: 'Work assignment deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
