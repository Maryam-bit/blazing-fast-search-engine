const Models = require("../../models");
const jwt = require("jsonwebtoken");
const User = Models.User;
const bcrypt = require('bcrypt')
const { Op } = require('sequelize')
const config = require('../../config/env.config')

exports.register = async (req, res, next) => {
  try {
    const { user_name, email, password } = req.body;

    // Check if user_name or email already exist
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ user_name }, { email }],
      }
    });

    if (existingUser) {
      // User or email already exists
      return res.status(400).json({ error: 'User or email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      user_name,
      email,
      password: hashedPassword,
    };

    const createdUser = await User.create(newUser);
    return res.status(201).json(createdUser);
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
};


exports.login = async (req, res, next) => {
  const user = await User.findOne({ where: { email: req.body.email } });
  if (user) {
    const password_valid = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (password_valid) {
      token = jwt.sign(
        { id: user.id, email: user.email, username: user.user_name },
        config.secret,
        { expiresIn: "24h" }
      );

      res.cookie('jwt', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
      return res.status(200).json({ msg: "login success", token: token });
    } else {
      return res.status(400).json({ error: "Password Incorrect" });
    }
  } else {
    res.status(404).json({ error: "User does not exist" });
  }
}

exports.profile = async (req, res, next) => {
  let user = await User.findOne({
    where: { id: req.user.id },
    attributes: { exclude: ["password"] },
  });
  if (user === null) {
    return res.status(404).json({ msg: "User not found" });
  }
  res.status(200).json(user);
}

exports.logout = async (req, res, next) => {
  res.cookie('jwt', '', { maxAge: 0 });
  res.status(200).json({ msg: "User logged out" });
}

exports.getAllUsers = async (req, res, next) => {
  let user = await User.findAll({
    attributes: { exclude: ["password"] },
  });
  if (user === null) {
      return res.status(404).json({ msg: 'Users not found' });
  }

  res.status(200).json(user);
}

exports.getOneUser = async (req, res, next) => {
  const { search } = req.query;

  let user = null;

  if (search) {
    user = await User.findOne({
      where: {
        [Op.or]: [
          { user_name: search },
          { email: search }
        ]
      }
    });
  }

  if (user === null) {
      return res.status(404).json({ msg: 'User not found' });
  }

  res.status(200).json(user);
}

exports.updateUser = async (req, res, next) => {
  try {
    const { id, user_name="", email="", password } = req.body;
    const { search } = req.query;

    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ user_name }, { email }],
      }
    });

    if (existingUser) {
      // User or email already exists
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    let user = null;
  
    if (search) {
      user = await User.findOne({
        where: {
          [Op.or]: [
            { user_name: search },
            { email: search }
          ]
        }
      });
    }  

    console.log(user)

    if (user) {
      let updatedFields = {};

      if(user_name){
        updatedFields.user_name = user_name;
      }

      if(email){
        updatedFields.email = email;
      }

      if (password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        updatedFields.password = hashedPassword;
      }

      const updatedUser = await user.update(updatedFields);
      return res.status(200).json(updatedUser);
    } else {
      return res.status(404).json({ msg: 'User not found' });
    }
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
}

exports.delUser = async (req, res, next) => {
  const { user_name="", email="" } = req.body;
  try {
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ user_name }, { email }]
      }
    });
  
    if(!existingUser){
      return res.status(404).json({ msg: 'User not found' });
    }
  
    const deletedUser = await existingUser.destroy();
    return res.status(200).json(deletedUser);
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
}