import request from 'supertest';
import { server } from "../src/server"
import Prisma from "../src/db";
import { PrismaClient } from "@prisma/client"

// example test
describe("Example test", () => {
  it("should assert 1 + 1 is 2", () => {
    expect(1 + 1).toEqual(2);
  });
});

// arbitrary test data
const testTitle = "test-title"
const testDesc = "test-desc"
const testDate = new Date()
const testEntryData = { title: testTitle, description: testDesc, created_at: testDate }

// Prisma client for testing
const prisma = new PrismaClient()

// test suite
describe('Real Server Tests', () => {
  beforeAll(async () => {
    // connect to the database before testing
    await server.listen(3001);
  });

  afterAll(async () => {
    // disconnect from the database after tests finished
    await prisma.$disconnect();
    server.close();
  });

  // test GET /get/ endpoint
  // verifies success status and response type
  it('Fetch all entries', async () => {
    const response = await request(server.server).get('/get/');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  // test GET /get/:id endpoint
  // verifies success status and response equals expected result
  it('Fetch an entry by ID', async () => {
    const newEntry = await Prisma.entry.create({ data: testEntryData });
    const response = await request(server.server).get(`/get/${newEntry.id}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(newEntry.id);
  });

  // test POST /create/ endpoint
  // verifies success status, id property exists, and entry data in response matches request
  it('Create a new entry', async () => {
    const response = await request(server.server)
      .post('/create/')
      .send(testEntryData);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe(testTitle);
    expect(response.body.description).toBe(testDesc);
    expect(response.body.created_at).toBe(testDate.toISOString());
  });

  // test DELETE /delete/:id endpoint
  // verifies success status and message
  it('Delete an entry by ID', async () => {
    const newEntry = await Prisma.entry.create({ data: testEntryData });
    const response = await request(server.server).delete(`/delete/${newEntry.id}`);
    expect(response.status).toBe(200);
    expect(response.body.msg).toBe('Deleted successfully');
  });

  // test PUT /update/:id endpoint - update title
  // verifies success status and message
  it('Update an entry by ID - update date', async () => {
    const newEntry = await Prisma.entry.create({ data: testEntryData });
    const response = await request(server.server)
      .put(`/update/${newEntry.id}`)
      .send({ created_at: new Date() });
    expect(response.status).toBe(200);
    expect(response.body.msg).toBe('Updated successfully');
  });

  // test PUT /update/:id endpoint - update title
  // verifies success status and message
  it('Update an entry by ID - update title', async () => {
    const newEntry = await Prisma.entry.create({ data: testEntryData });
    const response = await request(server.server)
      .put(`/update/${newEntry.id}`)
      .send({ title: "new-rand-title" });
    expect(response.status).toBe(200);
    expect(response.body.msg).toBe('Updated successfully');
  });

  // test PUT /update/:id endpoint - update description
  // verifies success status and message
  it('Update an entry by ID - update desc', async () => {
    const newEntry = await Prisma.entry.create({ data: testEntryData });
    const response = await request(server.server)
      .put(`/update/${newEntry.id}`)
      .send({ description: "new-rand-desc" });
    expect(response.status).toBe(200);
    expect(response.body.msg).toBe('Updated successfully');
  });

  // test PUT /update/:id endpoint - update date
  // verifies success status and message
  it('Update an entry by ID - update date', async () => {
    const newEntry = await Prisma.entry.create({ data: testEntryData });
    const response = await request(server.server)
      .put(`/update/${newEntry.id}`)
      .send({ created_at: new Date(1999, 1, 1) });
    expect(response.status).toBe(200);
    expect(response.body.msg).toBe('Updated successfully');
  });
});