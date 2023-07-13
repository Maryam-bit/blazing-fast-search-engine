const request = require("supertest");
const {app, client} = require("../app"); // Assuming your Express app is defined in app.js
const Models = require("../models");
const { User } = Models;
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const { sequelize } = require("../models/index");
dotenv.config();

beforeAll(async () => {
  client.disconnect();
  await sequelize.authenticate();
  await sequelize.sync({ force: true }); // Sync the models with the test database
});

afterAll(async () => {
  await sequelize.drop(); // Drop the tables after all tests are finished
  await sequelize.close(); // Close the database connection
});

describe("POST /api/v1/user/register", () => {
  let server;
  
  beforeEach(() => {
    server = app.listen();
  });

  afterEach(() => {
    server.close();
  });

  it("should create a new user", async () => {
    // Mock the request body
    const reqBody = {
      user_name: "testuser",
      email: "test@example.com",
      password: "password",
    };

    // Mock the User.create() method
    const createUserMock = jest
      .spyOn(User, "create")
      .mockResolvedValueOnce(reqBody);

    // Send a POST request to the /api/register endpoint
    const response = await request(server)
      .post("/api/v1/user/register")
      .send(reqBody);

    // Assertion
    expect(createUserMock).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(201);
    expect(response.body).toEqual(reqBody);
  });

  it("should return an error if user or email already exists", async () => {
    // Mock the request body
    const reqBody = {
      user_name: "existinguser",
      email: "existing@example.com",
      password: "password",
    };

    // Mock the User.findOne() method to return an existing user
    jest.spyOn(User, "findOne").mockResolvedValueOnce({});

    // Send a POST request to the /api/register endpoint
    const response = await request(server)
      .post("/api/v1/user/register")
      .send(reqBody);

    // Assertion
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "User or email already exists" });
  });
});

describe('Login', () => {
  let server;

  beforeEach(() => {
    server = app.listen();
  });

  afterEach(() => {
    server.close();
  });

  it("should create a new user", async () => {
    // Mock the request body
    const reqBody = {
      user_name: "testuser",
      email: "test@example.com",
      password: "password",
    };

    // Mock the User.create() method
    const createUserMock = jest
      .spyOn(User, "create")
      .mockResolvedValueOnce(reqBody);

    // Send a POST request to the /api/register endpoint
    const response = await request(server)
      .post("/api/v1/user/register")
      .send(reqBody);

    // Assertion
    expect(createUserMock).toHaveBeenCalledTimes(2);
    expect(response.status).toBe(201);
    expect(response.body).toEqual(reqBody);
  });

  it('should return a token when valid credentials are provided', async () => {
    // Mock the User.findOne() method to return a user with valid credentials
    jest.spyOn(User, 'findOne').mockResolvedValueOnce({
      password: bcrypt.hashSync('password', 10),
    });
  
    const response = await request(app)
      .post('/api/v1/user/login')
      .send({ email: 'test@example.com', password: 'password' })
      .expect(200);
  
    expect(response.body).toHaveProperty('token');
    expect(typeof response.body.token).toBe('string');
  });

  it('should return an error when invalid credentials are provided', async () => {
    const response = await request(app)
      .post('/api/v1/user/login')
      .send({ email: 'invalid@example.com', password: 'invalidpassword' })
      .expect(404);

    expect(response.body).toHaveProperty('error', 'User does not exist');
  });

  it('should return an error when the user does not exist', async () => {
    const response = await request(app)
      .post('/api/v1/user/login')
      .send({ email: 'nonexistent@example.com', password: 'password123' })
      .expect(404);

    expect(response.body).toHaveProperty('error', 'User does not exist');
  });
});

