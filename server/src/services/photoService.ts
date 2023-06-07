import { IBaseQuery, IReq, IReqQuery, IRes, IReviewReq, IUpdateReq } from '@src/routes/types'
import { baseUpload } from '@src/util/oss'
import validate from '@src/middleware/paramValidate'
import { batchExc, doubleBatchExc, exc } from '@src/util/mysql'
import { ResultSetHeader, escape } from 'mysql2'
import { ErrorResModel, SuccessResModel } from '@src/models/resModel'
import StatusCode from '@src/constants/StatusCode'

const { validationResult } = validate

export async function uploadPhoto(req: IReq, resp: IRes) {
    try {
        const photos = req.files as []
        if (!photos) throw new ErrorResModel(StatusCode.FAIL, '文件不能为空')
        const uploadListPromise = photos.map((photo) => {
            const { originalname, buffer } = photo
            return baseUpload('/mihoyo/' + originalname, buffer)
        })

        // 并行上传多个文件
        const results = await Promise.all(uploadListPromise)
        const urls = results.map((url) => url.replace('apathia-blog.oss-cn-shanghai.aliyuncs.com', 'static.apathia.cn'))
        const sqlList = [] as Array<[string, (insertId: number) => string]>
        for (const url of urls) {
            sqlList.push([
                `INSERT INTO mt_photos SET photo_src=${escape(url)}, create_time=NOW(), status=1;`,
                (insertId: number) => `INSERT INTO mt_photos_order SET photo_id=${insertId};`
            ])
        }
        await doubleBatchExc(sqlList)
        resp.json(new SuccessResModel('操作成功', results))
    } catch (err) {
        throw err
    }
}

export async function getPhotos(req: IReqQuery<IBaseQuery>, resp: IRes) {
    try {
        validationResult(req).array()
        const { current, size } = req.query
        const sql = `SELECT 
                p.id AS id,
                p.photo_src AS photoSrc, 
                o.photo_order AS photoOrder,
                p.status,
                p.is_top AS isTop,
                p.create_time AS createTime
            FROM mt_photos p 
            JOIN mt_photos_order o ON p.id=o.photo_id
            WHERE p.status=1 AND p.is_top=0
            ORDER BY o.photo_order asc
            LIMIT ${size} OFFSET ${+size * +current};`
        const data = await exc(sql)
        if (data === void 0) {
            throw new ErrorResModel(StatusCode.FAIL, '获取失败')
        }
        const res = Array.prototype.slice.call(data)
        const count = await countPhotos()
        resp.json(new SuccessResModel('操作成功', { records: res, count }))
    } catch (err) {
        throw err
    }
}

export async function getPhotoList(req: IReqQuery<IBaseQuery>, resp: IRes) {
    try {
        validationResult(req).array()
        const { current, size } = req.query
        const sql = `SELECT 
                p.id AS id,
                p.photo_src AS photoSrc, 
                o.photo_order AS photoOrder,
                p.status,
                p.is_top AS isTop,
                p.create_time AS createTime
            FROM mt_photos p 
            JOIN mt_photos_order o ON p.id=o.photo_id
            ORDER BY o.photo_order asc
            LIMIT ${size} OFFSET ${+size * +current};`
        const data = await exc(sql)
        if (data === void 0) {
            throw new ErrorResModel(StatusCode.FAIL, '获取失败')
        }
        const res = Array.prototype.slice.call(data)
        const count = await countPhotos()
        resp.json(new SuccessResModel('操作成功', { records: res, count }))
    } catch (err) {
        throw err
    }
}

export async function reviewPhoto(req: IReq<IReviewReq>, resp: IRes) {
    try {
        const { id, status } = req.body
        const sql = `UPDATE mt_photos SET status=${status}, update_time=NOW() WHERE id=${id};`
        const res = (await exc(sql)) as ResultSetHeader
        if (res.affectedRows === 0) throw new ErrorResModel(StatusCode.FAIL, '获取失败')
        resp.json(new SuccessResModel('操作成功'))
    } catch (err) {
        throw err
    }
}

export async function updatePhoto(req: IReq<IUpdateReq>, resp: IRes) {
    try {
        const { photos } = req.body
        if (photos === undefined) throw new ErrorResModel(StatusCode.FAIL, '照片不能为空')
        const sqlList = []
        for (const photo of photos) {
            sqlList.push(`UPDATE mt_photos_order SET photo_id=${photo.id} WHERE photo_order=${photo.photoOrder};`)
        }
        await batchExc(sqlList)
        resp.json(new SuccessResModel('更新成功'))
    } catch (err) {
        throw err
    }
}

export async function topPhoto(req: IReq<{ id: number; isTop?: 0 | 1 }>, resp: IRes) {
    try {
        const { isTop, id } = req.body
        const initSql = `UPDATE mt_photos SET is_top=${isTop === 0 ? 1 : 0};`
        const sql = `UPDATE mt_photos SET is_top=${isTop}, update_time=NOW() WHERE id=${id};`
        await batchExc([initSql, sql])
        resp.json(new SuccessResModel('置顶成功'))
    } catch (err) {
        throw err
    }
}

export async function deletePhoto(req: IReq<number[]>, resp: IRes) {
    try {
        const photoIds = req.body
        const delSql = `DELETE FROM mt_photos WHERE id IN (${photoIds});`
        const sql = `DELETE FROM mt_photos_order WHERE photo_id IN (${photoIds});`
        await batchExc([delSql, sql])
        resp.json(new SuccessResModel('删除成功'))
    } catch (err) {
        throw err
    }
}

export async function getTopPhoto(req: IReq, resp: IRes) {
    const sql = `
            SELECT 
                p.id AS id,
                p.photo_src AS photoSrc, 
                o.photo_order AS photoOrder,
                p.status,
                p.is_top AS isTop,
                p.create_time AS createTime
            FROM mt_photos p 
            JOIN mt_photos_order o ON p.id=o.photo_id
            WHERE p.is_top=1`
    const data = await exc(sql)
    if (data === void 0) {
        throw new ErrorResModel(StatusCode.FAIL, '获取失败')
    }
    const res = Array.prototype.slice.call(data)[0]
    resp.json(new SuccessResModel('操作成功', { records: res }))
}

async function countPhotos() {
    const sql = `SELECT COUNT(1) AS count FROM mt_photos;`
    const res = await exc(sql)
    return Array.prototype.slice.call(res)[0]['count']
}
