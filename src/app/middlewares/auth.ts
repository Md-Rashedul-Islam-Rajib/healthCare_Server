import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import catchAsync from '../../utilities/catchAsync';
import { ClassifiedError } from '../errors/Error';

const auth = (...roles: string[]) => {
  return catchAsync(async (req, _res, next) => {
    const token = req.headers.authorization;

    // checking if the token is missing
    if (!token) {
      throw new ClassifiedError('You are not authorized!',401);
    }

    // checking if the given token is valid
      const decoded = jwt.verify(
          token,
          config.jwt.jwt_secret as string,
      ) as JwtPayload;

    


    if (roles && !roles.includes(decoded.role as string)) {
      throw new ClassifiedError('you are not authorized',401);
      }
      req.user = decoded;

    next();
  });
};

export default auth;
