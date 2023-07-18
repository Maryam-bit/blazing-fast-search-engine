const userService = require('../../services/userService')

exports.register = async (req, res, next) => {
  const { user_name, email, password } = req.body;
  try {
    await userService.registerUser(user_name, email, password);
    return res.status(201).json({ msg: "User registered successfully", email: email });
  } catch (error) {
    console.log("Error:", error);
    res.status(error.statusCode || 500).json({ error: error.message, user_name: user_name, email: email  });
  }
};


exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const token = await userService.loginUser(email, password);
    res.cookie('jwt', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
    return res.status(200).json({ msg: "Login successful", token });
  } catch (error) {
    console.log("Error:", error);
    res.status(error.statusCode || 500).json({ error: error.message });
  }
}

exports.profile = async (req, res, next) => {
  try {
    const user = await userService.getUserProfile(req.user.id);
    res.status(200).json(user);
  } catch (error) {
    console.log("Error:", error);
    res.status(error.statusCode || 500).json({ error: error.message });
  }
}

exports.logout = async (req, res, next) => {
  res.cookie('jwt', '', { maxAge: 0 });
  res.status(200).json({ msg: "User logged out" });
}

exports.getAllUsers = async (req, res, next) => {
  try {
    const user = await userService.getAllUsers();
    res.status(200).json(user);
  } catch (error) {
    res.status(error.statusCode || 500).json({error: error.message});
  }
}

exports.getOneUser = async (req, res, next) => {
  try {
    const { search } = req.query;
    const user = await userService.getOneUser(search);
    res.status(200).json(user);
  } catch (error) {
    res.status(error.statusCode || 500).json({error: error.message});
  }
}

exports.updateUser = async (req, res, next) => {
  try {
    const { id, user_name="", email="", password } = req.body;
    const { search } = req.query;
    const user = await userService.updateUser(user_name, email, password, search);
    res.status(200).json(user);
  } catch (error) {
    res.status(error.statusCode || 500).json({error: error.message});
  }
}

exports.delUser = async (req, res, next) => {
  try {
    const { user_name="", email="" } = req.body;
    const user = await userService.deleteUser(user_name, password);
    return res.status(200).json(user);
  } catch (error) {
    console.log("Error:", error);
    res.status(error.statusCode || 500).json({error: error.message});
  }
}