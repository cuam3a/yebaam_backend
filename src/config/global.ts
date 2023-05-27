const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

const {
    MONGO_USERNAME,
    MONGO_PASSWORD,
    MONGO_HOSTNAME,
    MONGO_PORT,
    MONGO_DB
} = process.env;

const options = {
    useNewUrlParser: true,
    connectTimeoutMS: 10000,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
};

// const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;
const url = `mongodb://${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}`;

mongoose.connect(url, options)
    .then(() => console.log('Db is connect'))
    .catch((err: any) => console.error("Error al conectar la base de datos", err));

module.exports = mongoose;