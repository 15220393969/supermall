import {debounce} from 'common/utils'
import BackTop from 'components/content/backTop/BackTop'


export const itemListenerMixin = {
  data() {
    return {
      itemImgListener: null,
      refresh: null
    }
  },
  mounted() {
    this.refresh = debounce(this.$refs.scroll.refresh, 500)

    this.itemImgListener = () => {
      this.refresh()
    }

    this.$bus.$on('itemImgLoad', this.itemImgListener)
    // console.log('我是混入中的内容');
  },
} 

export const backTopMixin = {
  components: {
    BackTop
  },
  data() {
    return {
      isShowBackTop: false,
    }
  },
  methods: {
    backClick() {
      this.$refs.scroll.scrollTo(0,0)
      // 在500ms内回到0，0位置
    },
    listenShowBackTop(position) {
      this.isShowBackTop = (-position.y) > 1000
    }
  }
}