describe('Profile', () => {
  let server;
  let token;

  beforeAll(async () => {
    // Create a new user and obtain the token for authentication
    const user = {
      user_name: 'testuser',
      email: 'test@example.com',
      password: bcrypt.hashSync('password', 10),
    };

    await User.create(user);

    const response = await request(app)
      .post('/api/v1/user/login')
      .send({ email: 'test@example.com', password: 'password' })
      .expect(200);

    token = response.body.token;
  });

  beforeEach(() => {
    server = app.listen();
  });

  afterEach(() => {
    server.close();
  });

  it('should return the profile of the authenticated user', async () => {
    const response = await request(server)
      .get('/api/v1/user/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toHaveProperty('user_name', 'testuser');
    expect(response.body).toHaveProperty('email', 'test@example.com');
    expect(response.body).not.toHaveProperty('password');
  });

  it('should return an error if the user is not authenticated', async () => {
    const response = await request(server)
      .get('/api/v1/user/me')
      .expect(401);

    expect(response.body).toEqual({ msg: 'Couldnt Authenticate' });
  });
});

describe('Get Users from db', () => {
  let server;
  let username = "testuser";
  let email = "test@example.com";

  beforeAll(async () => {
    // Create a new user and obtain the token for authentication
    const user = {
      user_name: username,
      email: email,
      password: bcrypt.hashSync('password', 10),
    };

    await User.create(user);
  });

  beforeEach(() => {
    server = app.listen();
  });

  afterEach(() => {
    server.close();
  });

  it('should return all the users in db', async () => {
    const response = await request(server)
      .get('/api/v1/user/all')
      .expect(200);

    expect(response.body).not.toHaveLength(0)
  });

  it('should return single user from db by username', async () => {
    const response = await request(server)
      .get('/api/v1/user/getone?search='+username)
      .expect(200);

    expect(response.body.user_name).toEqual(username);
  });

  it('should return single user from db by email', async () => {
    const response = await request(server)
      .get('/api/v1/user/getone?search='+email)
      .expect(200);

    expect(response.body.email).toEqual(email);
  });

});

describe('Update user in db', () => {
  let server;
  let username = "testuser";
  let email = "test@example.com";

  beforeAll(async () => {
    // Create a new user and obtain the token for authentication
    const user = {
      user_name: username,
      email: email,
      password: bcrypt.hashSync('password', 10),
    };

    await User.create(user);
  });

  beforeEach(() => {
    server = app.listen();
  });

  afterEach(() => {
    server.close();
  });

  it('should update users username', async () => {
    const response = await request(server)
      .patch('/api/v1/user/update?search='+username)
      .send({user_name: "newTestUser"})
      .expect(200);

    expect(response.body.user_name).toEqual('newTestUser');
  });

  it('should update users email', async () => {
    const response = await request(server)
      .patch('/api/v1/user/update?search='+email)
      .send({email: 'newtestuser@example.com'})
      .expect(200);

    expect(response.body.email).toEqual("newtestuser@example.com");
  });

  it('should update users password', async () => {
    const response = await request(server)
      .patch('/api/v1/user/update?search='+"newTestUser")
      .send({password: 'password123'})
      .expect(200);

    expect(await bcrypt.compare('password123', response.body.password)).toBe(true);
  });

});

describe('Delete user in db', () => {
  let server;
  let username = "testuser";
  let email = "test@example.com";

  beforeAll(async () => {
    // Create a new user and obtain the token for authentication
    const user = {
      user_name: username,
      email: email,
      password: bcrypt.hashSync('password', 10),
    };

    await User.create(user);
  });

  beforeEach(() => {
    server = app.listen();
  });

  afterEach(() => {
    server.close();
  });

  it('should delete user by username', async () => {
    const response = await request(server)
      .delete('/api/v1/user/delete')
      .send({user_name: username})
      .expect(200);

    expect(response.body.user_name).toEqual(username);
  });

  it('should delete user by email', async () => {
    const response = await request(server)
      .delete('/api/v1/user/delete')
      .send({email: email})
      .expect(200);

    expect(response.body.email).toEqual(email);
  });
});