// server/src/scripts/testAuth.ts

import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/auth';

const testAuth = async () => {
  try {
    console.log('\n=== Testing Authentication ===\n');

    // Test 1: Register
    console.log('1. Testing registration...');
    const registerRes = await axios.post(`${BASE_URL}/register`, {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      phone: '8910347673',
      password: 'password123',
      role: 'customer',
      location: { address: '123 Test St' },
    });
    console.log('✓ Registration successful');
    //console.log('  User ID:', registerRes.data.data.user._id);
    console.log('  Token:', registerRes.data.token);
    console.log('  User:', registerRes.data.data);

    const { email, token } = {
      email: registerRes.data.data.email,
      token: registerRes.data.token,
    };

    // Test 2: Login
    console.log('\n2. Testing login...');
    const loginRes = await axios.post(`${BASE_URL}/login`, {
      email,
      password: 'password123',
    });
    console.log('✓ Login successful');
    console.log('  Token:', loginRes.data.data.token )//.token.substring(0, 20) + '...');

    // Test 3: Get current user
    console.log('\n3. Testing protected route...');
    const meRes = await axios.get(`${BASE_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('✓ Protected route accessible');
    console.log('  User:', meRes.data.data.user.name);

    console.log('\n=== All Tests Passed! ===\n');
  } catch (error: any) {
    console.error('✗ Test failed:', error.response?.data || error.message);
  }
};

testAuth();
