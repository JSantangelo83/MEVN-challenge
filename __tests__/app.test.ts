import request from "supertest";

import app from "../src/app";

describe("Testing app.ts", () => {
  test("The server is alive", async () => {
    const res = await request(app).get("/ping");
    expect(res.text).toEqual("pong");
  });
});