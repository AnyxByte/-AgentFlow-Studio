import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/user.js";
import { connectDB } from "./db.js";

dotenv.config();

const executeDatabaseSeed = async () => {
  try {
    console.log(
      "⏳ Checking database for existing administrative credentials...",
    );

    const adminExists = await User.findOne({ role: "admin" });

    if (adminExists) {
      console.log(
        "ℹ️ Identity Check: A root administrator profile is already configured.",
      );
      console.log(`   Registered login account target: ${adminExists.email}`);
      return;
    }

    console.log(
      "⚠️ No administrator detected. Initializing data seeder blueprint...",
    );

    const defaultAdmin = await User.create({
      name: "System Admin",
      email: "admin@agentflow.io",
      password: "Admin@123",
      mobileNumber: "+919999999999",
      role: "admin",
    });

    console.log(
      "✨ ───────────────────────────────────────────────────────── ✨",
    );
    console.log("✅ SEED CONFIGURATION COMPILED SUCCESSFULLY!");
    console.log(`   User Profile Identity: ${defaultAdmin.name}`);
    console.log(`   Access Account User  : ${defaultAdmin.email}`);
    console.log("   Temporary Secret Key : Admin@123");
    console.log(
      "✨ ───────────────────────────────────────────────────────── ✨",
    );
  } catch (error) {
    console.error("❌ Business Logic Exception during seeder execution cycle:");
    throw error;
  }
};

const runSeederLifecycle = async () => {
  try {
    await connectDB();

    await executeDatabaseSeed();

    await mongoose.connection.close();
    console.log(
      "🔌 Database pool connection gracefully terminated. Setup complete.",
    );
    process.exit(0);
  } catch (error) {
    console.error(
      "💥 Critical Failure: Seeding sequence terminated unexpectedly.",
    );
    console.error(error.stack || error);

    await mongoose.connection.close();
    process.exit(1);
  }
};

runSeederLifecycle();
