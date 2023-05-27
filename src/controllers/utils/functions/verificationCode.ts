import moment from 'moment';
import { VerificationCode } from '../interfaces/verificationCode.interface';
const seedrandom = require('seedrandom');

class VerificationCodeGenerator {

    public createCode(minutes: number): VerificationCode {

        //generate a verification code
        let rng = new seedrandom();
        const code = (rng()).toString().substring(3, 9);

        const verificationCodeToUser: VerificationCode = {
            code,
            expirationDate: moment().add(minutes, 'minutes').unix(),
            creationDate: moment().unix(),
            intents: 0,
            isVerified: false,
            resendCode: 0
        }
        return verificationCodeToUser;
    }

}

export const verificationCodeGenerator = new VerificationCodeGenerator();