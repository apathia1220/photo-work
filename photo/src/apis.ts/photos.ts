import axios from 'axios'

const instance = axios.create({
    baseURL: '/api'
})

export const getPhotoList = (size: number, current: number) => {
    return instance.get(`/photos?size=${size}&current=${current}`)
}

export const uploadPhotos = (files: File[]) => {
    const formData = new FormData()
    for (const file of files) {
        formData.append('photos', file)
    }
    return instance.post('/photos/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

export const getTopPhoto = () => instance.get('/photos/top')
