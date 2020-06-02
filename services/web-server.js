const http            = require('http')
const express         = require('express')
const cors            = require('cors')
const bodyParser      = require('body-parser')
const compression     = require('compression')
// const router          = require('./router.js')


let httpServer;
 
class Webserver {
  constructor (port = 3000, options = {}) {
    this.port = port
    this.options = options
  }

  configure (app) {

    app.use(bodyParser.json({
        limit: '5mb'
    }));
    app.use(bodyParser.urlencoded({
        extended: false
    }));
    
    app.use(compression())
    // Habilita o CORS
    app.use(cors())

    // if (initialPluginList && initialPluginList.length > 0) {
    //   initialPluginList.forEach((middleware) => app.use(middleware))
    // }

    // if (routeList && routeList.length > 0) {
    //   routeList.forEach(  (routeObj) => 
    //      app.use(routeObj.prefix, this.mountRoutes(routeObj.routes))
    //   )
    // }
    //Monte o roteador em / api para que todas as suas rotas comecem com / api
    app.use('/api', router)

    app.set('trust proxy', 1)
    app.get('/health', (req, res) => {
             res.end(`OK for ${process.uptime()} seconds`)
          })
  
  }

  mountRoutes (routesToMount) {
    const expressRouter = express.Router()

    Object.keys(routesToMount).forEach((httpVerb) => {
      routesToMount[httpVerb].forEach((route) => {
        expressRouter[httpVerb.toLowerCase()](route.path, route.handlers)
      })
    })

    return expressRouter
  }

  initialize() {

    console.log('Inicializando o Módulo do Servidor da Web');

    return new Promise((resolve, reject) => {

      const app = express()
      this.configure(app)

      const httpServer = http.createServer(app)     

      this.server =  httpServer.listen(this.port)
      this.server.setTimeout(300000)
      this.server
      .on('listening', () => {
          console.log(`Servidor Web escutando na porta:${webServerConfig.port}`) 
          resolve()
        })
        .on('error', err => {
          console.log(`Servidor Web ia escutar na porta:${webServerConfig.port}`) 
          reject(err)
        })
    })
  }

  getServer () {   
    return this.server
  } 
 
 
  close() {
    console.log('Fechando o Módulo do Servidor da Web')
    return new Promise((resolve, reject) => {
      httpServer.close((err) => {
        if (err) {
          reject(err)
          return
        } 
        resolve()
      })
    })
  }

}

module.exports = Webserver