import { Request, Response } from 'express';
import { ConstantsRS } from '../../utils/constants';
import { GlobalConstants } from '../../config/GlobalConstants';
var jwt = require('jsonwebtoken');

class LogoutController {
    public async logout(req: Request, res: Response) {
        try {
            // const headers = req.headers
            // res.clearCookie('rsj')
            let payloadEmpty: any = []
            let manana = new Date(Date.now());
            const refreshToken = jwt.sign({ payloadEmpty }, GlobalConstants.SEED_TOKEN, { expiresIn: 2 })
            res.cookie('rsj', refreshToken, { expires: manana, httpOnly: true, maxAge: 0 })

            res.send({
                error: null,
                success: true,
                data: "Sesión cerrada correctamente"
            })
        } catch {
            res.send({
                error: ConstantsRS.ERROR_LOGOUT,
                success: false,
                data: []
            });
        }
    }
}

export const logoutController = new LogoutController();