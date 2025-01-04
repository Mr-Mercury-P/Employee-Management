const express = require('express');
const app = express();

// Import routes
const employeeRoutes = require('./routes/employeeRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const projectRoutes = require('./routes/projectRoutes');
const worksOnRoutes = require('./routes/worksOnRoutes');
const dependentRoutes = require('./routes/dependentRoutes');

// Middleware
app.use(express.json());

// Use routes
app.use('/api/employees', employeeRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/works-on', worksOnRoutes);
app.use('/api/dependents', dependentRoutes);

// Start server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
