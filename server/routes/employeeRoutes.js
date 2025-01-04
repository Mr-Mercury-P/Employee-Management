const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { body, validationResult } = require('express-validator');

// Get all employees
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM EMPLOYEE');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get an employee by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM EMPLOYEE WHERE Ssn = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add a new employee with input validation
router.post('/', 
    [
        body('Ssn').isInt().withMessage('SSN must be a number'),
        body('Fname').isLength({ min: 2 }).withMessage('First name is required'),
        body('Lname').isLength({ min: 2 }).withMessage('Last name is required'),
        body('Salary').isDecimal().withMessage('Salary must be a valid number')
    ], 
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { Ssn, Fname, Minit, Lname, Bdate, Address, Sex, Salary, Super_ssn, Dno } = req.body;

        try {
            await db.query('INSERT INTO EMPLOYEE (Ssn, Fname, Minit, Lname, Bdate, Address, Sex, Salary, Super_ssn, Dno) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
            [Ssn, Fname, Minit, Lname, Bdate, Address, Sex, Salary, Super_ssn, Dno]);
            res.status(201).json({ message: 'Employee added successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

// Update an employee
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { Fname, Minit, Lname, Bdate, Address, Sex, Salary, Super_ssn, Dno } = req.body;
    try {
        const [result] = await db.query('UPDATE EMPLOYEE SET Fname = ?, Minit = ?, Lname = ?, Bdate = ?, Address = ?, Sex = ?, Salary = ?, Super_ssn = ?, Dno = ? WHERE Ssn = ?', 
                                        [Fname, Minit, Lname, Bdate, Address, Sex, Salary, Super_ssn, Dno, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json({ message: 'Employee updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete an employee
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query('DELETE FROM EMPLOYEE WHERE Ssn = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
