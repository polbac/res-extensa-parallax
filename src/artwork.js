import config from './config'

export default class ArtworkManager{
    constructor() {
        this.artworkList = config.artwork.map(artworkConfig => {
            return new Artwork(artworkConfig)
        })
    }

    getArtwork() {
        return this.artworkList
    }
}

class Artwork{
    constructor(config) {
        this.loaded = false
        this.config = config
    }
}