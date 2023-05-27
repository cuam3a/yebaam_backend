export interface ConfigI {
    database: {
        host: string,
        user: string,
        port: number,
        database: string,
        password: string,
        max: number,
        min: number,
        idleTimeoutMillis: number,
        connectionTimeoutMillis: number
    }
}