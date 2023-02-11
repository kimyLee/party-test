<template>
  <div class="home">
    <div class="back-btn"
         @click="goBack">
      Back
    </div>
    <!-- <img class="bg"
         src="/BG.jpeg" /> -->
    <div :class="playerRole"
         class="bg-img player1"
         @click="enterFullScreen" />
    <div class="topic-field">
      <!-- 题目A -->
      <div :class="{ 'hidden': questionType === 1 }"
           class="topic-box top">
        您本局的身份是<br />
        <!-- <span class="sub">{{ subQuestion[0] }}</span> -->
      </div>
      <!-- 题目B -->
      <div :class="{ 'hidden': questionType === 0 }"
           class="topic-box bottom">
           <!-- 法拉第<br /> -->
           <!-- <span class="sub">{{ subQuestion[1] }}</span> -->
      </div>
    </div>
    <!-- <div class="show-num">
      {{ num }}
    </div> -->
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
    const state = reactive({
      num: '',
      question: [] as any,
      subQuestion: [] as any,
      questionType: -1,
      playerRole: '',
    })
    const store = useStore()
    // 1. 建立1个server页面对接，5个client页面，先2个
    // 2. 建立连接流程，完成后主控进入菜单栏，客户端打开加载卡背页
    // 3. 主控模拟菜单选择，进入命悬一线游戏，router
    // 4. 主控生成5个数字（1-100），分发到客户端
    // 5. 主控生成本轮话题，分发到客户端，同时展示在主控页面（规则说明）
    // 6. 玩家自行游戏
    // 7. 主控或1号机有扣血计分交互，分发状态到所有玩家
    // 8, 主控或1号机操作游戏成功失败，分发到所有玩家
    function connectWS (role: string) {
      // const url = 'ws://192.168.1.190:8888'
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
        // 需要素材：1. 页面卡背占位图  2. 加载游戏弹窗  3. 游戏背景  4. 玩法规则介绍弹窗 5.字体  6.数字字体， 7 血量标志
        // 游戏胜利图片、游戏失败图片
        // 响应进入游戏：
        const message = e.data
        switch (message) {
          case 'start 1': // 进入游戏
            console.log('进入游戏，显示弹窗')
            break
          // case 'start 1': // 进入游戏
          //   console.log('进入游戏，显示弹窗')
          //   break
          default:
            break
        }
        if (message.indexOf('set question') >= 0) {
          const id = message.replace('set question ', '') - 0
          state.question = store.state.questions[id]
          state.subQuestion = store.state.subQuestion[id]
          console.log('选择的题目 ', state.question) // 题目
        }
        if (message.indexOf('number') >= 0) {
          // state.num = message.replace('number ', '') - 0

          console.log('分配的数字 ', state.num) // 题目
        }
        if (message.indexOf('choose') >= 0) {
          const num = message.replace('choose ', '') - 0
          console.log('选择的AB ', num) // 血量值
          state.questionType = num
        }
      }
    }

    function initGame () {
      const id = Math.floor(Math.random() * 10)
      state.question = store.state.questions[id]
      state.subQuestion = store.state.subQuestion[id]
      console.log('选择的题目 ', state.question) // 题目

      const word = ['法拉第', '卡坦岛', '画蛇添足', '丘比特', '百事可乐']
      state.num = word[Math.floor(Math.random() * word.length)]
    }

    function enterFullScreen () {
      document.documentElement.requestFullscreen()
    }

    onMounted(() => {
      setTimeout(() => {
        initGame()
      }, 1500)

      // 1. 打开开关，播放「开场动画」开始游戏，
      // 2. 播放背景音乐
      // 3. 打开开关，开始游戏，播放背景音乐

      // 回合开始
      // 4. 等待第一位玩家操作，接受到第一张OID卡，主题色改变（OID1-2: 蓝色， OID3-4: 红色）
      // 5. 显示卡牌动画、特效、音效，战斗力数值
      // 6. 切换到对方玩家回合，主题色改变，（OID1-2: 蓝色， OID3-4: 红色）
      // 7. 等待接受OID卡，显示
    })

    function goBack () {
      router.push({ name: 'Home' })
    }

    return {
      goBack,
      enterFullScreen,
      ...toRefs(state),
    }
  },
})
</script>
<style scoped lang="scss">
.home {
  .bg {
    opacity: .2;
    position: absolute;
    width: 100%;
    height: 100%;
  }

  // background-image: url(/BG.jpeg);
  // // opacity: .1;
  // background-size: cover;
  // background-position: 50% 50%;
}

.bg-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  // background-image: url(/card.jpeg);
  background-size: cover;
  background-position: 50% 50%;

  &.player1 {
    background-image: url(/player1.jpeg);
  }

  &.player2 {
    background-image: url(/player2.jpeg);
  }

  &.player3 {
    background-image: url(/player3.jpeg);
  }

  &.player4 {
    background-image: url(/player4.jpeg);
  }

  &.player5 {
    background-image: url(/player5.jpeg);
  }
}

.topic-field {
  // 左右显示题目
  display: flex;
  margin-top: 20px;
  flex-wrap: wrap;
  font-size: 24px;

  .topic-box {
    position:absolute;
    top: 30px;
    left: 30px;
    color: #fff;
    padding: 20px 40px;
    width: 100%;
    text-align: center;
    // background: #ccc;
    box-sizing: border-box;
    transition: all 1s;
    font-size: 40px;

    .sub {
      font-size: 14px;
    }

    &.hidden {
      opacity: 0;
    }

    &.top {
      text-align: left;
      margin-bottom: 20px;
    }

    &.bottom {
      text-align: right;
    }
  }
}

.show-num {
  margin-top: 70px;
  font-size: 80px;
}
</style>
