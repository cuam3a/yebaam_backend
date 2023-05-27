import { Request, Response } from 'express';
import { ConstantsRS } from '../../utils/constants';
import { middlewares } from '../../middlewares/middleware';
import { similarServices } from '../../services/similarservices/similar.services';
import { responses } from '../utils/response/response';

class TokenController {
    public async getNewToken(req: Request, res: Response) {
        try {
            const token = req.cookies.rsj ? req.cookies.rsj : ''
            await middlewares.verifyRefrehsToken(token).then(async (rta: any) => {

                if (rta.success) {

                    let hoy = new Date();
                    let DIA_EN_MILISEGUNDOS = 24 * 60 * 60 * 1000;
                    let manana = new Date(hoy.getTime() + DIA_EN_MILISEGUNDOS);
                    if (rta.data.token) {
                        res.cookie('rsj', rta.data.refreshToken, { expires: manana, httpOnly: true })
                    }

                    res.json({
                        error: rta.data.token ? null : ConstantsRS.UNAUTHORIZED_ACCESS,
                        success: rta.data.token ? true : false,
                        token: rta.data.token ? rta.data.token : null
                    });

                } else {
                    res.send({
                        error: ConstantsRS.UNAUTHORIZED_ACCESS,
                        success: false,
                        token: null
                    });
                }
            })
        } catch (error) {
            console.log(error);

            res.send({
                error: ConstantsRS.UNAUTHORIZED_ACCESS,
                success: false,
                token: null,
                //httpOnly: res.setHeader('Set-Cookie', 'cook=ie; HttpOnly'),
                //data: rta ? rta : []
            });
        }
    }

    public async getNewTokenAccess(req: Request, res: Response) {
        try {
            const body = req.body
            const neToken = await middlewares.verifyTokenNewToken(body)
            responses.success(req,res,neToken)
        } catch (error) {
            console.log(error);

            res.send({
                error: ConstantsRS.UNAUTHORIZED_ACCESS,
                success: false,
                token: null,
                //httpOnly: res.setHeader('Set-Cookie', 'cook=ie; HttpOnly'),
                //data: rta ? rta : []
            });
        }
    }
}

export const tokenController = new TokenController();