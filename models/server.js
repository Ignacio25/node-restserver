const express = require('express');
const cors = require('cors');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.usersPath = '/api/users';

        //Middlewares
        this.middlewares();

        // Rutas de mi aplicacion
        this.routes();
    }

    middlewares() {
        this.app.use(express.static('public'));
        this.app.use( cors() );
        this.app.use( express.json() );

    }

    routes() {

        this.app.use(this.usersPath, require('../routes/user.routes'));
    }

    listen() {
        this.app.listen( this.port, () => {
            console.log(`Server listening on port ${this.port}`)
        });
    }
}

module.exports = Server;