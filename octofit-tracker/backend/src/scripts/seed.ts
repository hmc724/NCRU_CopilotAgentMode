import mongoose from 'mongoose'
import { connectDatabase } from '../config/database.js'
import { Activity, Leaderboard, Team, User, Workout } from '../models.js'

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    await connectDatabase()
    await Promise.all([User.deleteMany({}), Team.deleteMany({}), Activity.deleteMany({}), Leaderboard.deleteMany({}), Workout.deleteMany({})])

    const users = await User.create([
      { username: 'alex', email: 'alex@example.com', name: 'Alex Morgan' },
      { username: 'jamie', email: 'jamie@example.com', name: 'Jamie Lee' },
    ])
    await Team.create({ name: 'Morning Movers', members: users.map((user: { _id: mongoose.Types.ObjectId }) => user._id) })
    await Activity.create([
      { user: users[0]._id, type: 'Run', durationMinutes: 30, completedAt: new Date('2026-08-18') },
      { user: users[1]._id, type: 'Cycling', durationMinutes: 45, completedAt: new Date('2026-08-19') },
    ])
    await Leaderboard.create([
      { user: users[0]._id, points: 320, rank: 1 },
      { user: users[1]._id, points: 280, rank: 2 },
    ])
    await Workout.create([
      { name: 'Full Body Strength', difficulty: 'Intermediate', durationMinutes: 35, exercises: ['Squats', 'Push-ups', 'Plank'] },
      { name: 'Cardio Starter', difficulty: 'Beginner', durationMinutes: 20, exercises: ['Jumping jacks', 'High knees', 'Lunges'] },
    ])

    console.log('Database seeding complete');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
