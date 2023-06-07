import logger from 'jet-logger'
import mysql from 'mysql2/promise'
import { QueryOptions, ResultSetHeader } from 'mysql2'
import { MYSQL_CONF } from '@src/config/config.database'

export const exc = async (sql: string, opt?: Omit<QueryOptions, 'sql'>) => {
    try {
        const conn = mysql.createConnection(MYSQL_CONF)
        const [rows, _] = await (await conn).query({ sql, ...opt })
        return rows
    } catch (err) {
        logger.err(err, true)
    }
}

export const batchExc = async (sqlList: string[], opt?: Omit<QueryOptions, 'sql'>) => {
    const conn = mysql.createConnection(MYSQL_CONF)
    const connection = await conn
    try {
        await connection.beginTransaction() // 开始事务
        for (const sql of sqlList) {
            await connection.query({ sql, ...opt })
        }
        await connection.commit()
    } catch (err) {
        await connection.rollback() // 回滚事务
        logger.err('事务回滚')
        throw err // 抛出错误
    }
}

export const doubleBatchExc = async (
    sqlList: Array<[string, (insertId: number) => string]>,
    opt?: Omit<QueryOptions, 'sql'>
) => {
    const conn = mysql.createConnection(MYSQL_CONF)
    const connection = await conn
    try {
        await connection.beginTransaction() // 开始事务
        for (const [sql1, fn] of sqlList) {
            const [rows, _] = await connection.query(sql1, opt)
            const insert = rows as ResultSetHeader
            const sql2 = fn(insert.insertId)
            await connection.query(sql2, opt)
        }
        await connection.commit()
    } catch (err) {
        await connection.rollback() // 回滚事务
        logger.err('事务回滚')
        throw err // 抛出错误
    }
}
