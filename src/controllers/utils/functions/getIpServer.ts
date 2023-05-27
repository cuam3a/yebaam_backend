const { networkInterfaces } = require('os');

class ConfigServer {

    public ip: string;

    constructor() {
        this.ip = this.getIpServer()
    }

    private getIpServer(): string {
        try {
            
            const nets = networkInterfaces();
            const KeysNet = Object.keys(nets);
            const myIp = nets[KeysNet[1]][0];
            return myIp.address;
            
        } catch (error) {
            return 'no ip address'
        }
    }
}

export const configServer = new ConfigServer();