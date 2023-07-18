const bcrypt = require("bcrypt");

module.exports = {
  register: {
    validUser: {
      user_name: "testuser",
      email: "test@example.com",
      password: "password",
    },
    existingUser: {
      user_name: "existinguser",
      email: "existing@example.com",
      password: "password",
    },
  },
  login: {
    validUser: {
      email: "test@example.com",
      password: "password",
    },
    invalidUser: {
      email: "invalid@example.com",
      password: "invalidpassword",
    },
    nonExistentUser: {
      email: "nonexistent@example.com",
      password: "password123",
    },
  },
  profile: {
    authenticatedUser: {
      user_name: "testuser",
      email: "test@example.com",
      password: bcrypt.hashSync("password", 10),
    },
  },
  updateUser: {
    user: {
      user_name: "testuser",
      email: "test@example.com",
      password: "password",
    },
    updatedUser: {
      user_name: "newTestUser",
      email: "newtestuser@example.com",
      password: "password123",
    },
  },
  deleteUser: {
    user: {
      user_name: "testuser",
      email: "test@example.com",
      password: bcrypt.hashSync("password", 10),
    },
  },
};
