const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const uri = 'mongodb://ayuni:AyuniAutoCare2026Secure@ac-zmfzso1-shard-00-00.2uaxlgm.mongodb.net:27017,ac-zmfzso1-shard-00-01.2uaxlgm.mongodb.net:27017,ac-zmfzso1-shard-00-02.2uaxlgm.mongodb.net:27017/autocare360?ssl=true&replicaSet=atlas-nergkv-shard-0&authSource=admin&retryWrites=true&w=majority';

async function seed() {
  await mongoose.connect(uri);
  const db = mongoose.connection.db;
  const usersCol = db.collection('users');

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('Password123!', salt);

  const mockUsers = [
    {
      fullName: 'David Silva',
      email: 'david.silva@autocare.io',
      phone: '+94 77 123 4567',
      password: passwordHash,
      role: 'owner',
      status: 'active',
      displayName: 'David Silva',
      preferredLanguage: 'English',
      timezone: 'Asia/Colombo',
      city: 'Colombo',
      country: 'Sri Lanka',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      fullName: 'Apex Precision Garage',
      email: 'service@apexprecision.com',
      phone: '+94 11 987 6543',
      password: passwordHash,
      role: 'garage',
      status: 'active',
      displayName: 'Apex Precision Auto',
      preferredLanguage: 'English',
      timezone: 'Asia/Colombo',
      city: 'Colombo',
      country: 'Sri Lanka',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      fullName: 'System Administrator',
      email: 'admin.silva@autocare.io',
      phone: '+94 77 999 8888',
      password: passwordHash,
      role: 'admin',
      status: 'active',
      displayName: 'System Admin',
      preferredLanguage: 'English',
      timezone: 'Asia/Colombo',
      city: 'Colombo',
      country: 'Sri Lanka',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  for (const u of mockUsers) {
    const existing = await usersCol.findOne({ email: u.email });
    if (!existing) {
      await usersCol.insertOne(u);
      console.log('Inserted:', u.email, u.role);
    } else {
      await usersCol.updateOne({ email: u.email }, { $set: { password: passwordHash, status: 'active' } });
      console.log('Updated existing:', u.email);
    }
  }

  console.log('Seeded mock users successfully with password: Password123!');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
