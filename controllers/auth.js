import User from '../models/User.js';
import { BadRequestError } from '../errors/BadRequestError.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const authController = {
  login: async (req, res) => {
    const { email, password } = req.body;
    console.log({ email, password });

    // validate email, password

    // check if email  exists
    const user = await User.findOne({ email });
    if (!user) {
      throw new BadRequestError('Email or password is not correct!');
    }

    // check password
    const isPwCorrect = await bcrypt.compare(password, user.password);
    if (!isPwCorrect) throw new BadRequestError('Email or password is not correct!');

    // generate token
    const token = jwt.sign({ _id: user._id }, process.env.ACCESS_TOKEN);

    let newUser = { ...user._doc };
    delete newUser.password;

    setTimeout(() => {
      return res.status(201).json({ user: newUser, token });
    }, 2000);
  },
  signup: async (req, res) => {
    const { email, password, name } = req.body;

    // validate req.body

    // check if email already exists
    const user = await User.findOne({ email });
    if (user) {
      throw new BadRequestError('Email alread exists, choose another email!');
    }

    // hash the password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // create new user
    let newUser = new User({ email, name, password: hashedPassword });
    newUser = await newUser.save();

    // generate token
    const token = jwt.sign({ _id: newUser._id }, process.env.ACCESS_TOKEN);

    newUser = { ...newUser._doc };
    delete newUser.password;

    setTimeout(() => {
      return res.status(201).json({ user: newUser, token });
    }, 2000);
  },
};

export default authController;
