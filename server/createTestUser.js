const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Student = require('./models/StudentModel');
const Admin = require('./models/AdminModel');

async function createTestUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/hostel-management');
    console.log('Connected to MongoDB');

    // Check if test student exists
    const existingStudent = await Student.findOne({ rollNumber: 'S12345' });
    if (!existingStudent) {
      const testStudent = new Student({
        name: 'Test Student',
        rollNumber: 'S12345',
        branch: 'Computer Science',
        year: 3,
        profilePhoto: null,
        phoneNumber: '1234567890',
        email: 'test@example.com',
        password: 'password123',
        parentMobileNumber: '9876543210',
        roomNumber: 'A101',
        is_active: true
      });
      
      await testStudent.save();
      console.log('Test student created successfully');
    }

    // Check if test admin exists
    let existingAdmin = await Admin.findOne({ username: 'admin' });
    if (!existingAdmin) {
      const testAdmin = new Admin({
        username: 'admin',
        password: 'admin123',
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin'
      });
      
      await testAdmin.save();
      console.log('Test admin created successfully');
    } else {
      existingAdmin.password = 'admin123';
      await existingAdmin.save();
      console.log('Test admin password updated');
    }

    console.log('Test users setup complete');
  } catch (error) {
    console.error('Error creating test users:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
  }
}

createTestUsers();
