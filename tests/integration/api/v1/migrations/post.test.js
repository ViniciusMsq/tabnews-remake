import database from "infra/database.js";

beforeAll(cleanDatabase);

async function cleanDatabase() {
  await database.query("drop schema public cascade; create schema public;");
}

test("POST to /api/v1/status should return 200", async () => {
  const response1 = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });
  expect(response1.status).toBe(201);

  const respondeBody = await response1.json();
  expect(Array.isArray(respondeBody)).toBe(true);
  expect(respondeBody.length).toBeGreaterThan(0);

  const response2 = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });
  expect(response2.status).toBe(200);

  const respondeBody2 = await response2.json();
  expect(Array.isArray(respondeBody2)).toBe(true);
  expect(respondeBody2.length).toBe(0);

  const data = await database.query(
    "SELECT COUNT(*)::int inserido FROM public.pgmigrations;",
  );
  expect(data.rows[0].inserido).toBeGreaterThan(0);
});
