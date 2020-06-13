import { query } from './apollo'

export function getArt() {
    query(`
        query{
            blog(lang:"en-us",uid:"prismic"){
            title
            }
        }
    `)
}