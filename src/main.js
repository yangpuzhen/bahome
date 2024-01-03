import './assets/index.css'
import '@arco-design/web-vue/dist/arco.css'

import 'pixi-spine' // Do this once at the very start of your code. This registers the loader!

import { createApp } from 'vue'
import { Modal } from '@arco-design/web-vue'
import ArcoVue from '@arco-design/web-vue'
import ArcoVueIcon from '@arco-design/web-vue/es/icon'
import App from './App.vue'
import { registerSW } from 'virtual:pwa-register'

const app = createApp(App)
app.use(ArcoVue)
app.use(ArcoVueIcon)

app.mount('#app')

if ('serviceWorker' in navigator) {
  const updateSW = registerSW({
    onNeedRefresh() {
      Modal.open({
        title: '通知',
        content: '老师，站点已更新，刷新即可访问最新内容！',
        onOk: () => {
          updateSW(true)
        }
      })
    }
  })
}

window.l2d_complete = false

setInterval(() => {
  document.querySelectorAll('a[href]:not(.tag)').forEach((link) => {
    link.classList.add('tag')
    link.addEventListener('click', async (e) => {
      const url = link.getAttribute('href')
      e.preventDefault()
      document.querySelector('#curtain').style.display = 'block'
      setTimeout(() => {
        let a = document.createElement('a')
        a.href = url
        a.target = '_blank'
        a.click()
      }, 900)
      setTimeout(() => (document.querySelector('#curtain').style.display = ''), 3000)
    })
  })
}, 1000)

import * as PIXI from 'pixi.js'
import { Spine } from 'pixi-spine'
import { sound } from '@pixi/sound'

const scale = 2.8

const l2d = new PIXI.Application({
  width: 1000 * scale,
  height: 720 * scale,
  backgroundAlpha: 0
})
document.querySelector('#background').appendChild(l2d.view)

let myVid = document.createElement('video')
let isSupp = myVid.canPlayType('audio/ogg; codecs="vorbis"')
let url

if (isSupp === '') {
  url = '/l2d/bgm.m4a'
} else {
  url = '/l2d/Theme_21.ogg'
}

PIXI.Assets.load('/l2d/CH0063_home.skel').then((resource) => {
  sound.add('bgm', {
    url: url,
    loop: true
  })

  window.l2d_complete = true

  const animation = new Spine(resource.spineData)
  l2d.stage.addChild(animation)

  if (animation.state.hasAnimation('Idle_01')) {
    animation.scale.set(0.3 * scale)
    animation.state.setAnimation(0, 'Idle_01', true)
    animation.state.timeScale = 1
    animation.autoUpdate = true
    animation.y = (((2568 + 1600) * 0.3) / 2) * scale
    animation.x = ((3462 * 0.3) / 2) * scale
  }
})
