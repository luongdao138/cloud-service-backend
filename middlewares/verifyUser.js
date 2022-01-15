import { UnAuthorizedError } from '../errors/UnAuthorizedError.js';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const verifyUser = async (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token || !token.startsWith('Bearer ')) {
    throw new UnAuthorizedError('Token not provided!');
  }

  jwt.verify(token.replace('Bearer ', ''), process.env.ACCESS_TOKEN, async (error, decoded) => {
    console.log({ error, decoded });
    if (error) {
      return res.status(401).json({ msg: 'Token is invalid or expired!' });
    }

    const { _id } = decoded;
    try {
      let user = await User.findById(_id);
      if (!user) {
        return res.status(401).json({ msg: 'Token is invalid or expired!' });
      }
      user = { ...user._doc };
      delete user.password;
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ msg: 'Token is invalid or expired!' });
    }
  });
};

export default verifyUser;
