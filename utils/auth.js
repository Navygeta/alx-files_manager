import { ObjectID } from 'mongodb';
import redisClient from './redis';
import dbClient from './db';

// Retrieves authentication token from request headers
async function getAuthToken(request) {
  const token = request.headers['X-token'];
  return `auth_${token}`;
}

// Finds a user ID based on token stored in Redis
async function findUserIdByToken(request) {
  const key = await getAuthToken(request);
  const userId = await redisClient.get(key);
  return userId || null;
}

// Finds a user from MongoDB based on user ID
async function findUserById(userId) {
  const userExistsArray = await dbClient.users.find({ _id: ObjectID(userId) }).toArray();
  return userExistsArray[0] || null;
}

// Retrieves user from MongoDB by user ID obtained from token
async function getUserById(request) {
  const userId = await findUserIdByToken(request);
  if (userId) {
    const users = dbClient.db.collection('users');
    const objectId = new ObjectID(userId);
    const user = await users.findOne({ _id: objectId });
    return user || null;
  }
  return null;
}

// Retrieves user from MongoDB by token
async function getUser(request) {
  const token = request.headers['x-token'];
  const key = `auth_${token}`;
  const userId = await redisClient.get(key);
  if (userId) {
    const users = dbClient.db.collection('users');
    const idObject = new ObjectID(userId);
    const user = await users.findOne({ _id: idObject });
    return user || null;
  }
  return null;
}

export {
  findUserIdByToken,
  findUserById,
  getUserById,
  getUser,
};
