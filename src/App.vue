<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-11 17:37:49
 * @LastEditTime: 2019-09-19 13:40:18
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div id="app" class="full">
    <transition :name="transitionName">
        <router-view/>
    </transition>
  </div>
</template>

<style lang="scss">
@import '~@/assets/style/common.scss';
</style>

<script>
import router from './router'
export default {
  data() {
    return {
      transitionName: ''
    }
  },
  watch: {
    $route(to, from) {
      // console.log(to, from)
      if (to.meta.isslide && from.meta.isslide) {
        const toDepth = to.path.split('/').length
        const fromDepth = from.path.split('/').length
        // console.log(to.path, from.path)
        this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
      }
    }
  },
  router
}
</script>
