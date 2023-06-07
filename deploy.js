import childProcess from 'child_process'
import path from 'path'
import { Client as uploadClient } from 'node-scp'
import { Client as sshClient } from 'ssh2'
import chalk from 'chalk'
import ora from 'ora'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config()

// SSH连接配置
const sshConfig = {
    host: process.env.HOST || '127.0.0.1',
    port: process.env.SSHPORT || 22,
    username: process.env.USERNAME || 'root',
    password: process.env.PASSWD || '123456'
};

const __filename = fileURLToPath(import.meta.url);
const localPath = dirname(__filename);
const remotePath = '/usr/local/mihoyo'

const deployType = process.argv.slice(2)[0] || 'all'

const spinner = ora(chalk.green('正在部署项目到服务器...'));

const buildView = (projectName) => { 
    return new Promise((resolve, reject) => {
        const buildPrcoess = childProcess.exec(`cd ${localPath}/${projectName} && pnpm build`, (err, stdout, stderr) => {
            if (err) {
                reject(err)
                spinner.fail(chalk.red(`${projectName}打包失败`))
            }
        })
        buildPrcoess.on('exit', () => {
            resolve()
            spinner.succeed(chalk.green(`${projectName}打包成功`))
        })
    })
}

const buildServer = () => {
    return new Promise((resolve, reject) => { 
        const buildPrcoess = childProcess.exec(`cd ${localPath}/server && yarn build`, (err, stdout, stderr) => {
            if (err) {
                reject(err)
                spinner.fail(chalk.red(`服务端打包失败`))
            }
        })
        buildPrcoess.on('exit', () => {
            resolve()
            spinner.succeed(chalk.green(`服务端打包成功`))
        })
    })
}

const build = async () => {
    let buildList = []
    if (deployType === 'view') {
        buildList.push(buildView('photo'))
    } else if (deployType === 'admin') {
        buildList.push(buildView('admin'))
    } else if (deployType === 'server') {
        buildList.push(buildServer())
    }
    else {
        buildList = [buildView('admin'), buildView('photo'), buildServer()]
    }
    try { 
        const buildSpinner = ora(chalk.cyanBright('正在打包文件......'))
        buildSpinner.start()
        spinner.info(chalk.yellow('项目开始打包....'))
        await Promise.all(buildList)
        buildSpinner.succeed(chalk.green('所有项目打包完成'))
        buildSpinner.stop()
    } catch (err) {
        console.error(err)
    }
}

const uploadDir = async (client, localName, remoteName) => {
    try { 
        const localDir = path.join(localPath, localName)
        const remoteDir = path.join(remotePath, remoteName)
        await client.uploadDir(localDir, remoteDir)
        spinner.succeed(chalk.green(`${localName.split('/')[1]}上传成功`))
    } catch (err) {
        throw new Error(chalk.red(`${localName.split('/')[1]}上传失败`))
    }
}

const upload2Remote = async () => {
    try {
        const client = await uploadClient(sshConfig)
        const uploadSpinner = ora(chalk.cyanBright('正在上传文件到服务器......'))
        uploadSpinner.start()
        spinner.info(chalk.yellow('项目文件开始上传'))
        if (deployType === 'view') {
            await uploadDir(client, '/photo/dist', '/test/photo')
        } else if (deployType === 'admin') {
            await uploadDir(client, '/admin/dist', '/test/admin')
        } else if (deployType === 'server') {
            await uploadDir(client, '/server/dist', '/test/server')
        }
        else {
            await uploadDir(client, '/photo/dist', '/test/photo')
            await uploadDir(client, '/admin/dist', '/test/admin')
            await uploadDir(client, '/server/dist', '/test/server')
        }
        uploadSpinner.succeed(chalk.green('文件上传成功'))
        uploadSpinner.stop()
        client.close()
    } catch (err) {
        spinner.stop()
        console.error(err)
    }
}

const conn = new sshClient()

const remoteRunCmd = async(cmd) => {
  cmd = `${cmd}\nexit\n`
  return new Promise((resolve, reject) => {
    let outData = ``
    conn.on(`ready`, () => {
      conn.shell((err, stream) => {
        if (err) {
          return reject(err)
        }
        stream.on(`close`, () => {
            conn.end()
            resolve(outData)
        }).on(`data`, (data) => {
            outData = outData + data
            process.stdout.write(data)
        })
        stream.end(cmd)
      })
    }).connect(sshConfig)
  })
}

const ssh2Cmd = async () => {
    let cmdStr = ''
    if (deployType === 'server' || deployType === 'all') {
        // 重新创建server docker
        cmdStr += `sh ${remotePath}/docker/restart-server.sh;`
    }
    if (deployType !== 'server') {
        // 重启nginx
        cmdStr += `sh ${remotePath}/docker/restart-nginx.sh`
    }
    const dockerSpinner = ora(chalk.cyanBright('正在重新更新资源并重启服务......'))
    dockerSpinner.start()
    await remoteRunCmd(cmdStr)
    spinner.succeed(chalk.green('服务重启成功'))
    dockerSpinner.stop()
}

(async () => {
    spinner.start()
    // 打包文件
    await build()
    // 上传文件
    await upload2Remote()
    // 重启docker
    await ssh2Cmd()
    spinner.succeed(chalk.green('项目部署完成'))
    spinner.stop()
})()