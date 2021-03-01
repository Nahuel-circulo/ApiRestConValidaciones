const express = require("express");
const cors = require("cors");
const { dbConnection } = require("../database/config");

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.usersPath = "/api/users";
        this.authPath = "/api/auth";

        //conectar a base de datos
        this.conectarDB();

        //middlewares
        this.middlewares();

        //routes
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
    }

    middlewares() {
        //cors
        this.app.use(cors());

        //lectura y parseo del body
        this.app.use(express.json());

        //directorio publico
        this.app.use(express.static("public"));
    }

    routes() {
        this.app.use(this.authPath, require("../routes/auth"));
        this.app.use(this.usersPath, require("../routes/users"));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`server on por ${this.port}`);
        });
    }
}

module.exports = Server;
