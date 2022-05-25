const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config.db');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            auth:       '/api/auth',
            users:      '/api/users',
            categorias: '/api/categorias'
        }

        //Conectar a bbdd
        this.connectDB();

        //Middlewares
        this.middlewares();

        // Rutas de mi aplicacion
        this.routes();
    }

    async connectDB() {
        await dbConnection();
    }

    middlewares() {
        this.app.use(express.static('public'));
        this.app.use( cors() );
        this.app.use( express.json() );
    }

    routes() {

        this.app.use(this.paths.users, require('../routes/user.routes'));
        this.app.use(this.paths.auth, require('../routes/auth.routes'));
        this.app.use(this.paths.categorias, require('../routes/categorias.routes'));
    }

    listen() {
        this.app.listen( this.port, () => {
            console.log(`Server listening on port ${this.port}`)
        });
    }
}

module.exports = Server;