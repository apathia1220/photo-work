enum StatusCode {
    // "操作成功"
    SUCCESS = 20000,

    // "系统异常"
    SYSTEM_ERROR = 50000,

    // "操作失败"
    FAIL = 51000,

    // "参数格式不正确"
    VALID_ERROR = 52000
}

export const StatusMsg = {
    20000: '操作成功',
    50000: '系统异常',
    51000: '操作失败',
    52000: '参数格式不正确'
}

export default StatusCode
