<template>
<!-- ref 通常用于子组件，并且div这种普通标签也可以绑定ref属性，使用ref属性可以明确的拿到某一个元素 -->

<!-- ref如果是绑定在组件中的，那么通过this.$refs.refname获取到的是一个组件对象 -->
<!-- ref如果是绑定在普通元素中的，那么通过this.$refs.refname获取到的是一个元素对象 -->

  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'
  export default {
    name: "Scroll",
    props: {
      probeType: {
        type: Number,
        default: 0
      },
      pullUpLoad: {
        type:Boolean,
        default:false
      }
    },
    data() {
      return {
        scroll: null
      }
    },
    mounted() {
      // 1.创建BScroll对象
      this.scroll = new BScroll(this.$refs.wrapper, {
        click: true,
        probeType:this.probeType,
        pullUpLoad: this.pullUpLoad
      })

      // 2.监听滚动的位置
      if (this.probeType === 2 || this.probeType === 3) {
        this.scroll.on('scroll', (position) => {
        // 将position传出去 ,scroll为自定义事件，在哪里需要用，通过@scroll即可使用
          this.$emit('scroll', position);
         })
      }
      // console.log(this.scroll);
      // this.scroll.refresh()
      /** 解决首页中Better-Scroll中可滚动区域的问题
      Better-Scroll在决定有多少区域可以滚动时，是根据scrollerHeight属性决定的
      scrollerHeight属性是根据放在Better-Scroll的content中的子组件的高度决定的
      但是我们打的首页中，刚开始在计算scrollerHeight属性时，是没有将图片计算在内的
      所以，一开始计算出来的高度时错误的，但是后来图片加载出来之后有了新的高度，但是scrollerHeigh属性并没有更新，所以滚动出现了问题 
      如何解决这个问题？
      监听每一张图片是否加载完成，只要有一张图片加载完成了，就执行一次refresh()
      */   


      // 3.监听上拉加载事件(监听滚动到底部)
      if (this.pullUpLoad) {
        this.scroll.on('pullingUp', () => {
          // console.log('监听到滚动到底部');
          this.$emit('pullingUp')
        })
      }
    },
    methods: {
      scrollTo(x, y, time=300) {
        this.scroll && this.scroll.scrollTo(x, y, time)
      },
      refresh() {
        // console.log('-------');
        this.scroll && this.scroll.refresh()
      },
      finishPullUp() {
        this.scroll && this.scroll.finishPullUp()
      },
      getScrollY() {
        return this.scroll ? this.scroll.y : 0
      }
    }
  }
</script>

<style>

</style>