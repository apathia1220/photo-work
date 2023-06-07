/**
 * Miscellaneous shared classes go here.
 */

import HttpStatusCodes from '@src/constants/HttpStatusCodes'
import StatusCode, { StatusMsg } from '@src/constants/StatusCode'

export class BaseResModel {
    [x: string]: string | number | object | boolean | null
    constructor(code: StatusCode, message: string | null, flag: boolean) {
        this.code = code
        if (message) {
            this.message = message
        }
        this.flag = flag
    }
}

export class ErrorResModel extends BaseResModel {
    constructor(code: StatusCode, message: string | null) {
        super(code, message, false)
    }
}

export class SuccessResModel extends BaseResModel {
    constructor(message: string | null, data?: object | string | null) {
        super(StatusCode.SUCCESS, StatusMsg[StatusCode.SUCCESS], true)
        this.data = data ? data : null
        this.message = message ? message : '操作成功'
    }
}

/**
 * Error with status code and message
 */
export class RouteError extends Error {
    status: HttpStatusCodes
    constructor(status: HttpStatusCodes, message: string) {
        super(message)
        this.status = status
    }
}
