const musicModel = require('../models/music.model')
const albumModel = require('../models/album.model')
const { uploadFile } = require('../services/storage.services')


const jwt = require("jsonwebtoken")

async function createMusic(req, res) {
    
    const token = req.cookies.token

    if(!token){
        return res.status(401).json({
            message: "Access Denied ..!!"
        })
    }

    let decoded
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (err) {
        return res.status(401).json({
            message: "Access Denied !!"
        })
    }

    if (decoded.role !== 'artist') {
        return res.status(403).json({
            message: "You do not have access to create music."
        })
    }

    const title = typeof req.body?.title === 'string' ? req.body.title.trim() : ''
    const file = req.file

    if (!title || !file) {
        return res.status(400).json({
            message: "A title and music file are required."
        })
    }

    try {
        const result = await uploadFile(file.buffer.toString('base64'))
    
        const music = await musicModel.create({
            uri: result.url,
            title,
            artist: decoded._id
        })
    
        res.status(201).json({
            message: "Music Created Successfully .. ",
            music: {
                id: music._id,
                uri: music.uri,
                title: music.title,
                artist: music.artist
            }
        })
    } catch (err) {
        console.error("Music upload failed:", err)
        return res.status(500).json({
            message: "Music upload failed."
        })
    }
}

async function createAlbum(req, res){
    const token = req.cookies.token

    if(!token){
        return res.status(401).json({
            message: "access Denied .. "
        })
    }

    let decoded
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

    if(decoded.role !== 'artist'){
        return res.status(403).json({
            message: "You can not create an album"
        })
    }

        const {title, musicIds } = req.body

        const album = await albumModel.create({
            title,
            artist: decoded._id,
            musics: musicIds
        })

        return res.status(201).json({
            message: "Album created successfully",
            album: {
                id: album._id,
                title: album.title,
                artist: album.artist,
                musics: album.musics
            }
        })

    } catch (error) {
        console.error("Album creation failed:", error)
        return res.status(500).json({
            message: "Album creation failed."
        })
        
    }
}

async function getAllMusics(req, res){

    const musics = await musicModel.find()

    res.status(200).json({
        message: "Musics Fetched successfully",
        musics: musics
    })
}

async function getAllAlbums(req, res){
    const albums = await musicModel.find()

    res.status(200).json({
        message: "Albums fetched successfully",
        albums: albums
    })
}

module.exports = { createMusic, createAlbum, getAllMusics, getAllAlbums }
