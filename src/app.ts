import express from "express";

import * as http from "http";
import socketIO from 'socket.io'
import { GlobalConstants } from "./config/GlobalConstants";
import * as socket from './sockets/socket'
//const redis = require("socket.io-redis");

export default class Server {
  private static _instance: Server;
  public app: express.Application;
  public port: number;
  private server: http.Server;
  public io: socketIO.Server;

  private constructor() {
    this.app = express();
    this.port = GlobalConstants.portV;
    this.server = new http.Server(this.app);
    this.io = socketIO(this.server)

    //this.io.adapter(redis({ host: GlobalConstants.SERVER_REDIS, port: 6379 }));

    this.listenerSocket();
  }

  public static get instance() {
    return this._instance || (this._instance = new this());
  }

  private listenerSocket() {
    console.log('Escuchando conexiones - sockets');
    this.io.on('connection', cliente => {

      //login
      socket.userConnect(cliente, this.io)
      socket.userDisconnect(cliente, this.io)
      socket.createChatRoom(cliente, this.io)
      socket.createChatRoom2(cliente, this.io)
      //socket.message(cliente,this.io)
      //socket.messageRoom(cliente,this.io)
      socket.notification(cliente, this.io)
      socket.chatConnect(cliente, this.io)

      //disconnect
      socket.disconnect(cliente, this.io)

    });

  }

  start(callback: () => void) {
    try {
      //#region www.ts

      this.server.listen(this.port, callback);
      /*  this.server.on("error", onError);
       this.server.on("listening", onListening);
      */
      /**
       * Event listener for HTTP server "error" event.
       */
      let ports = this.port
      function onError(error: any) {
        if (error.syscall !== "listen") {
          throw error;
        }

        let bind = typeof ports === "string" ? "Pipe " + ports : "Port " + ports;

        // handle specific listen errors with friendly messages
        switch (error.code) {
          case "EACCES":
            console.error(bind + " requires elevated privileges");
            process.exit(1);
            break;
          case "EADDRINUSE":
            console.error(bind + " is already in use");
            process.exit(1);
            break;
          default:
            throw error;
        }
      }

      /**
       * Event listener for HTTP server "listening" event.
       */
      let address2 = this.server.address();
      function onListening() {
        let addr = address2;

        let bind =
          typeof addr === "string" ? "pipe " + addr : "port " + addr?.port;

        console.log("Listening on " + bind);
      }
      //#endregion
    } catch (error) {
      console.log(error);
    }
  }
}
