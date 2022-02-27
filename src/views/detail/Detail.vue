<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"></detail-nav-bar>
    <scroll class="content" 
            ref="scroll" 
            :probe-type="3" 
            @scroll="contentScroll">
      <!-- 属性：topImages 传入值：top-images -->
      <!-- <ul>
        <li v-for="(item,index) in $store.state.cartList" :key="index">
          {{item}}
        </li>
      </ul> -->
      <detail-swiper :top-images="topImages"></detail-swiper>
      <detail-base-info :goods="goods"></detail-base-info>
      <detail-shop-info :shop="shop"></detail-shop-info>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"></detail-goods-info>
      <detail-param-info ref="params" :param-info="paramInfo"></detail-param-info>
      <detail-comment-info ref="comment" :comment-info="commentInfo"></detail-comment-info>
      <goods-list ref="recommend" :goods="recommends"></goods-list>
    </scroll>
    <detail-bottom-bar @addCart="addToCart"></detail-bottom-bar>
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
    <!-- <toast :message="message" :show="show"></toast> -->
  </div>
</template>
 
<script>
import DetailNavBar from './childComps/DetailNavBar'
import DetailSwiper from './childComps/DetailSwiper'
import DetailBaseInfo from './childComps/DetailBaseInfo'
import DetailShopInfo from './childComps/DetailShopInfo'
import DetailGoodsInfo from './childComps/DetailGoodsInfo'
import DetailParamInfo from './childComps/DetailParamInfo'
import DetailCommentInfo from './childComps/DetailCommentInfo'
import DetailBottomBar from './childComps/DetailBottomBar'

import Scroll from 'components/common/scroll/Scroll'
import GoodsList from 'components/content/goods/GoodList'
// import Toast from 'components/common/toast/Toast'


import {getDetail, Goods, Shop, GoodsParam, getRecommend} from 'network/detail'
import {debounce} from 'common/utils'
import {itemListenerMixin, backTopMixin} from 'common/mixin'

import { mapActions } from 'vuex'

