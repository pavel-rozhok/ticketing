import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken';

declare global {
  var signin: (id?: string) => Array<string>;
}

jest.mock('../nats-wrapper.ts');

process.env.STRIPE_KEY = 'sk_test_51KpWJsCFu9BCZwMFnOPKZWxmtMkXUeNyzREHLgJcTfr7XNJ2bmuZPB9jhy84m54Ii1xUulbmA7HYMPwf6WhJYV6M00jEw8NX7a';

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = 'asdxacqw';

  mongo = await MongoMemoryServer.create();
  const mongoUri = await mongo.getUri();
  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
}, 100000);

global.signin = (id?: string) => {
  const payload = {
    id: id || new mongoose.Types.ObjectId().toString(),
    email: 'test@test.com'
  };
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  const session = { jwt: token };
  const sessionJSON = JSON.stringify(session);
  const base64 = Buffer.from(sessionJSON).toString('base64');
  return [`session=${base64}`];
};
