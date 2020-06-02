const awilix = require('awilix')

const database = require('./services/database.js');
const webserver = require('./services/web-server.js');
const webServerConfig = require('./config/web-server.js')
const router          = require('./services/router.js')

const container = awilix.createContainer()

container.register({
  router:      awilix.asFunction(require('./services/router').Route).scoped()

})
 
const webServer = new webserver(webServerConfig.port, {
    initialPluginList: [
                        //  [require('./adapters/scope-interceptor')({ container })]
                       ],
  finalPluginList: [ ],
    routeList: [
                container.resolve('router') 
               ]
  })
 


class StartAplicacao  {
    constructor () {
      this.qtde = 0
    }
  
      async  startup() {
        // *** existing try block in startup here ***
        console.log('Iniciando o aplicativo');
        console.log("Node.js version: " + process.version + 
                    " (" + process.platform, process.arch + ")")
        try {
          await database.initialize(); 
          await webServer.initialize();
        } catch (err) {
          console.error(err); 
          process.exit(1); // Non-zero failure code
        }
      }  
  
    static async shutdown(e) {
        let err = e    
        console.log('Desligando....')
        try {
          // await database.close()
          await webServer.close()
        } catch (err) {
          console.log('Erro encontrado', err)    
          err = err || e
        }
      
        
        console.log('Processo de saída') 
        if (err) {
          process.exit(1); // Non-zero failure code
        } else {
          process.exit(0)
        }
      }
      
  }

  module.exports = StartAplicacao

  process.on('SIGTERM', () => {
    console.log('SIGTERM recebido')  
    StartAplicacao.shutdown()
  })
  
  process.on('SIGINT', () => {
    console.log('SIGINT recebido')  
    StartAplicacao.shutdown()
  })
  
  process.on('uncaughtException', err => {
    console.log('Exceção não capturadada')
    console.error(err)  
    StartAplicacao.shutdown(err)
  })