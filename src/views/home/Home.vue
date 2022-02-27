<template>
  <div id="home">
    <nav-bar class="home-bar"><div slot="center">购物街</div></nav-bar>
    <tab-control :titles="['流行', '新款', '精选']" 
                  @tabClick="tabClick"
                  ref="tabControl1" 
                  class="tab-control"
                  v-show="isTabFixed"> </tab-control>
    <scroll class="content" 
    ref="scroll" 
    :probe-type="3" 
    @scroll="contentScroll"
    :pull-up-load="true"
    @pullingUp="loadMore">
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"></home-swiper>
      <recommend-view :recommends="recommends"></recommend-view>
      <feature-view></feature-view>
      <tab-control :titles="['流行', '新款', '精选']" 
                  @tabClick="tabClick"
                  ref="tabControl2"> </tab-control>
      <good-list :goods = "showGoods"></good-list>
    </scroll>

    
    <!-- 组件不可以直接监听点击，如果要组件监听点击，要在click后面加上.native 即如下写法：@click.native="backClick" -->
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
  </div>
</template>

<script>
import HomeSwiper from './childComps/HomeSwiper'
import RecommendView from './childComps/RecommendView'
import FeatureView from './childComps/FeatureView'

import NavBar from 'components/common/navbar/NavBar'
import TabControl from 'components/content/tabControl/TabControl'
import GoodList from 'components/content/goods/GoodList'
import Scroll from 'components/common/scroll/Scroll'

import {getHomeMultidata,  getHomeGoods} from "network/home";
import {debounce} from 'common/utils'
import {itemListenerMixin, backTopMixin} from 'common/mixin'


// import Swiper from 'components/common/swiper/Swiper';
// import SwiperItem from 'components/common/swiper/SwiperItem';
// 但由于在swiper文件夹下面通过index.js文件夹已经将Swiper，SwiperItem导出，因此写成下面的形式

export default {
  name: "Home",
  components: {
    HomeSwiper,
    RecommendView,
    FeatureView,
    NavBar,
    TabControl,
    GoodList,
    Scroll,
  },
  mixins: [itemListenerMixin, backTopMixin],
  data() {
    return {
      // result: null
      banners: [],
      recommends: [],
      goods: {
        'pop': {page: 0, list:[]},
        'new': {page: 0, list:[]},
        'sell': {page: 0, list:[]},
      },
      currentType: 'pop',
      tabOffsetTop: 0,
      isTabFixed: false,
      saveY: 0,
    }
  },
  destroyed() {
    console.log('home destroyed');
  },
  activated() {
    // console.log('activated');
    this.$refs.scroll.scrollTo(0, this.saveY, 0)
    this.$refs.scroll.refresh()
  },
  deactivated() {
    // console.log('deactivated');
    // 1.保存Y值
    this.saveY = this.$refs.scroll.getScrollY()
    // console.log(this.saveY);

    // 2.一旦发现离开首页，取消全局事件监听
    this.$bus.$off('itemImageLoad', this.itemImgListener)
  },
  computed: {
    showGoods() {
      return this.goods[this.currentType].list
    }
  },
  created() {
    // 1.请求多个数据
    this.getHomeMultidata()

    // 2.请求商品数据
    this.getHomeGoods('pop')
    this.getHomeGoods('new')
    this.getHomeGoods('sell')
  },
  mounted() {
     // 1.监听item中图片加载完成
    // const refresh = debounce(this.$refs.scroll.refresh, 500)

    // 对监听的事件进行保存
    // this.itemImgListener = () => {
    //   refresh()
    // }
    // this.$bus.$on('itemImageLoad', this.itemImgListener
      // console.log('------'); 
      // this.$refs.scroll.refresh()
    // )
    // 2.获取tabControl的offsetTop
    // 组件没有offsetTop属性
    // console.log(this.$refs.tabControl.offsetTop);     //undefined
    // 所有组件中都有一个属性$el: 用于获取组件中的元素
    // console.log(this.$refs.tabControl.$el.offsetTop);
    // this.tabOffsetTop = this.$refs.TabControl.offsetTop
  },

  methods: {
    /**
     * 事件监听相关的方法
     */

    tabClick(index) {
      // console.log(index);
      switch(index) {
        case 0:
          this.currentType = 'pop'
          break
        case 1:
          this.currentType = 'new'
          break
        case 2:
          this.currentType = 'sell'
          break
      }
      // 让两个TabControl的currentIndex保持一致
      this.$refs.tabControl1.currentIndex = index;
      this.$refs.tabControl2.currentIndex = index;

    },

    contentScroll(position) {
      // 1.判断BackTop是否显示
      // this.isShowBackTop = (-position.y) > 1000
      this.listenShowBackTop(position)


      // 2.决定tabControl是否吸顶(是否给这个属性position:fixed)
      this.isTabFixed = (-position.y) > this.tabOffsetTop
    },
    
    loadMore() {
      // console.log('加载更多');
      this.getHomeGoods(this.currentType)
    },

    swiperImageLoad() {
      // console.log(this.$refs.tabControl2.$el.offsetTop);
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
    },
    
    /**
     * 网络请求相关的方法
     */
    getHomeMultidata() {
      getHomeMultidata().then(res => {
      // console.log(res);
      // this.result = res;
      // 这里的this是指外面的整个对象，一次可以拿到data里面的result
      // 将res存储到result里面，使res里的数据不会被垃圾回收
      this.banners = res.data.banner.list;
      this.recommends = res.data.recommend.list;
      })
    },
    getHomeGoods(type,) {
      const page = this.goods[type].page + 1
      getHomeGoods(type,page).then(res => {
      // console.log(res);
      this.goods[type].list.push(...res.data.list)
      this.goods[type].page += 1
    // 上拉加载更多默认加载一次
    // 在完成上拉加载更多后，调用finishPullUp函数
      this.$refs.scroll.finishPullUp()
    })
    }
  }
}


</script>

<style scoped>
  #home {
    padding-top: 44px;
    /* vh:视口高度 */
    height: 100vh;
    position: relative;
  }

  .home-bar {
    background-color: var(--color-tint);
    color: #fff;

    /* 将导航栏固定不动 */
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 9;
  }

/* 吸顶功能:已经不起作用了 */
  /* .tab-control {
    position: sticky;
    top: 44px;
    z-index: 9;
  } */

  .content {
    /* height: 400px; */
    overflow: hidden;

    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }

  .tab-control {
    position: relative;
    z-index: 9;
  }
  /* .content { */
    /* height: 400px;  */
    /* height: calc(100% - 93px);
    overflow: hidden;
    margin-top: 44px;
  } */
</style>