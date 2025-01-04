const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { body, validationResult } = require('express-validator');

// Fetch all departments
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM DEPARTMENT');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get department by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM DEPARTMENT WHERE Dnumber = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Department not found' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add a new department with input validation
router.post('/', 
    [
        body('Dnumber').isInt().withMessage('Dnumber must be an integer'),
        body('Dname').isLength({ min: 2 }).withMessage('Dname is required'),
        body('Mgr_ssn').optional().isInt().withMessage('Mgr_ssn must be a number'),
        body('Mgr_start_date').optional().isDate().withMessage('Mgr_start_date must be a valid date')
    ], 
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { Dnumber, Dname, Mgr_ssn, Mgr_start_date } = req.body;

        try {
            await db.query('INSERT INTO DEPARTMENT (Dnumber, Dname, Mgr_ssn, Mgr_start_date) VALUES (?, ?, ?, ?)', 
            [Dnumber, Dname, Mgr_ssn, Mgr_start_date]);
            res.status(201).json({ message: 'Department added successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

// Update a department manager
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { Mgr_ssn, Mgr_start_date } = req.body;
    try {
        const [result] = await db.query('UPDATE DEPARTMENT SET Mgr_ssn = ?, Mgr_start_date = ? WHERE Dnumber = ?', 
                                        [Mgr_ssn, Mgr_start_date, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Department not found' });
        }
        res.status(200).json({ message: 'Department updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a department
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query('DELETE FROM DEPARTMENT WHERE Dnumber = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Department not found' });
        }
        res.status(200).json({ message: 'Department deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
