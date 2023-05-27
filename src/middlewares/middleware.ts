import { ConstantsRS } from '../utils/constants';
import moment from 'moment';
import { GlobalConstants } from '../config/GlobalConstants';
var jwt = require('jsonwebtoken');
const tokenList:any = []

class Middleware {
    public async createToken(obj:any){
        try {
            let payload = {
                "id":obj.id,
            }
            let token = jwt.sign({payload}, GlobalConstants.SEED_TOKEN, {expiresIn:GlobalConstants.ACCESS_TOKEN_LIFE})//5 min
            const refreshToken = jwt.sign({payload}, GlobalConstants.SEED_TOKEN, {expiresIn: GlobalConstants.REFRESH_TOKEN_LIFE})
            let tokenDecode = jwt.decode(token)
            let refreshTokenDecode = jwt.decode(refreshToken)
            const conversionToDateT = moment.unix(tokenDecode.exp)
            const conversionToDateR = moment.unix(refreshTokenDecode.exp)
            const conversionToHourT = moment.unix(tokenDecode.exp).format('HH:mm:ss')
            const conversionToHourR = moment.unix(refreshTokenDecode.exp).format('HH:mm:ss')
            const responseToken = {
                "status": "Logged in",
                "token": token,
                "expirationDateToken":conversionToDateT,
                "expirationTimeToken":GlobalConstants.ACCESS_TOKEN_LIFE,
                "expirationHourToken": conversionToHourT
            }
            const responseRefreshToken = refreshToken

            tokenList[refreshToken] = responseRefreshToken            
            return {token: responseToken, refreshToken: responseRefreshToken}
        } catch (error) {
            console.log(error);            
        }
    }

    public async createOnlyToken(obj:any){
        try {
            let payload = {
                "id":obj.id,
            }
            let token = jwt.sign({payload}, GlobalConstants.SEED_TOKEN, {expiresIn:GlobalConstants.ACCESS_TOKEN_LIFE})//5 min
            let tokenDecode = jwt.decode(token)
            const conversionToDateT = moment.unix(tokenDecode.exp)
            const conversionToHourT = moment.unix(tokenDecode.exp).format('HH:mm:ss')
            const responseToken = {
                "status": "Logged in",
                "token": token,
                "expirationDateToken":conversionToDateT,
                "expirationTimeToken":GlobalConstants.ACCESS_TOKEN_LIFE,
                "expirationHourToken": conversionToHourT
            }         
            return {token: responseToken}
        } catch (error) {
            console.log(error);            
        }
    }

    public async verifyToken(tokenSent:string){
        try {
            
            let token = tokenSent.split(' ')[1]
            return await jwt.verify(token, GlobalConstants.SEED_TOKEN, (err:any, decode:any) => {
                if (err) {
                    return {
                        error: err,
                        success: false,
                        data:[]
                    }
                }
                return {
                    error: null,
                    success: true,
                    data: decode
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

    public async verifyRefrehsToken(tokenSent:string){
        try {   
            return await jwt.verify(tokenSent, GlobalConstants.SEED_TOKEN, async (err:any, decode:any) => {
                if (err) {
                    return {
                        error: err,
                        success: false,
                        data:[]
                    }
                }
                const newAccesToken = await this.createToken(decode.payload)                
                return {
                    error: null,
                    success: true,
                    data: newAccesToken
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

    public async validateToken(tokenSecurity:any){
        // refresh the damn token
        const postData = tokenSecurity    
        // if refresh token exists
        if((postData.refreshToken) && (postData.refreshToken in tokenList)) {
            const user = {
                "email": postData.email,
                "name": postData.name
            }
            const token = jwt.sign(user, GlobalConstants.SEED_TOKEN, { expiresIn: GlobalConstants.ACCESS_TOKEN_LIFE})
            const response = {
                "token": token,
            }
            // update the token in the list
            tokenList[postData.refreshToken].token = token
        }
    }

    public async verifyTokenNewToken(body:any){
        try {   
            const newAccesToken = await this.createOnlyToken(body)                
            return  newAccesToken
        } catch (error) {
            console.log(error);
        }
    }
}

export const middlewares = new Middleware()