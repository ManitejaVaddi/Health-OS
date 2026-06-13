import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    return next(new Error('Not authorized, token missing'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('email');

    if (!user) {
      res.status(401);
      throw new Error('Not authorized');
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401);
    next(new Error('Token invalid or expired'));
  }
};
