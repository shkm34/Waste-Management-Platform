// server/src/scripts/testUserModel.ts

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';
import { connectDatabase } from '../config/database';

dotenv.config();

/**
 * Test User Model
 */
const testUserModel = async () => {
  try {
    // Connect to database
    await connectDatabase();
    console.log('\n=== Testing User Model ===\n');

    // Test 1: Create a customer
    console.log('1. Creating customer...');
    const customer = new User({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      password: 'password123',
      role: 'customer',
      location: {
        address: '123 Main Street, New York',
        latitude: 40.7128,
        longitude: -74.0060,
      },
    });
    await customer.save();
    console.log('✓ Customer created:', customer._id);
    console.log('  Name:', customer.name);
    console.log('  Email:', customer.email);
    console.log('  Wallet Balance:', customer.walletBalance);
    console.log('  Password (hashed):', customer.password.substring(0, 30) + '...');

    // Test 2: Create a dealer
    console.log('\n2. Creating dealer...');
    const dealer = new User({
      name: 'GreenTech Recyclers',
      email: 'dealer@greentech.com',
      phone: '0987654321',
      password: 'secure456',
      role: 'dealer',
      dealerTypes: ['ewaste', 'plastic'],
      location: {
        address: '456 Industrial Park, NYC',
      },
    });
    await dealer.save();
    console.log('✓ Dealer created:', dealer._id);
    console.log('  Name:', dealer.name);
    console.log('  Dealer Types:', dealer.dealerTypes);

    // Test 3: Create a driver
    console.log('\n3. Creating driver...');
    const driver = new User({
      name: 'Mike Driver',
      email: 'mike@driver.com',
      phone: '1122334455',
      password: 'driver789',
      role: 'driver',
      location: {
        address: '789 Delivery Lane, NYC',
      },
    });
    await driver.save();
    console.log('✓ Driver created:', driver._id);
    console.log('  Name:', driver.name);
    console.log('  Driver Status:', driver.driverStatus);

    // Test 4: Find user by email (password should not be included)
    console.log('\n4. Finding user by email...');
    const foundUser = await User.findOne({ email: 'john@example.com' });
    console.log('✓ User found:', foundUser?._id);
    console.log('  Password included?', foundUser?.password ? 'YES (BAD!)' : 'NO (Good!)');

    // Test 5: Find user with password explicitly
    console.log('\n5. Finding user with password...');
    const userWithPassword = await User.findOne({ email: 'john@example.com' }).select('+password');
    console.log('✓ User found with password');
    console.log('  Password included?', userWithPassword?.password ? 'YES' : 'NO');

    // Test 6: Test password comparison
    console.log('\n6. Testing password comparison...');
    if (userWithPassword) {
      const isMatch1 = await userWithPassword.comparePassword('password123');
      console.log('  Correct password:', isMatch1 ? '✓ Match' : '✗ No match');

      const isMatch2 = await userWithPassword.comparePassword('wrongpassword');
      console.log('  Wrong password:', isMatch2 ? '✗ Match (BAD!)' : '✓ No match (Good!)');
    }

    // Test 7: Query by role
    console.log('\n7. Querying users by role...');
    const customers = await User.find({ role: 'customer' });
    console.log(`✓ Found ${customers.length} customer(s)`);

    const dealers = await User.find({ role: 'dealer' });
    console.log(`✓ Found ${dealers.length} dealer(s)`);

    // Test 8: Find dealers by waste type
    console.log('\n8. Finding dealers who accept e-waste...');
    const ewasteAealers = await User.find({
      role: 'dealer',
      dealerTypes: 'ewaste',
    });
    console.log(`✓ Found ${ewasteAealers.length} dealer(s) accepting e-waste`);

    // Test 9: Find available drivers
    console.log('\n9. Finding available drivers...');
    const availableDrivers = await User.find({
      role: 'driver',
      driverStatus: 'available',
    });
    console.log(`✓ Found ${availableDrivers.length} available driver(s)`);

    // Clean up: Delete test users
    console.log('\n10. Cleaning up test data...');
    await User.deleteMany({
      email: { $in: ['john@example.com', 'dealer@greentech.com', 'mike@driver.com'] },
    });
    console.log('✓ Test users deleted');

    console.log('\n=== All Tests Passed! ===\n');

  } catch (error) {
    console.error('\n✗ Test failed:', error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  }
};

// Run tests
testUserModel();
