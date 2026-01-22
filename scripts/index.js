import { execSync } from 'child_process'

const loop = () => {
    console.log(`自动提交 ${new Date().toLocaleString()}`)

    execSync('git add .')
    execSync('git commit -m "自动提交"')

    // 执行 git push 命令
    execSync('git config --global http.proxy http://127.0.0.1:7897')
    execSync('git config --global https.proxy http://127.0.0.1:7897')
    execSync('git push github main')

    console.log('自动提交完成')
}

setInterval(() => {
    loop()
}, 1000 * 60 * 30)

loop()