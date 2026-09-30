import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]); // mismo arreglo de DNS que en index.js

import { config } from "dotenv";
config({ path: ".env.test" });

import mongoose from "mongoose";
import { connectDB } from "../src/config/db.js";

if (!process.env.MONGO_URI || !process.env.MONGO_URI.includes("test")) {
  throw new Error(
    "MONGO_URI de .env.test debe apuntar a una base de datos de test (recipehub_test)",
  );
}

before(async function () {
  this.timeout(20000);
  await connectDB();
});

after(async () => {
  await mongoose.connection.close();
});
