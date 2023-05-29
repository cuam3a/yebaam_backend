import { configServer } from '../controllers/utils/functions/getIpServer';

export class GlobalConstants {
    static Host: string = "http://" + configServer.ip + ':8080/'; //ip server

    static Access_Key_ID_AWS = 'AKIAIXZDXUHGSN3KV6OQ';
    static Secret_Access_Key_AWS = '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';
    static BUCKET_NAME = 'server-socialtic';
    //SEED middleware
    static SEED_TOKEN: string = 'jona--hizo-el-token';

    static ACCESS_TOKEN_LIFE: Number = 31557600//60
    static REFRESH_TOKEN_LIFE: Number = 31557600
    static portV = Number(process.env.PORT) || 8080;
    static MERCADO_URL = "https://api.mercadopago.com/checkout";
    static API_TUDOTSPOT_URL = 'https://31.220.63.117:8080/api';
    static DOMAIN_TUDOTSPOT_URL = 'https://yebaam.com';

    static ACCESS_TOKEN_MERCADO = "TEST-5292877914483657-121715-732ea590c10e2e272a0f8e0c0fa047e0-288905531";
    static URL_BASE_API_MX = "https://api-sepomex.hckdrk.mx/query/";
    static URL_BASE_API_CO = "https://raw.githubusercontent.com/marcovega/colombia-json/master/colombia.min.json";

    static USER_TEST = { id: 689495434, nickname: "TESTMTYITTPQ", password: "qatest6463", site_status: "active", email: "test_user_83094132@testuser.com" }
    static SERVER_REDIS = 'redis-cluster-service';
}