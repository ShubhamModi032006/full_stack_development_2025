// tests/api.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Next.js (App Router) workbook API', () => {
  test('GET /api/companies returns a list', async ({ request }) => {
    const res = await request.get('/api/companies');
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty('count');
    expect(body).toHaveProperty('items');
    expect(Array.isArray(body.items)).toBeTruthy();
    expect(body.count).toBeGreaterThan(0);
  });

  test('GET /api/companies/search?name=Microsoft returns Microsoft', async ({ request }) => {
    const res = await request.get('/api/companies/search?name=Microsoft');
    expect(res.status()).toBe(200);
    const { count, items } = await res.json();
    expect(count).toBeGreaterThan(0);
    const found = items.find(it => it.name && it.name.toLowerCase().includes('microsoft'));
    expect(found).toBeTruthy();
  });

  test('GET /api/companies/:id returns the company document', async ({ request }) => {
    const listRes = await request.get('/api/companies?limit=1');
    expect(listRes.status()).toBe(200);
    const listBody = await listRes.json();
    expect(listBody.items.length).toBeGreaterThan(0);

    const id = listBody.items[0]._id;
    const singleRes = await request.get(`/api/companies/${id}`);
    expect(singleRes.status()).toBe(200);
    const doc = await singleRes.json();
    expect(doc).toHaveProperty('_id');
    expect(doc._id).toBe(id);
    expect(doc).toHaveProperty('name');
  });

  // optional negative tests (invalid id / not found)
  test('GET /api/companies/:id with invalid id returns 400', async ({ request }) => {
    const r = await request.get('/api/companies/invalid-id');
    expect(r.status()).toBe(400);
    const body = await r.json();
    expect(body).toHaveProperty('error');
  });

  test('GET /api/companies/search?location=UnknownCity returns empty list for non-existent location', async ({ request }) => {
    const r = await request.get('/api/companies/search?location=UnknownCity');
    expect(r.status()).toBe(200);
    const { items } = await r.json();
    expect(items.length).toBe(0);

    // items.forEach(company => {
    //   expect(company.location.toLowerCase()).toContain('hyderabad');
    // });
  });

  test('GET /api/companies?skill=DSA return campanies requiring DSA skill', async ({ request }) => {
    const r = await request.get('/api/companies?skill=DSA');
    expect(r.status()).toBe(200);
    const { items } = await r.json();
    expect(items.length).toBeGreaterThan(0);

    items.forEach(company => {
      const skills = company.hiringCriteria.skills.map(s => s.toLowerCase());
      expect(skills).toContain('dsa');
    });
  });

  test('count all the companies', async ({ request }) => {
    const r = await request.get('/api/companies');
    expect(r.status()).toBe(200);
    const { count, items } = await r.json();
    expect(count).toBe(items.length);
    expect(count).toBeGreaterThan(0);
  })


  test('filter companies by multiple conditions', async ({ request }) => {
    const r = await request.get('/api/companies?skill=DSA&location=Hyderabad');
    expect(r.status()).toBe(200);

    const { items } = await r.json();
    expect(items.length).toBeGreaterThan(0);

    items.forEach(company => {
      // ✅ Corrected field access
      const skills = company.hiringCriteria.skills.map(s => s.toLowerCase());
      expect(skills).toContain('dsa');

      // ✅ Exact match
      expect(company.location.toLowerCase()).toBe('hyderabad');
    });
  });
});