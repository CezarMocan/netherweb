import express from 'express'
import next from 'next'
import bodyParser from 'body-parser'
import ioModule from 'socket.io'
import httpModule from 'http'
import compression from 'compression'
import { logError, logSuccess } from './log'

const CONFIG = {
    port: 3010
}

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
    const server = express()
    server.use(compression())
    server.use(bodyParser.json())
    server.use(bodyParser.urlencoded({ extended: true }))
    var http = httpModule.Server(server)
    var io = ioModule(http)
    var port = CONFIG.port || 3010;
  
    if (process.env.NODE_ENV === "production") {
      server.get(
        /^\/_next\/static\//,
        (_, res, nextHandler) => {
          res.setHeader(
            "Cache-Control",
            "public, max-age=31536000, immutable",
          );
          nextHandler();
        },
      );
    }
  
    server.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    })

    server.get('*', (req, res, next) => {
        // if (req.originalUrl.indexOf('/stats') == 0) return next()
        // if (req.originalUrl.indexOf('/hello') == 0) return next()
        // if (req.originalUrl.indexOf('/goodbye') == 0) return next()
        // if (req.originalUrl.indexOf('/changePhase') == 0) return next()
        // if (req.originalUrl.indexOf('/centralized/start') == 0) return next()
        // if (req.originalUrl.indexOf('/savedMessages') == 0) return next()
        if (req.originalUrl.indexOf('/static/images') != -1) {
          res.setHeader( "Cache-Control", "public, max-age=31536000, immutable" )
        }
        return handle(req, res)
    })    

    http.listen(port, function(){
        console.log('listening on *:', port)
    })
    
    io.on('connection', (socket) => {
        // DistributedManager.addClient(socket)
        console.log('New connection!')
    })
    
})
