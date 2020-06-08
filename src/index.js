const EventEmitter = require('events')
global.eventEmitter = new EventEmitter()

import Viewport from './viewport'
import ArtworkManager from './artwork'
import Render from './render'
import { Control, MOVE } from './navigation'

const viewport = new Viewport()
const artworkManager = new ArtworkManager()
const render = new Render(artworkManager.getArtwork())
const control = new Control()

render.addToDom()
render.firstRender()

global.eventEmitter.on(MOVE, ({ x, y }) => render.move({ x, y }))

setInterval(render.render.bind(render), 50)