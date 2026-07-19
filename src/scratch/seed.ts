import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '1.1.1.1']);
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { User } from '../models/User.js';

dotenv.config();

const connStr = process.env.DATABASE_URL;
if (!connStr) {
  console.error("DATABASE_URL is not defined in env variables");
  process.exit(1);
}

const users = [
  {
    email: 'dheerendrakumar@creativebuffer.com',
    name: 'Admin Dheerendra',
    role: 'admin' as const,
  },
  {
    email: 'pm@creativebuffer.com',
    name: 'PM Dummy',
    role: 'projectManager' as const,
  },
  {
    email: 'client@creativebuffer.com',
    name: 'Client Dummy',
    role: 'client' as const,
  },
  {
    email: 'member@creativebuffer.com',
    name: 'Member Dummy',
    role: 'member' as const,
  }
];

async function seed() {
  try {
    await mongoose.connect(connStr!);
    console.log("Connected to MongoDB for seeding...");

    const passwordHash = bcrypt.hashSync('12345678', 10);

    for (const u of users) {
      await User.findOneAndUpdate(
        { email: u.email },
        {
          email: u.email,
          name: u.name,
          role: u.role,
          password: passwordHash
        },
        { upsert: true, new: true }
      );
      console.log(`Seeded user: ${u.email} with role: ${u.role}`);
    }

    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Seeding error:", error);
  } finally {
    await mongoose.connection.close();
  }
}

seed();
