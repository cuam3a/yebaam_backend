export interface VerificationCode {
    code: string,
    expirationDate: number,
    creationDate: number,
    intents:0,
    isVerified:false,
    resendCode: 0
}