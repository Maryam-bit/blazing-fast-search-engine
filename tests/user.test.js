const request = require("supertest");
const {app, client} = require("../app"); // Assuming your Express app is defined in app.js
const Models = require("../models");
const { User } = Models;
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const { sequelize } = require("../models/index");
const fixtures = require('./fixtures/user_tests_fixture')
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
    const reqBody = fixtures.register.validUser

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
    expect(response.body.msg).toEqual("User registered successfully")
  });

  it("should return an error if user or email already exists", async () => {
    // Mock the request body
    const reqBody = fixtures.register.existingUser

    // Mock the User.findOne() method to return an existing user
    jest.spyOn(User, "findOne").mockResolvedValueOnce({});

    // Send a POST request to the /api/register endpoint
    const response = await request(server)
      .post("/api/v1/user/register")
      .send(reqBody);

    // Assertion
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "User or email already exists", email: reqBody.email, user_name: reqBody.user_name });
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
    const reqBody = fixtures.register.validUser

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
    expect(response.body.msg).toEqual("User registered successfully");
  });

  it('should return a token when valid credentials are provided', async () => {
    // Mock the User.findOne() method to return a user with valid credentials
    jest.spyOn(User, 'findOne').mockResolvedValueOnce({
      password: bcrypt.hashSync('password', 10),
    });
  
    const response = await request(app)
      .post('/api/v1/user/login')
      .send(fixtures.login.validUser)
      .expect(200);
  
    expect(response.body).toHaveProperty('token');
    expect(typeof response.body.token).toBe('string');
  });

  it('should return an error when invalid credentials are provided', async () => {
    const response = await request(app)
      .post('/api/v1/user/login')
      .send(fixtures.login.invalidUser)
      .expect(404);

    expect(response.body).toHaveProperty('error', 'User does not exist');
  });

  it('should return an error when the user does not exist', async () => {
    const response = await request(app)
      .post('/api/v1/user/login')
      .send(fixtures.login.nonExistentUser)
      .expect(404);

    expect(response.body).toHaveProperty('error', 'User does not exist');
  });
});

describe('Profile', () => {
  let server;
  let token;

  beforeAll(async () => {
    // Create a new user and obtain the token for authentication
    const user = fixtures.profile.authenticatedUser;

    await User.create(user);

    const response = await request(app)
      .post('/api/v1/user/login')
      .send(fixtures.login.validUser)
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
  let username = fixtures.profile.authenticatedUser.user_name;
  let email = fixtures.profile.authenticatedUser.email;

  beforeAll(async () => {
    // Create a new user and obtain the token for authentication
    const user = fixtures.profile.authenticatedUser

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
  let username = fixtures.updateUser.user.user_name;
  let email = fixtures.updateUser.user.email;

  beforeAll(async () => {
    // Create a new user and obtain the token for authentication
    const user = fixtures.updateUser.user

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
      .send({user_name: fixtures.updateUser.updatedUser.user_name})
      .expect(200);

    expect(response.body.user_name).toEqual(fixtures.updateUser.updatedUser.user_name);
  });

  it('should update users email', async () => {
    const response = await request(server)
      .patch('/api/v1/user/update?search='+email)
      .send({email: fixtures.updateUser.updatedUser.email})
      .expect(200);

    expect(response.body.email).toEqual(fixtures.updateUser.updatedUser.email);
  });

  it('should update users password', async () => {
    const response = await request(server)
      .patch('/api/v1/user/update?search='+"newTestUser")
      .send({password: fixtures.updateUser.updatedUser.password})
      .expect(200);

    expect(await bcrypt.compare(fixtures.updateUser.updatedUser.password, response.body.password)).toBe(true);
  });

});

describe('Delete user in db', () => {
  let server;
  let username = fixtures.deleteUser.user.user_name;
  let email = fixtures.deleteUser.user.email;

  beforeAll(async () => {
    // Create a new user and obtain the token for authentication
    const user = fixtures.deleteUser.user;

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