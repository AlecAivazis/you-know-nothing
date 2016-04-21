// fix node land
import 'babel-polyfill'
// node imports
import process from 'process'
// third party imports
import express from 'express'
import compression from 'compression'
import logger from 'morgan'
import serveStatic from 'serve-static'
// local imports
import {
    buildDir,
    assetsDir,
    templatesDir,
} from 'config/projectPaths'


const app = express()


/* Application-wide Settings */

// use jade for html templating
app.set('view engine', 'jade')
// set directory in which to search for html templates
app.set('views', templatesDir)


/* Application-wide Middleware */

// add the favicon
// log requests
app.use(logger('dev'))
// compress responses
app.use(compression())
/* Routing */

// route static files to build and assets dirs
app.use('/static', serveStatic(buildDir), serveStatic(assetsDir))
app.get('/results', (req, res) => res.render('results.jade'))
app.get('/', (req, res) => res.render('index.jade'))

// interpret first arg from command line as port number
const port = parseInt(process.argv[2])
// listen on given port
app.listen(port, () => console.log(`[${new Date()}] Now listening on port: ${port}`))

