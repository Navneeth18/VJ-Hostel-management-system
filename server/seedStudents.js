const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const Student = require('./models/StudentModel');
const Admin = require('./models/AdminModel');

const mongoURI = process.env.DBURL || 'mongodb://localhost:27017/hostel-management';

const studentsData = [
  {
    name: 'Donthi Navneeth Reddy',
    rollNumber: '23071A6685',
    branch: 'CSE-AIML',
    year: 3,
    phoneNumber: '9392706880',
    email: '23071a6685@vnrvjiet.in',
    parentMobileNumber: '9966463032',
    roomNumber: '301',
    password: '1234',
    is_active: true
  },
  {
    name: 'Karanam Rahul',
    rollNumber: '23071A0501',
    branch: 'CSE',
    year: 3,
    phoneNumber: '9876543210',
    email: '23071a0501@vnrvjiet.in',
    parentMobileNumber: '9876543211',
    roomNumber: '302',
    password: '1234',
    is_active: true
  },
  {
    name: 'Venkata Sai Kumar',
    rollNumber: '24071A1205',
    branch: 'IT',
    year: 2,
    phoneNumber: '9123456789',
    email: '24071a1205@vnrvjiet.in',
    parentMobileNumber: '9123456780',
    roomNumber: '1001',
    password: '1234',
    is_active: true
  },
  {
    name: 'Anirudh Sharma',
    rollNumber: '22071A0412',
    branch: 'ECE',
    year: 4,
    phoneNumber: '9988776655',
    email: '22071a0412@vnrvjiet.in',
    parentMobileNumber: '9988776644',
    roomNumber: '601',
    password: '1234',
    is_active: true
  },
  {
    name: 'Siddharth Rao',
    rollNumber: '25071A6708',
    branch: 'AIDS',
    year: 1,
    phoneNumber: '9765432109',
    email: '25071a6708@vnrvjiet.in',
    parentMobileNumber: '9765432100',
    roomNumber: '101',
    password: '1234',
    is_active: true
  }
];

async function seedData() {
  try {
    console.log('Connecting to MongoDB at:', mongoURI);
    await mongoose.connect(mongoURI);
    console.log('Successfully connected to MongoDB.');

    // Drop stale index username_1 from students collection if present
    try {
      await mongoose.connection.collection('students').dropIndex('username_1');
      console.log('Dropped stale index username_1 from students collection');
    } catch (idxErr) {
      // Index might not exist, ignore
    }

    for (const studentData of studentsData) {
      let student = await Student.findOne({ rollNumber: studentData.rollNumber });

      if (student) {
        student.name = studentData.name;
        student.branch = studentData.branch;
        student.year = studentData.year;
        student.phoneNumber = studentData.phoneNumber;
        student.email = studentData.email;
        student.parentMobileNumber = studentData.parentMobileNumber;
        student.roomNumber = studentData.roomNumber;
        student.password = studentData.password; // Mongoose pre('save') hook will hash this once
        student.is_active = studentData.is_active;
        await student.save();
        console.log(`Updated student: ${student.name} (${student.rollNumber})`);
      } else {
        student = new Student(studentData);
        await student.save();
        console.log(`Created student: ${student.name} (${student.rollNumber})`);
      }
    }

    // Reset/ensure test admin account with plain text password so Mongoose pre('save') hashes it ONCE
    let admin = await Admin.findOne({ username: 'admin' });
    if (!admin) {
      admin = new Admin({
        username: 'admin',
        password: 'admin123', // Mongoose pre('save') hook will hash this once
        name: 'Hostel Admin',
        email: 'admin@vnrvjiet.in',
        role: 'admin'
      });
      await admin.save();
      console.log('Created admin account (username: admin, password: admin123)');
    } else {
      admin.password = 'admin123'; // Reset password so pre('save') hook hashes it properly
      admin.name = 'Hostel Admin';
      admin.email = 'admin@vnrvjiet.in';
      admin.role = 'admin';
      await admin.save();
      console.log('Updated admin account password to admin123');
    }

    console.log('\n--- Seeding Summary ---');
    console.log('Default Student Password for all seeded students: 1234');
    console.log('\nStudent Login Credentials:');
    studentsData.forEach(s => {
      console.log(`  - Name: ${s.name}`);
      console.log(`    Roll Number: ${s.rollNumber}`);
      console.log(`    Email:       ${s.email}`);
      console.log(`    Password:    1234`);
    });
    console.log('\nAdmin Login Credentials:');
    console.log('  Username: admin');
    console.log('  Password: admin123');

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB.');
  }
}

seedData();
