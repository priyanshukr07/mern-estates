import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

const createToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET);

const sendUserResponse = (user, res) => {
  const token = createToken(user._id);
  const { password: pass, ...rest } = user._doc;

  return res
    .cookie('access_token', token, { httpOnly: true })
    .status(200)
    .json(rest);
};

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    res.status(201).json('User created successfully!');
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, 'User not found!'));
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, 'Wrong credentials!'));
    sendUserResponse(validUser, res);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return next(errorHandler(400, 'Google credential is required.'));
    }

    const googleResponse = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`
    );

    if (!googleResponse.ok) {
      return next(errorHandler(401, 'Unable to verify Google sign-in.'));
    }

    const payload = await googleResponse.json();

    if (process.env.GOOGLE_CLIENT_ID && payload.aud !== process.env.GOOGLE_CLIENT_ID) {
      return next(errorHandler(401, 'Google sign-in audience mismatch.'));
    }

    if (!payload.email || payload.email_verified !== 'true') {
      return next(errorHandler(401, 'Google account email is not verified.'));
    }

    const user = await User.findOne({ email: payload.email });
    if (user) {
      sendUserResponse(user, res);
    } else {
      const baseUsername = (payload.name || payload.email.split('@')[0])
        .split(' ')
        .join('')
        .toLowerCase();
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username: baseUsername + Math.random().toString(36).slice(-4),
        email: payload.email,
        password: hashedPassword,
        avatar: payload.picture,
      });
      await newUser.save();
      sendUserResponse(newUser, res);
    }
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  try {
    res.clearCookie('access_token');
    res.status(200).json('User has been logged out!');
  } catch (error) {
    next(error);
  }
};
