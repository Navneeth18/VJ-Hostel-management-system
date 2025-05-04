const mongoose = require('mongoose');
const Student = require('../models/StudentModel');
const Room = require('../models/Room');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });

// Function to allocate rooms to existing students
async function allocateRooms() {
  try {
    // First, check if we have rooms
    const roomCount = await Room.countDocuments();
    if (roomCount === 0) {
      console.log('No rooms found. Creating rooms first...');
      await createRooms();
    }

    // Get all active students without room allocation
    const studentsToAllocate = await Student.find({
      is_active: true,
      $or: [
        { roomNumber: { $exists: false } },
        { roomNumber: null },
        { roomNumber: "" }
      ]
    });

    console.log(`Found ${studentsToAllocate.length} students without room allocation`);

    if (studentsToAllocate.length === 0) {
      console.log('No students need room allocation');
      mongoose.disconnect();
      return;
    }

    // Get all rooms with available space
    const rooms = await Room.find().populate('occupants');
    const vacantRooms = rooms.filter(room => room.occupants.length < room.capacity);

    if (vacantRooms.length === 0) {
      console.log('No vacant rooms available');
      mongoose.disconnect();
      return;
    }

    console.log(`Found ${vacantRooms.length} vacant rooms`);

    let allocatedCount = 0;
    let roomIndex = 0;

    // Allocate students to rooms
    for (const student of studentsToAllocate) {
      // Find a room with available space
      while (roomIndex < vacantRooms.length) {
        const room = vacantRooms[roomIndex];

        // Check if room has space
        if (room.occupants.length < room.capacity) {
          console.log(`Allocating student ${student.name} (${student.rollNumber}) to room ${room.roomNumber}`);

          // Update student's room number
          student.roomNumber = room.roomNumber;
          await student.save();

          // Add student to room's occupants
          room.occupants.push(student._id);
          await room.save();

          allocatedCount++;
          break;
        }

        roomIndex++;

        // If we've gone through all rooms, start from the beginning
        if (roomIndex >= vacantRooms.length) {
          roomIndex = 0;

          // Refresh vacant rooms data
          const updatedRooms = await Room.find().populate('occupants');
          const updatedVacantRooms = updatedRooms.filter(room => room.occupants.length < room.capacity);

          if (updatedVacantRooms.length === 0) {
            console.log(`Allocated ${allocatedCount} students to rooms. No more vacant rooms available.`);
            mongoose.disconnect();
            return;
          }

          vacantRooms.length = 0;
          vacantRooms.push(...updatedVacantRooms);
        }
      }
    }

    console.log(`Successfully allocated ${allocatedCount} students to rooms`);
    mongoose.disconnect();
  } catch (error) {
    console.error('Error allocating rooms:', error);
    mongoose.disconnect();
  }
}

// Room pattern for each floor (rooms 01-39 only)
const roomPattern = [
  { suffix: '01', capacity: 3 }, { suffix: '02', capacity: 3 }, { suffix: '03', capacity: 2 },
  { suffix: '04', capacity: 3 }, { suffix: '05', capacity: 2 }, { suffix: '06', capacity: 3 },
  { suffix: '07', capacity: 2 }, { suffix: '08', capacity: 3 }, { suffix: '09', capacity: 3 },
  { suffix: '10', capacity: 2 },

  // Rooms 11-20
  { suffix: '11', capacity: 3 }, { suffix: '12', capacity: 2 }, { suffix: '13', capacity: 3 },
  { suffix: '14', capacity: 2 }, { suffix: '15', capacity: 3 }, { suffix: '16', capacity: 2 },
  { suffix: '17', capacity: 3 }, { suffix: '18', capacity: 2 }, { suffix: '19', capacity: 3 },
  { suffix: '20', capacity: 2 },

  // Rooms 21-30
  { suffix: '21', capacity: 3 }, { suffix: '22', capacity: 2 }, { suffix: '23', capacity: 3 },
  { suffix: '24', capacity: 2 }, { suffix: '25', capacity: 3 }, { suffix: '26', capacity: 2 },
  { suffix: '27', capacity: 3 }, { suffix: '28', capacity: 2 }, { suffix: '29', capacity: 3 },
  { suffix: '30', capacity: 2 },

  // Rooms 31-39
  { suffix: '31', capacity: 3 }, { suffix: '32', capacity: 2 }, { suffix: '33', capacity: 3 },
  { suffix: '34', capacity: 2 }, { suffix: '35', capacity: 3 }, { suffix: '36', capacity: 2 },
  { suffix: '37', capacity: 3 }, { suffix: '38', capacity: 3 }, { suffix: '39', capacity: 2 }
];

// Create rooms for all 12 floors
async function createRooms() {
  try {
    // First, clear existing rooms
    await Room.deleteMany({});
    console.log('Cleared existing rooms');

    const rooms = [];

    // Generate rooms for 12 floors
    for (let floor = 1; floor <= 12; floor++) {
      // For floors 1-9, use format 101-139, 201-239, etc.
      // For floors 10-12, use special format with increments of 10:
      // 10th floor: 1001, 1011, 1021, 1031, etc.
      // 11th floor: 1101, 1111, 1121, 1131, etc.
      // 12th floor: 1201, 1211, 1221, 1231, etc.

      if (floor < 10) {
        // Regular format for floors 1-9
        const floorPrefix = floor.toString();

        for (const room of roomPattern) {
          const roomNumber = floorPrefix + room.suffix;
          rooms.push({
            roomNumber,
            capacity: room.capacity,
            occupants: []
          });
        }
      } else {
        // Special format for floors 10-12
        const floorPrefix = floor.toString() + '0';
        let roomIndex = 0;

        // Create rooms with increments of 10 in the room number
        for (const room of roomPattern) {
          // Calculate the room number: 1001, 1011, 1021, etc.
          const roomNumber = floorPrefix + (1 + roomIndex * 10).toString().padStart(2, '0');
          rooms.push({
            roomNumber,
            capacity: room.capacity,
            occupants: []
          });
          roomIndex++;
        }
      }
    }

    // Insert all rooms
    await Room.insertMany(rooms);
    console.log(`Successfully created ${rooms.length} rooms across 12 floors`);
  } catch (error) {
    console.error('Error creating rooms:', error);
    mongoose.disconnect();
  }
}

// Run the allocation
allocateRooms();
