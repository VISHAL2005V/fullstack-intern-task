// Automated Backend Test Suite for TemplateHub
const testSuite = async () => {
  const BASE_URL = 'http://localhost:5000/api';
  let passed = 0;
  let failed = 0;

  const assert = (condition, testName) => {
    if (condition) {
      console.log(`PASS: ${testName}`);
      passed++;
    } else {
      console.error(`FAIL: ${testName}`);
      failed++;
    }
  };

  try {
    // 1. Health check
    const healthRes = await fetch(`${BASE_URL}/health`);
    const healthJson = await healthRes.json();
    assert(healthRes.status === 200 && healthJson.success === true, '1. Health check returns 200');

    // Generate unique test emails to avoid conflicts
    const randomSuffix = Math.floor(Math.random() * 100000);
    const user1Email = `testuser_${randomSuffix}@example.com`;
    const user2Email = `testuser2_${randomSuffix}@example.com`;
    const password = 'Password123!';

    // 2. User registration
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Vishal Test', email: user1Email, password }),
    });
    const regJson = await regRes.json();
    assert(regRes.status === 201 && regJson.success === true && !!regJson.data?.token, '2. User registration returns 201 and JWT token');
    const user1Token = regJson.data?.token;

    // 3. Duplicate email rejection
    const dupRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Duplicate User', email: user1Email, password }),
    });
    const dupJson = await dupRes.json();
    assert(dupRes.status === 400 && dupJson.success === false, '3. Duplicate email registration rejected with 400');

    // 4. Valid login
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user1Email, password }),
    });
    const loginJson = await loginRes.json();
    assert(loginRes.status === 200 && loginJson.success === true && !!loginJson.data?.token, '4. Valid login returns 200 and token');

    // 5. Invalid login
    const badLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user1Email, password: 'WrongPassword' }),
    });
    assert(badLoginRes.status === 401, '5. Invalid login rejected with 401');

    // 6. Protected endpoint without token
    const noTokenRes = await fetch(`${BASE_URL}/auth/me`);
    assert(noTokenRes.status === 401, '6. Protected endpoint without token rejected with 401');

    // 7. Protected endpoint with invalid token
    const badTokenRes = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: 'Bearer invalid.token.payload' },
    });
    assert(badTokenRes.status === 401, '7. Protected endpoint with invalid token rejected with 401');

    // 8. Protected endpoint with valid token
    const meRes = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${user1Token}` },
    });
    const meJson = await meRes.json();
    assert(meRes.status === 200 && meJson.data?.user?.email === user1Email, '8. GET /api/auth/me returns valid safe user profile');

    // 9. Fetch template list
    const templatesRes = await fetch(`${BASE_URL}/templates`);
    const templatesJson = await templatesRes.json();
    assert(templatesRes.status === 200 && Array.isArray(templatesJson.data) && templatesJson.data.length >= 8, '9. GET /api/templates returns 8+ seeded templates');
    const sampleTemplate = templatesJson.data[0];

    // 10. Filter by category
    const categoryRes = await fetch(`${BASE_URL}/templates?category=Portfolio`);
    const categoryJson = await categoryRes.json();
    const allPortfolio = categoryJson.data.every((t) => t.category === 'Portfolio');
    assert(categoryRes.status === 200 && allPortfolio && categoryJson.data.length > 0, '10. Filter by category returns matching templates');

    // 11. Search templates
    const searchRes = await fetch(`${BASE_URL}/templates?search=Dashboard`);
    const searchJson = await searchRes.json();
    assert(searchRes.status === 200 && searchJson.data.some((t) => t.name.includes('Dashboard')), '11. Search by keyword returns matching templates');

    // 12. Fetch individual template details
    const singleRes = await fetch(`${BASE_URL}/templates/${sampleTemplate._id}`);
    const singleJson = await singleRes.json();
    assert(singleRes.status === 200 && singleJson.data?.name === sampleTemplate.name, '12. GET /api/templates/:id returns correct template details');

    // 13. Invalid template ID 404
    const invalidRes = await fetch(`${BASE_URL}/templates/nonexistentid123`);
    assert(invalidRes.status === 404, '13. Invalid template ID returns 404');

    // 14. Add favorite
    const addFavRes = await fetch(`${BASE_URL}/favorites/${sampleTemplate._id}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${user1Token}` },
    });
    const addFavJson = await addFavRes.json();
    assert(addFavRes.status === 201 && addFavJson.success === true, '14. Add template to favorites returns 201');

    // 15. Prevent duplicate favorite
    const dupFavRes = await fetch(`${BASE_URL}/favorites/${sampleTemplate._id}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${user1Token}` },
    });
    assert(dupFavRes.status === 400, '15. Duplicate favorite rejected with 400');

    // 16. Get favorite IDs
    const favIdsRes = await fetch(`${BASE_URL}/favorites/ids`, {
      headers: { Authorization: `Bearer ${user1Token}` },
    });
    const favIdsJson = await favIdsRes.json();
    assert(favIdsRes.status === 200 && favIdsJson.data.includes(sampleTemplate._id), '16. GET /api/favorites/ids returns favorited template ID');

    // 17. Get populated personal favorites
    const getFavsRes = await fetch(`${BASE_URL}/favorites`, {
      headers: { Authorization: `Bearer ${user1Token}` },
    });
    const getFavsJson = await getFavsRes.json();
    assert(getFavsRes.status === 200 && getFavsJson.data.some((f) => f.template?._id === sampleTemplate._id), '17. GET /api/favorites returns populated template details');

    // 18. Confirm User 2 has separate favorites
    const reg2Res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'User Two', email: user2Email, password }),
    });
    const reg2Json = await reg2Res.json();
    const user2Token = reg2Json.data?.token;

    const user2FavsRes = await fetch(`${BASE_URL}/favorites`, {
      headers: { Authorization: `Bearer ${user2Token}` },
    });
    const user2FavsJson = await user2FavsRes.json();
    assert(user2FavsRes.status === 200 && user2FavsJson.data.length === 0, '18. Confirm User 2 has 0 favorites (data isolation verified)');

    // 19. Remove favorite
    const delFavRes = await fetch(`${BASE_URL}/favorites/${sampleTemplate._id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${user1Token}` },
    });
    assert(delFavRes.status === 200, '19. DELETE /api/favorites/:id returns 200');

    // 20. Confirm favorite was removed
    const postDelIdsRes = await fetch(`${BASE_URL}/favorites/ids`, {
      headers: { Authorization: `Bearer ${user1Token}` },
    });
    const postDelIdsJson = await postDelIdsRes.json();
    assert(!postDelIdsJson.data.includes(sampleTemplate._id), '20. Verify favorite successfully removed from user favorites list');

    console.log(`\n================================`);
    console.log(`SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log(`================================`);
    process.exit(failed > 0 ? 1 : 0);
  } catch (error) {
    console.error('Test execution error:', error);
    process.exit(1);
  }
};

testSuite();
