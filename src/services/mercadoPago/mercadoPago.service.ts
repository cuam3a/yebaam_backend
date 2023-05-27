import axios from "axios";
import { GlobalConstants } from "../../config/GlobalConstants";
import { ConstantsRS } from '../../utils/constants';
import { similarServices } from "../similarservices/similar.services";
import { certificatesServices } from "../certificates/certificates.services";
import { dataOfLandingsServices } from "../landings/dataOfLandings.services";
import { trademarksBankpointsService } from "../trademarks/trademarksBankPoints.service";
const purchasesModel = require("../../models/purchases/Purchases.model");

const mercadopago = require("mercadopago");

mercadopago.configurations.setAccessToken(GlobalConstants.ACCESS_TOKEN_MERCADO);

class MercadoPagoService {
    mercadoPagoUrl: string;

    constructor() {
        this.mercadoPagoUrl = `${GlobalConstants.MERCADO_URL}`;
    }

    async CheckoutPro(
        id: string,
        name: string,
        price: any,
        unit: any,
        currency: string,
        entityid: string,
        username: string,
        useremail: string
    ) {
        const url: string = `${this.mercadoPagoUrl}/preferences?access_token=${GlobalConstants.ACCESS_TOKEN_MERCADO}`;

        const items: Array<Object> = [
            {
                id: id,
                title: name,
                category_id: id,
                quantity: unit,
                currency_id: currency,
                unit_price: parseFloat(price),
            },
        ];

        const preferences: object = {
            items,
            external_reference: id + "-" + entityid,
            payer: {
                // información del comprador
                name: username,
                email: useremail,
            },
            payment_methods: {
                installments: 6,
                default_installments: 6,
                excluded_payment_types: [
                    { id: "ticket" },
                    { id: "bank_transfer" }
                ],
            },
            back_urls: {
                success: `${GlobalConstants.API_TUDOTSPOT_URL}/payment/process`,
                pending: `${GlobalConstants.API_TUDOTSPOT_URL}/payment/process`,
                failure: `${GlobalConstants.API_TUDOTSPOT_URL}/payment/process`,
            },
            notification_url: `${GlobalConstants.API_TUDOTSPOT_URL}/payment/webhook`,
            auto_return: "all",
            statement_descriptor: "TuDotSpot",
            binary_mode: true
        };

        try {
            const request = await axios.post(url, preferences, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            return request.data;
        } catch (e) {
            console.log(e);
        }
    }

    async creteUrlPayment(body: {
        name: string;
        price: number;
        unit: number;
        img: string;
    }) {
        console.log("creating request...");

        // const url = `${GlobalConstants.MERCADO_URL}/preferences?access_token=${GlobalConstants.ACCESS_TOKEN_MERCADO}`;
        const url = `${GlobalConstants.MERCADO_URL}`;
        // url a la que vamos a hacer los requests
        const items = [
            {
                id: "1234",
                // id interno (del negocio) del item
                title: body.name,
                // nombre que viene de la prop que recibe del controller
                description: "Dispositivo movil de Tienda e-commerce",
                // descripción del producto
                picture_url: "https://courseit.com.ar/static/logo.png",
                // url de la imágen del producto
                category_id: "1234",
                // categoría interna del producto (del negocio)
                quantity: body.unit,
                // cantidad, que tiene que ser un intiger
                currency_id: "ARS",
                // id de la moneda, que tiene que ser en ISO 4217
                unit_price: body.price,
                // el precio, que por su complejidad tiene que ser tipo FLOAT
            },
        ];

        const preferences = {
            // declaramos las preferencias de pago
            // el array de objetos, items que declaramos más arriba

            token: "b3a7dbec3eb0d71798c4f19fec445795",
            installments: 1,
            transaction_amount: 58.8,
            description:
                "Point Mini a maquininha que dá o dinheiro de suas vendas na hora",
            payment_method_id: "visa",

            payer: {
                // información del comprador, si estan en producción tienen que //traerlos del request
                //(al igual que hicimos con el precio del item)
                email: GlobalConstants.USER_TEST.email,
                // si estan en sandbox, aca tienen que poner el email de SU usuario de prueba
                identification: {
                    number: "11111111",
                    type: "CC",
                },
            },
            external_reference: "ceotic",
            // referencia para identificar la preferencia, puede ser practicamente cualquier valor,
            statement_descriptor: "MercadoPago",
            additional_info: {
                items,
                payer: {
                    first_name: "Nome",
                    last_name: "Sobrenome",
                    address: {
                        zip_code: "06233-200",
                        street_name: "Av das Nacoes Unidas",
                        street_number: 3003,
                    },
                    registration_date: "2019-01-01T12:01:01.000-03:00",
                    phone: {
                        area_code: "011",
                        number: "987654321",
                    },
                },
                shipments: {
                    receiver_address: {
                        street_name: "Av das Nacoes Unidas",
                        street_number: 3003,
                        zip_code: "06233200",
                        city_name: "Buzios",
                        state_name: "Rio de Janeiro",
                    },
                },
            },
        };

        try {
            console.log("creating request");
            const request = await axios.post(url, preferences, {
                // hacemos el POST a la url que declaramos arriba, con las preferencias
                headers: {
                    // y el header, que contiene content-Type
                    "Content-Type": "application/json",
                    Authorization: `${GlobalConstants.ACCESS_TOKEN_MERCADO}`,
                },
            });

            return request.data;
            // devolvemos la data que devuelve el POST
        } catch (e) {
            console.log(e, "error");
            return e;
            // mostramos error en caso de que falle el POST
        }
    }

    public async getOthersPaymentsMethods() {
        const payment_methods = mercadopago.get("/v1/payment_methods");
        return payment_methods;
    }

    public async paymentwithPSE() {
        const payment_data = {
            transaction_amount: 5000,
            description: "Título del producto",
            payer: {
                email: "test_user_19549678@testuser.com",
                identification: {
                    type: "CC",
                    number: "76262349",
                },
                entity_type: "individual",
            },
            transaction_details: {
                financial_institution: 1234,
            },
            additional_info: {
                ip_address: "127.0.0.1",
            },
            callback_url: "http://www.tu-sitio.com",
            payment_method_id: "pse",
        };

        mercadopago.payment
            .create(payment_data)
            .then(function (data: any) { })
            .catch(function (error: any) { });
    }

    public async processPayment(req: any) {
        try {
            let purchase,
                rta,
                rtaError,
                state,
                payOrder,
                arrPayOrder,
                params,
                entityID,
                purchaseID;
            state = req.collection_status; // approved, in_process, rejected
            payOrder = req.external_reference; // <id_element>-<id_entity>

            arrPayOrder = payOrder.split("-");
            purchaseID = arrPayOrder[0];
            entityID = arrPayOrder[1];

            if (arrPayOrder.length == 2) {
                const purchaseToSave = new purchasesModel();
                purchaseToSave.payOrder = payOrder;

                let purcahsedItem = await similarServices.identifyPurchaseItem(purchaseID);
                let buyerUser = await similarServices.identifyUserBrandOrCommunity(entityID);

                if (!purcahsedItem.code && !buyerUser.code) {
                    purchaseToSave.purchaseType = purcahsedItem.type;
                    purchaseToSave.price = purcahsedItem.price;
                    purchaseToSave.quantiy = 1;
                    purchaseToSave.status = 0;

                    if (state == "approved") { // Pago aprobado
                        if (purcahsedItem.type == "certificate") { // Certificados
                            params = {
                                id: purchaseID,
                                state: 1,
                            };
                            purchase = await certificatesServices.changeStateByUser(params);
                            purchaseToSave.certificateID = purchaseID;

                            if (purchase.code != undefined) {
                                rtaError = purchase;
                            }
                        } else if (purcahsedItem.type == "landing") { // Landing
                            params = {
                                trademarkID: entityID,
                                landingID: purchaseID
                            };
                            purchase = await dataOfLandingsServices.buyDataOfLandings(params);
                            purchaseToSave.landingID = purchaseID;
                            if (purchase.code != undefined) {
                                rtaError = purchase;
                            }
                        } else if (purcahsedItem.type == "pointspackage") { // Paquetes de puntos
                            const namefield = buyerUser.type + "Id";

                            const bodyCreate = { [namefield]: entityID };
                            const dataPoint = {
                                [namefield]: entityID,
                                packageId: purchaseID,
                            };

                            purchase = await trademarksBankpointsService.addPoints(
                                bodyCreate,
                                dataPoint
                            );
                            purchaseToSave.pointsPackageID = purchaseID;
                        }
                    } else if (state == "in_process") {
                        // Pago pendiente
                        purchaseToSave.status = 1;
                    } else if (state == "rejected") {
                        // Pago rechazado
                        purchaseToSave.status = 2;
                        purchase = ConstantsRS.CANNOT_RUN_ACTION
                    }

                    if (!purchase.code) {
                        switch (buyerUser.type) {
                            case "user":
                                purchaseToSave.userID = entityID;
                                break;
                            case "marks":
                                purchaseToSave.trademarkID = entityID;
                                break;
                            case "professional":
                                purchaseToSave.professionalProfileID = entityID;
                                break;
                        }
                        purchaseToSave.payOrder = payOrder;
                        rta = await purchaseToSave.save();
                    } else {
                        rtaError = purchase
                    }
                } else {
                    rtaError = ConstantsRS.THE_RECORD_DOES_NOT_EXIST;
                }
            } else {
                rtaError = ConstantsRS.CANNOT_RUN_ACTION;
            }

            return rta ? rta : rtaError;
        } catch (error) {
            throw { ...ConstantsRS.CANNOT_RUN_ACTION, error };
        }
    }
}

export const mercadoPagoServide = new MercadoPagoService();