export default {
  name: "Detail",
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailBottomBar,
    Scroll,
    GoodsList,
    // Toast,
  },
  mixins: [itemListenerMixin, backTopMixin],
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      themeTopYs:[],
      getThemeTopY: null,
      currentIndex: 0,
      // message: '',
      // show: false
    }
  },
  created() {
    // 1.保存传入的iid
    // console.log(this.$route.params);
    this.iid = this.$route.params.iid

    // 2.根据iid请求详情数据
    getDetail(this.iid).then(res => {
      // 1.获取顶部的图片轮播图数据
      // console.log(res);
      const data = res.result
      this.topImages = data.itemInfo.topImages

      // 2.获取商品信息
      this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)
      
      // 3.创建店铺信息
      this.shop = new Shop(data.shopInfo)

      // 4.保存商品的详情数据
      this.detailInfo = data.detailInfo;

      // 5.获取参数的信息
      this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)

      // 6.取出评论信息
      if(data.rate.cRate !== 0) {
        this.commentInfo = data.rate.list[0]
      }

      // 第一次获取，值不对
      // 值不对的原因：this.$refs.params.$el压根没有渲染
      // this.themeTopYs = [],
      // this.themeTopYs.push(0);
      // // this.themeTopYs.push(参数的offsetTop);
      // this.themeTopYs.push(this.$refs.params.$el.offsetTop);
      // // this.themeTopYs.push(评论的offsetTop);
      // this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      // // this.themeTopYs.push(推荐的offsetTop);
      // this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);

      // console.log(this.themeTopYs);


      // 第二次获取：值不对
      // 值不对的原因，图片没有计算在内，图片没有加载完毕
      // 根据最新的数据，对应的DOM是已经被渲染出来
      // 但是图片依然是没有加载完（目前获取的offsetTop不包含其中的图片）
      // offsetTop值不对的时候，都是因为图片的问题
      // this.$nextTick(() => {
        
      //   this.themeTopYs = [],
        
      //   this.themeTopYs.push(0);
      //   // this.themeTopYs.push(参数的offsetTop);
      //   this.themeTopYs.push(this.$refs.params.$el.offsetTop);
      //   // this.themeTopYs.push(评论的offsetTop);
      //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      //   // this.themeTopYs.push(推荐的offsetTop);
      //   this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);

      //   console.log(this.themeTopYs);
      // });
    })

    // 3.请求推荐数据
    getRecommend().then(res => {
      // console.log(res);
      this.recommends = res.data.list
    })

    // 4.给getThemeTopY赋值
    // this.getThemeTopY= debounce(() =>  {
    //   // 使用防抖，保证不会被调用很多次
    //   this.themeTopYs = [],
    //   this.themeTopYs.push(0);
    //   // this.themeTopYs.push(参数的offsetTop);
    //   this.themeTopYs.push(this.$refs.params.$el.offsetTop);
    //   // this.themeTopYs.push(评论的offsetTop);
    //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
    //   // this.themeTopYs.push(推荐的offsetTop);
    //   this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);

    //   console.log(this.themeTopYs);
    // },100)

  },
  methods: {
    ...mapActions(['addCart']),

    // 监听详情的图片的加载
    imageLoad() {
      this.refresh()
      // this.$refs.scroll.refresh()

      this.themeTopYs = [],
      this.themeTopYs.push(0);
      // this.themeTopYs.push(参数的offsetTop);
      this.themeTopYs.push(this.$refs.params.$el.offsetTop);
      // this.themeTopYs.push(评论的offsetTop);
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      // this.themeTopYs.push(推荐的offsetTop);
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
      // 最大值
      this.themeTopYs.push(Number.MAX_VALUE)

      console.log(this.themeTopYs);
      // // 这里只调用一次是因为前面DetailGoodsInfo子组件里面设置了只进行一次抛出
      // 也可以采取防抖的方法，让其只调用一次

      // 防抖的方式
      // this.getThemeTopY()
    },
    titleClick(index) {
      // console.log(index);
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 200)
    },
    contentScroll(position) {
      // console.log(position);
      // 1.获取y值
      const positionY = -position.y

      // 2.将positionY和主题中的值进行对比
      // [0, 9303, 10045, 10242, Number.MAX_VALUE]
      // console.log(Number.MAX_VALUE);

      // positionY在 0 和 9303 之间，index = 0
      // positionY在 9303 和 10045 之间， index = 1
      // positionY在 10045 和 10242 之间， index = 2
      // positionY在 10045 和 非常大的值（无穷大）之间， index = 3

      // positionY超过 10242 ， index = 3

      let length = this.themeTopYs.length
      // for(let i in this.themeTopYs) {
      for(let i = 0; i < length-1; i++) {
        // console.log(i); 
        // for(let i in this.themeTopYs)这里拿到的i是字符串str类型，i+1之后会变成01，11，21，31是不对的
      // 需要将i转换为数字类型，或者for语句用回最平常的方式就是for(let i = 0; i < this.themeTopYs.length; i++),这样拿到的i就是数字类型
      // 将i转换为数字类型，将 i*1 或者 parseInt(i)
        // parseInt(i)
        // if(positionY > this.themeTopYs[i] && positionY < this.themeTopYs[i+1]) {
        //   console.log(i);
        // }
        if (this.currentIndex !== i && (positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1])) {
          this.currentIndex = i;
          // console.log(this.currentIndex);
          this.$refs.nav.currentIndex = this.currentIndex
        }
        
        // 有bug，不能滚动了
        // if (this.currentIndex !== i && ((i < length - 1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1]) || (i = length - 1 && positionY >= this.themeTopYs[i]))) {
        //   this.currentIndex = i;
        //   console.log(this.currentIndex);
        //   this.$refs.nav.currentIndex = this.currentIndex
        // }
      }

      // 3.是否显示回到顶部
      // this.isShowBackTop = (-position.y) > 1000
      this.listenShowBackTop(position)
    },
    addToCart() {
      // console.log('----------');
      // 1.获取购物车需要展示的信息
      const product = {};
      product.image = this.topImages[0];
      product.title = this.goods.title;
      product.desc = this.goods.desc;
      product.price = this.goods.realPrice;
      product.iid = this.iid;

      // 2.将商品添加到购物车里面(1.Promise 2.mapActions)
      // this.$store.cartList.push(product)不可以这样做，修改任何state里面的东西都要通过mutation修改state里面的数据
      // 在mutations里面
      // this.$store.commit('addCart', product)
      // 在action里面
     
    //  this.$store.dispatch('addCart', product).then(res => {
    //     console.log(res);
    //   })

      this.addCart(product).then(res => {
        // this.show = true;
        // this.message = res;

        // setTimeout(() => {
        //   this.show = false;
        //   this.message = ''
        // },1500)

        // console.log(this.$toast);
        this.$toast.show(res, 2000)

      })

    }
  },
  mounted() {
    // console.log('mounted');
  },
//   updated() {
//     this.themeTopYs = [],
//     this.themeTopYs.push(0);
//     // this.themeTopYs.push(参数的offsetTop);
//     this.themeTopYs.push(this.$refs.params.$el.offsetTop);
//     // this.themeTopYs.push(评论的offsetTop);
//     this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
//     // this.themeTopYs.push(推荐的offsetTop);
//     this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);

//     console.log(this.themeTopYs);
// },
  destroyed() {
    this.$bus.$off('itemImgLoad', this.itemImgListener)
  }

}
</script>

<style scoped>
  #detail {
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }

  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }

  .content {
    height: calc(100% - 44px - 58px);
  }

</style>