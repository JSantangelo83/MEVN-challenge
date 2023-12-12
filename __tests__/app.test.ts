import request from "supertest";
import { connectDatabase } from "../src/db/connection";
import app from "../src/app";

describe("Testing app.ts", () => {
  beforeAll(async () => {
    await connectDatabase();
  });

  test("The server is alive", async () => {
    const res = await request(app).get("/ping");
    expect(res.text).toEqual("pong");
  });
});