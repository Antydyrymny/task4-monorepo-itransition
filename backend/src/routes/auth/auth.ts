import passport from 'passport';
import passportJwt from 'passport-jwt';
import dotenv from 'dotenv';
import establishConnection from 'src/database/establishConnection';
import { User } from 'src/models/user';

dotenv.config();

const ExtractJwt = passportJwt.ExtractJwt;
const StrategyJwt = passportJwt.Strategy;

passport.use(
    new StrategyJwt(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET,
        },
        async (jwtPayload, done) => {
            const [connect, disconnect] = establishConnection();
            try {
                await connect();
                const userAuthenticated = await User.find({ _id: jwtPayload._id });
                if (userAuthenticated) done(null, userAuthenticated);
            } catch (error) {
                done(error);
                disconnect();
            }
        }
    )
);
