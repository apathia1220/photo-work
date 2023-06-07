import { Router } from 'express'
import multer from 'multer'
import {
    deletePhoto,
    getPhotoList,
    getPhotos,
    getTopPhoto,
    reviewPhoto,
    topPhoto,
    updatePhoto,
    uploadPhoto
} from '@src/services/photoService'
import validate from '@src/middleware/paramValidate'

// **** Variables **** //

const router = Router()
const upload = multer()

const { body, query } = validate

router.post('/upload', upload.array('photos'), uploadPhoto)

router.get('/all', query('current').filterCurrent(), query('size').filterSize(), getPhotoList)

router.get('/top', getTopPhoto)

router.get('/', query('current').filterCurrent(), query('size').filterSize(), getPhotos)

router.post('/review', body('id').notEmpty(), body('status').notEmpty(), reviewPhoto)

router.post('/top', topPhoto)

router.delete('/del', deletePhoto)

router.put('/update', updatePhoto)

// **** Export default **** //

export default router
