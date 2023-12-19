import { connectDatabase, sequelize } from '../src/db/connection';
import User from '../src/models/user.model';

jest.mock('sequelize-typescript', () => {
  const SequelizeMock = {
    sync: jest.fn(),
    define: jest.fn(),
  };

  const constructor = jest.fn().mockReturnValue(SequelizeMock);

  return { Sequelize: constructor };
});

jest.mock('../src/models/user.model', () => ({
  __esModule: true,
  default: {
    findOrCreate: jest.fn(),
  },
}));

describe('Database connection tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  it('should connect to the database', async () => {
    await connectDatabase();

    expect(sequelize.sync).toHaveBeenCalledTimes(1);
  });

  it('should create an admin user if it does not exist', async () => {
    await connectDatabase();

    expect(User.findOrCreate).toHaveBeenCalledTimes(1);
  });
});
