const Models = require("../models");
const jwt = require("jsonwebtoken");
const User = Models.User;
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const config = require("../config/env.config");

exports.registerUser = async (user_name, email, password) => {
  const existingUser = await User.findOne({
    where: {
      [Op.or]: [{ user_name }, { email }],
    },
  });

  if (existingUser) {
    const error = new Error("User or email already exists");
    error.statusCode = 400;
    throw error;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = {
    user_name,
    email,
    password: hashedPassword,
  };

  return await User.create(newUser);
};

exports.loginUser = async (email, password) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    const error = new Error("User does not exist");
    error.statusCode = 404;
    throw error;
  }

  const passwordValid = await bcrypt.compare(password, user.password);
  if (!passwordValid) {
    const error = new Error("Password Incorrect");
    error.statusCode = 404;
    throw error;
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, username: user.user_name },
    config.secret,
    { expiresIn: "24h" }
  );

  return token;
};

exports.getUserProfile = async (id) => {
  const user = await User.findOne({
    where: { id },
    attributes: { exclude: ["password"] },
  });

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return user;
};

exports.getAllUsers = async () => {
  let user = await User.findAll({
    attributes: { exclude: ["password"] },
  });

  if (!user) {
    const error = new Error("Users not found");
    error.statusCode = 404;
    throw error;
  }

  return user;
};

exports.getOneUser = async (search) => {
  let user = null;

  if (search) {
    user = await User.findOne({
      where: {
        [Op.or]: [{ user_name: search }, { email: search }],
      },
    });
  }

  if (!user) {
    const error = new Error("Users not found");
    error.statusCode = 404;
    throw error;
  }

  return user;
};

exports.updateUser = async (user_name, email, password, search) => {
  const existingUser = await User.findOne({
    where: {
      [Op.or]: [{ user_name }, { email }],
    },
  });

  if (existingUser) {
    const error = new Error("User or email already exists"); // to ensure multiple user cannot have the same email or username
    error.statusCode = 400;
    throw error;
  }

  let user = null;

  if (search) {
    user = await User.findOne({
      where: {
        [Op.or]: [{ user_name: search }, { email: search }],
      },
    });
  }

  if (user) {
    let updatedFields = {};

    if (user_name) {
      updatedFields.user_name = user_name;
    }

    if (email) {
      updatedFields.email = email;
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updatedFields.password = hashedPassword;
    }

    return await user.update(updatedFields);
  } else {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
};

exports.deleteUser = async (user_name, email) => {
  const existingUser = await User.findOne({
    where: {
      [Op.or]: [{ user_name }, { email }],
    },
  });

  if (!existingUser) {
    const error = new Error("Users not found");
    error.statusCode = 404;
    throw error;
  }

  return await existingUser.destroy();
};
