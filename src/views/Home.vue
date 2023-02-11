<template>
  <div class="home"
       @click="enterFullScreen">
    <!-- <div class="bg-img" /> -->
    <!-- 选择游戏 -->
    <div v-show="showApp"
         class="app-panel">
      <div v-for="(i, index) in games"
           :key="i"
           class="common-app"
           @click.stop="selectGame(index)">
        <img src="/player1.jpeg" />
        <span>{{ i }}</span>
      </div>
    </div>

    <div v-show="!showApp"
         class="option-panel">
      <div class="common-btn"
           @click="randomQuestion">
        生成题目
      </div>
      <div class="common-btn"
           @click="generateNum">
        下发数字
      </div>
      <!-- 题目显示区域 -->
      <div class="topic-field">
        <div class="topic-box"
             @click="choose(0)">
          {{ question[0] }}
        </div>
        <div class="topic-box"
             @click="choose(1)">
          {{ question[1] }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs } from 'vue'
import HelloWorld from '@/components/HelloWorld.vue' // @ is an alias to /src
import router from '@/router'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'Home',
  components: {
    // HelloWorld,
  },
  setup () {
    const router = useRouter()
    const store = useStore()
    const state = reactive({
      games: ['谁是卧底', '狼人杀', '命悬一线', '剧本杀', '血染钟楼', '你画我猜', '阿瓦隆'],
      showApp: true,
      ws: null as any,
      question: [] as any,
    })
    // 1. 建立1个server页面对接，5个client页面，先2个
    // 2. 建立连接流程，完成后主控进入菜单栏，客户端打开加载卡背页
    // 3. 主控模拟菜单选择，进入命悬一线游戏，router
    // 4. 主控生成5个数字（1-100），分发到客户端
    // 5. 主控生成本轮话题，分发到客户端，同时展示在主控页面（规则说明）
    // 6. 玩家自行游戏
    // 7. 主控或1号机有扣血计分交互，分发状态到所有玩家
    // 8, 主控或1号机操作游戏成功失败，分发到所有玩家
    function connectWS (role: string) {
      const url = 'ws://192.168.31.95:8888'
      const connection = new WebSocket(url)

      connection.onopen = () => {
        connection.send('init ' + role)
      }

      connection.onerror = (error) => {
        console.log(`WebSocket error: ${error}`)
      }

      connection.onmessage = (e) => {
        console.log('msg from server:', e.data)
      }

      state.ws = connection
    }

    function initGame () {
      const route = useRoute()
      const role = route.query?.role as string
      if (role) {
        connectWS(role)
      }
    }

    function selectGame (index: number) { // 选择某个游戏
      router.push({ name: 'game' + index })
    }

    // todo: 允许用户选择
    function randomQuestion () { // 随机生成一道题目
      state.ws.send('choose -1')
      setTimeout(() => {
        const id = Math.floor(Math.random() * 10) // 随机生成10个数字
        state.question = store.state.questions[id]

        state.ws.send('set question ' + id) // 发送设置题目
        console.log('选择的题目 ', state.question) // 题目
      }, 100)
    }

    function generateNum () { // 触发下发数字
      state.ws.send('random')
      console.log('发送random命令')
    }

    function choose (num: number) { // 触发下发数字
      state.ws.send('choose ' + num)
      console.log('发送choose命令')
    }

    function enterFullScreen () {
      document.documentElement.requestFullscreen()
    }

    onMounted(() => {
      initGame()
      // 1. 打开开关，播放「开场动画」开始游戏，
      // 2. 播放背景音乐
      // 3. 打开开关，开始游戏，播放背景音乐

      // 回合开始
      // 4. 等待第一位玩家操作，接受到第一张OID卡，主题色改变（OID1-2: 蓝色， OID3-4: 红色）
      // 5. 显示卡牌动画、特效、音效，战斗力数值
      // 6. 切换到对方玩家回合，主题色改变，（OID1-2: 蓝色， OID3-4: 红色）
      // 7. 等待接受OID卡，显示
    })
    return {
      enterFullScreen,
      selectGame,
      choose,
      ...toRefs(state),
      generateNum,
      randomQuestion,
    }
  },
})
</script>
<style scoped lang="scss">
.home {
  .app-panel {
    width: 100%;
    // height: 100vh;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    // justify-content: center;
    padding-left: 20px;
    padding-top: 20px;
    box-sizing: border-box;
    // justify-content: space-around;
    .common-app {
      width: 64px;
      height: 96px;
      // flex: 1;
      box-sizing: border-box;

      overflow: hidden;
      margin-bottom: 20px;
      margin-right: 20px;
      &:nth{
        margin-left: 0;
      }
      &:nth-child(5){
        margin-left: 0;
      }
      img {
        width: 64px;
        height: 64px;
        border-radius: 10px;
        // height: 100%;
      }

    }
  }

  .option-panel {
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
    .common-btn {
      width: 100%;
      height: 30px;
      line-height: 30px;
      background: #fff;
      border: 1px solid #ccc;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    .topic-field { // 左右显示题目
      display: flex;
      margin-top: 20px;

      .topic-box {
        padding: 20px 0;
        flex: 1;
        width: 50%;
        text-align: center;
        background: #ccc;
        box-sizing: border-box;
      }
    }
  }
  .bg-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url(/card.jpeg);
    background-size: cover;
    background-position: 50% 50%;
  }
}
</style>
