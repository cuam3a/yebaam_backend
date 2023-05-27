module.exports = {
    apps: [
        {
            name: "app",
            script: "./out/www.js",
            watch: false,
            env: {
                "NODE_ENV": "development",
                "TZ":"America/Bogota"
            },
            env_production: {
                "NODE_ENV": "production",
                "TZ":"America/Bogota"
            },
            env_local: {
                "NODE_ENV": "local",
                "TZ":"America/Bogota"
            }
        }
    ]
}