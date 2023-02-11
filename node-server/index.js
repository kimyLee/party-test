const { generate } = require('@vue/compiler-core')
const WebSocket = require('ws')

const wss = new WebSocket.Server({ port: 8888 })

const userConnect = [null, null, null, null, null] // 暂时最多5个人 + 1个主控
let mainConnect = null // 暂时最多5个人 + 1个主控
wss.on('connection', ws => {
  ws.on('message', (data, isBinary) => {
    const message = isBinary ? data : data.toString()
    console.log(`Received message => ${message}`)
    switch (message) {
      case 'init main':
        ws.connectName = 'main'
        mainConnect = ws
        console.log('主机已连接')
        break
      case 'init player1':
        ws.connectName = 'player1'
        userConnect[0] = ws
        console.log('player1已连接')
        break
      case 'init player2':
        ws.connectName = 'player2'
        userConnect[1] = ws
        console.log('player2已连接')
        break
      case 'init player3':
        ws.connectName = 'player3'
        console.log('player3已连接')
        userConnect[2] = ws
        break
      case 'init player4':
        ws.connectName = 'player4'
        console.log('player4已连接')
        userConnect[3] = ws
        break
      case 'init player5':
        ws.connectName = 'player5'
        console.log('player5已连接')
        userConnect[4] = ws
        break

      case 'start 1': // 开始，客户端显示准备进入游戏「命悬一线」
        if (ws.connectName === 'main') {
          broadcast(message)
        }
        break

      // case 'question': // 开始分配题目ID, 客户端接收并显示题目
      //   if (ws.connectName === 'main') {
      //     const num = Math.floor(Math.random() * 10) // 0 - 9
      //     console.log('生成题目', num)
      //     userConnect.forEach((item, index) => {
      //       item && item.send('question ' + num) // 考虑掉线情况
      //     })
      //   }
      //   break
      case 'random': // 开始分配数字, 客户端接收并显示数字
        if (ws.connectName === 'main') {
          const arr = generateNum()
          console.log('生成数字', arr)
          userConnect.forEach((item, index) => {
            item && item.send('number ' + arr[index]) // 考虑掉线情况
          })
        }
        break
      default:
        break
    }
    if (message.indexOf('set life') >= 0) {
      const life = message.replace('set life ', '') - 0
      console.log('设置的血量 ', life) // 血量值
      broadcast(message) // 广播血量值
    }
    if (message.indexOf('set question') >= 0) {
      const id = message.replace('set question ', '') - 0
      console.log('选择的题目 ', id) // 血量值
      broadcast(message) // 广播血量值
    }
    if (message.indexOf('choose') >= 0) {
      const num = message.replace('choose ', '') - 0
      console.log('选择的AB ', num) // 血量值
      broadcast(message) // 广播血量值
    }
  })
  ws.send('Hello! Message From Server!!')
  ws.addEventListener('close', (event) => {
    console.log('The connection has been closed successfully.')
    if (ws.connectName) {
      console.log(ws.connectName, '已掉线')
    }
  })
})

function broadcast (cmd) {
  userConnect.forEach(item => {
    item && item.send(cmd) // 考虑掉线情况
  })
}

// 游戏逻辑，生成 1-100的5个不重复数字
function generateNum () {
  const arr = []
  while (arr.length < 5) {
    const item = Math.floor(Math.random() * 100)
    if (arr.indexOf(item) === -1) {
      arr.push(item)
    }
  }
  return arr
}

console.log('server is running···')
