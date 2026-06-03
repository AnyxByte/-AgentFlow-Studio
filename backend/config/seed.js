import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/user.js";
import { connectDB } from "./db.js";

dotenv.config();

const executeDatabaseSeed = async () => {
  try {
    console.log("Checking database existing admin...");

    const adminExists = await User.findOne({ role: "admin" });

    if (adminExists) {
      console.log("A root administrator profile is already configured.");
      console.log(`Registered login account: ${adminExists.email}`);
      return;
    }

    console.log("No admin detected....");

    const defaultAdmin = await User.create({
      name: "System Admin",
      email: "admin@agentflow.io",
      password: "Admin@123",
      mobileNumber: "+919999999999",
      role: "admin",
    });

    console.log("seed config success!");
    console.log(`User Profile Identity: ${defaultAdmin.name}`);
    console.log(`Access Account User  : ${defaultAdmin.email}`);
  } catch (error) {
    console.error("Error during seeding");
    throw error;
  }
};

const runSeederLifecycle = async () => {
  try {
    await connectDB();

    await executeDatabaseSeed();

    await mongoose.connection.close();
    console.log(" Database connection terminated. Setup complete.");
    process.exit(0);
  } catch (error) {
    console.error("Seeding sequence error");
    console.error(error.stack || error);

    await mongoose.connection.close();
    process.exit(1);
  }
};

runSeederLifecycle();
