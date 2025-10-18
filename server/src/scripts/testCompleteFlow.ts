// server/src/scripts/testCompleteFlow.ts

import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';
let tokens = { customer: '', dealer: '', driver: '' };
let garbageId = '';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const testCompleteFlow = async () => {
  try {
    console.log('\n=== Testing Complete Waste Management Flow ===\n');

    // 1. Register users
    console.log('1. Registering users...');
    const timestamp = Date.now();
    
    const customerRes = await axios.post(`${BASE_URL}/auth/register`, {
        name: 'Flow Tes',
        email: `customer${timestamp}@test.com`,
        phone: '9527111111',
        password: 'pass123',
        role: 'customer',
        location: { address: '123 Test St' },
    });
    console.log('  Token:');
    tokens.customer = customerRes.data.token;
    console.log('✓ Customer registered');

    const dealerRes = await axios.post(`${BASE_URL}/auth/register`, {
      name: 'Flow Test Dealer',
      email: `dealer${timestamp}@test.com`,
      phone: '9572222222',
      password: 'pass123',
      role: 'dealer',
      dealerTypes: ['plastic', 'ewaste'],
      location: { address: '456 Dealer Ave' },
    });
    tokens.dealer = dealerRes.data.token;
    console.log('✓ Dealer registered');

    const driverRes = await axios.post(`${BASE_URL}/auth/register`, {
      name: 'Flow Test Driver',
      email: `driver${timestamp}@test.com`,
      phone: '9573333333',
      password: 'pass123',
      role: 'driver',
      location: { address: '789 Driver Rd' },
    });
    tokens.driver = driverRes.data.token;
    console.log('✓ Driver registered');

    // 2. Customer creates waste
    console.log('\n2. Customer creates waste...');
    const garbageRes = await axios.post(
      `${BASE_URL}/garbage/create`,
      {
        wasteType: 'plastic',
        weight: 3,
        location: { address: '123 Test St' },
        scheduledPickupDate: new Date(Date.now() + 86400000).toISOString(),
      },
      { headers: { Authorization: `Bearer ${tokens.customer}` } }
    );
    garbageId = garbageRes.data.data.garbage._id;
    console.log('✓ Waste created:', garbageId);
    console.log('  Status:', garbageRes.data.data.garbage.status);

    // 3. Dealer claims waste
    console.log('\n3. Dealer claims waste...');
    await sleep(500);
    const claimRes = await axios.post(
      `${BASE_URL}/garbage/${garbageId}/claim`,
      {},
      { headers: { Authorization: `Bearer ${tokens.dealer}` } }
    );
    console.log('✓ Waste claimed');
    console.log('  Status:', claimRes.data.data.garbage.status);
    console.log('  Driver assigned:', claimRes.data.data.assignedDriver.name);

    // 4. Driver marks ready
    console.log('\n4. Driver marks ready to pick...');
    await sleep(500);
    const readyRes = await axios.patch(
      `${BASE_URL}/garbage/${garbageId}/ready-to-pick`,
      {},
      { headers: { Authorization: `Bearer ${tokens.driver}` } }
    );
    console.log('✓ Marked ready');
    console.log('  Status:', readyRes.data.data.garbage.status);

    // 5. Driver picks up
    console.log('\n5. Driver picks up waste...');
    await sleep(500);
    const pickupRes = await axios.patch(
      `${BASE_URL}/garbage/${garbageId}/picked-up`,
      {},
      { headers: { Authorization: `Bearer ${tokens.driver}` } }
    );
    console.log('✓ Picked up');
    console.log('  Status:', pickupRes.data.data.garbage.status);

    // 6. Driver delivers
    console.log('\n6. Driver delivers to dealer...');
    await sleep(500);
    const deliverRes = await axios.patch(
      `${BASE_URL}/garbage/${garbageId}/delivered`,
      {},
      { headers: { Authorization: `Bearer ${tokens.driver}` } }
    );
    console.log('✓ Delivered');
    console.log('  Status:', deliverRes.data.data.garbage.status);

    // 7. Dealer accepts
    console.log('\n7. Dealer accepts delivery...');
    await sleep(500);
    const acceptRes = await axios.patch(
      `${BASE_URL}/garbage/${garbageId}/accept`,
      {},
      { headers: { Authorization: `Bearer ${tokens.dealer}` } }
    );
    console.log('✓ Delivery accepted');
    console.log('  Status:', acceptRes.data.data.garbage.status);
    console.log('  Customer new balance:', acceptRes.data.data.customerNewBalance);
    console.log('  Transaction amount:', acceptRes.data.data.transaction.amount);

    // 8. Customer checks balance
    console.log('\n8. Customer checks wallet...');
    const balanceRes = await axios.get(`${BASE_URL}/transactions/balance`, {
      headers: { Authorization: `Bearer ${tokens.customer}` },
    });
    console.log('✓ Wallet balance:', balanceRes.data.data.balance);

    console.log('\n=== Complete Flow Test Passed! ===\n');
  } catch (error: any) {
    console.error('\n✗ Test failed:', error.response?.data || error.message);
  }
};

testCompleteFlow();
