CREATE DATABASE BIGMOM;

use BIGMOM;


SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE DEPARTMENT (
    Dnumber INT PRIMARY KEY,
    Dname VARCHAR(50),
    Mgr_ssn INT,
    Mgr_start_date DATE,
    FOREIGN KEY (Mgr_ssn) REFERENCES EMPLOYEE(Ssn) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE EMPLOYEE (
    Ssn INT PRIMARY KEY,
    Fname VARCHAR(50),
    Minit CHAR(1),
    Lname VARCHAR(50),
    Bdate DATE,
    Address VARCHAR(100),
    Sex CHAR(1),
    Salary DECIMAL(10, 2),
    Super_ssn INT,
    Dno INT,
    FOREIGN KEY (Super_ssn) REFERENCES EMPLOYEE(Ssn) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (Dno) REFERENCES DEPARTMENT(Dnumber) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE DEPT_LOCATIONS (
    Dnumber INT,
    Dlocation VARCHAR(100),
    PRIMARY KEY (Dnumber, Dlocation),
    FOREIGN KEY (Dnumber) REFERENCES DEPARTMENT(Dnumber) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE PROJECT (
    Pnumber INT PRIMARY KEY,
    Pname VARCHAR(50),
    Plocation VARCHAR(100),
    Dnum INT,
    FOREIGN KEY (Dnum) REFERENCES DEPARTMENT(Dnumber) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE WORKS_ON (
    Essn INT,
    Pno INT,
    Hours DECIMAL(5, 2),
    PRIMARY KEY (Essn, Pno),
    FOREIGN KEY (Essn) REFERENCES EMPLOYEE(Ssn) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (Pno) REFERENCES PROJECT(Pnumber) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE DEPENDENT (
    Dependent_name VARCHAR(50),
    Essn INT,
    Sex CHAR(1),
    Bdate DATE,
    Relationship VARCHAR(50),
    PRIMARY KEY (Dependent_name, Essn),
    FOREIGN KEY (Essn) REFERENCES EMPLOYEE(Ssn) ON DELETE CASCADE ON UPDATE CASCADE
);

SET FOREIGN_KEY_CHECKS = 1;


SHOW TABLES;


-- Insert departments first
INSERT INTO DEPARTMENT (Dnumber, Dname, Mgr_ssn, Mgr_start_date)
VALUES 
(1, 'HR', NULL, NULL),
(2, 'IT', NULL, NULL),
(3, 'Finance', NULL, NULL);

-- Insert employees after departments
INSERT INTO EMPLOYEE (Ssn, Fname, Minit, Lname, Bdate, Address, Sex, Salary, Super_ssn, Dno)
VALUES 
(555666777, 'Alice', 'C', 'Johnson', '1992-11-05', '789 Pine St', 'F', 55000.00, 987654321, 1),
(123456789, 'John', 'A', 'Doe', '1990-05-12', '123 Elm St', 'M', 60000.00, NULL, 1),
(987654321, 'Jane', 'B', 'Smith', '1985-09-25', '456 Oak St', 'F', 75000.00, 123456789, 2);

INSERT INTO DEPT_LOCATIONS (Dnumber, Dlocation)
VALUES 
(1, 'New York'),
(2, 'San Francisco'),
(3, 'Los Angeles');

INSERT INTO PROJECT (Pnumber, Pname, Plocation, Dnum)
VALUES 
(101, 'Project Alpha', 'New York', 1),
(102, 'Project Beta', 'San Francisco', 2),
(103, 'Project Gamma', 'Los Angeles', 3);


INSERT INTO WORKS_ON (Essn, Pno, Hours)
VALUES 
(123456789, 101, 20.5),
(987654321, 102, 15.0),
(555666777, 103, 25.0);

INSERT INTO DEPENDENT (Dependent_name, Essn, Sex, Bdate, Relationship)
VALUES 
('Michael', 123456789, 'M', '2015-08-20', 'Son'),
('Emma', 987654321, 'F', '2017-03-10', 'Daughter'),
('Tom', 555666777, 'M', '2020-06-30', 'Son');

SELECT * FROM DEPARTMENT;


SELECT * FROM EMPLOYEE;

SELECT * FROM PROJECT;


SELECT e.Fname, p.Pname, w.Hours
FROM WORKS_ON w
JOIN EMPLOYEE e ON w.Essn = e.Ssn
JOIN PROJECT p ON w.Pno = p.Pnumber;



-- Update HR department with manager details
UPDATE DEPARTMENT
SET Mgr_ssn = 123456789, Mgr_start_date = '2023-01-15'
WHERE Dnumber = 1;

-- Update IT department with manager details
UPDATE DEPARTMENT
SET Mgr_ssn = 987654321, Mgr_start_date = '2023-02-01'
WHERE Dnumber = 2;

-- For Finance, you can either keep it NULL or assign a manager from the employees.
-- Let's leave it NULL for now as no manager is provided for Finance.





-- Update supervisor for Alice (Ssn: 555666777)
UPDATE EMPLOYEE
SET Super_ssn = 123456789
WHERE Ssn = 555666777;

-- Set department number for employees (Alice and John are in HR, Jane is in IT)
UPDATE EMPLOYEE
SET Dno = 1
WHERE Ssn = 555666777;

UPDATE EMPLOYEE
SET Dno = 1
WHERE Ssn = 123456789;

UPDATE EMPLOYEE
SET Dno = 2
WHERE Ssn = 987654321;





-- Update the department number for each project (which already seems correct)
UPDATE PROJECT
SET Dnum = 1
WHERE Pnumber = 101;

UPDATE PROJECT
SET Dnum = 2
WHERE Pnumber = 102;

UPDATE PROJECT
SET Dnum = 3
WHERE Pnumber = 103;

