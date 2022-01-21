import User from '../models/User.js';
import { BadRequestError } from '../errors/BadRequestError.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(
  '290912695082-5v9jqpb177cvnvtcpv3q30sb29s1flal.apps.googleusercontent.com'
);

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
  googlelogin: async (req, res) => {
    const idToken = req.body.idToken;
    if (!idToken) throw new BadRequestError('Id token is required!');

    const data = await client.verifyIdToken({
      idToken,
      audience: '290912695082-3ekhf56e8hr53flpvo53gma2ql5d51e4.apps.googleusercontent.com',
    });

    const { email, email_verified, name, picture } = data.payload;

    const user = await User.findOne({ email });

    if (user) {
      const token = jwt.sign({ _id: user._id }, process.env.ACCESS_TOKEN);
      const newUser = { ...user._doc };
      delete newUser.password;

      return res.json({ token, user: newUser });
    } else {
      const password = email + process.env.ACCESS_TOKEN;
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
      let newUser = new User({ name, email, password: hashedPassword, picture_url: picture });
      newUser = await newUser.save();

      // generate token
      const token = jwt.sign({ _id: newUser._id }, process.env.ACCESS_TOKEN);

      newUser = { ...newUser._doc };
      delete newUser.password;
      return res.status(201).json({ user: newUser, token });
    }
  },
};

export default authController;
