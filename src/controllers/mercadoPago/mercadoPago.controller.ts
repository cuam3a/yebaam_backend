import { Request, Response } from 'express';
import { mercadoPagoServide } from '../../services/mercadoPago/mercadoPago.service';
import { responses } from '../utils/response/response';

class MercadoController {

    /**
     * Metodo para obtener link de mercado pago (Checkout Pro)
     * @param req
     * @param res
     */
    async checkoutProLink(req: Request, res: Response) {
        const { id, name, price, unit, currency, entityid, username, useremail } = req.body;

        try {
            const checkout = await mercadoPagoServide.CheckoutPro(
                id,
                name,
                price,
                typeof (unit) === 'string' ? parseInt(unit) : unit,
                currency,
                entityid,
                username,
                useremail
            );

            responses.success(req, res, checkout.init_point);
        }
        catch (error) {
            console.log("ERRMP1: ", error)
            responses.error(req, res, error);
        }
    }


    /**
     * Metodo para generar un link para pagos.
     * @param req
     * @param res
     */
    async getMercadoPagoLink(req: Request, res: Response) {

        const { name, price, unit, img } = req.body;

        try {
            const productToPay = { name, price, unit, img }
            const url = await mercadoPagoServide.creteUrlPayment(productToPay);
            responses.success(req, res, url);
        } catch (error) {
            responses.error(req, res, error);
        }
    }



    /**
     * Webhook para la recepcion de respuestas de mercado pago.
     * @param req
     * @param res
     */
    webHook(req: Request, res: Response) {
        let body = req.body;
        console.log("B: ", body)
        /* req.on("data", chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            console.log(body, "Webhook Response");
            res.end("ok");
        }); */

        return res.status(200).send("ok");
    }

    /**
     * Función para obtener medios de pago (Sin Probar)
     * @param req
     * @param res
     */
    public async getOtherPaymentsMethods(req: Request, res: Response) {
        try {
            const payments = await mercadoPagoServide.getOthersPaymentsMethods();
            responses.success(req, res, payments);
        } catch (error) {
            responses.error(req, res, error)
        }
    }

    /**
     * Función para ejecutar pago (Sin Probar)
     * @param req
     * @param res
     */
    public async makePayment(req: Request, res: Response) {
        try {
            const payments = await mercadoPagoServide.paymentwithPSE();
            responses.success(req, res, payments);

        } catch (error) {
            responses.error(req, res, error)
        }
    }

    public async processPayment(req: Request, res: Response) {
        try {
            const payments = await mercadoPagoServide.processPayment(req.query);
            if (!payments.code) {
                console.log("PAY: ", payments)
                switch (payments.status) {
                    case 0:
                        res.redirect(301, 'https://www.tudotspot.com/SuccessPayment')
                        break;
                    case 1:
                        res.redirect(301, 'https://www.tudotspot.com/PendingPayment')
                        break;
                    case 2:
                        res.redirect(301, 'https://www.tudotspot.com/FailedPayment')
                        break;
                    default:
                        res.redirect(301, 'https://www.tudotspot.com/FailedPayment')
                        break;
                }
            } else {
                res.redirect(301, 'https://www.tudotspot.com/FailedPayment')
            }
        } catch (error) {
            console.log("ERRMP: ", error)
            responses.error(req, res, error)
        }
    }
}

export const mercadoController = new MercadoController();