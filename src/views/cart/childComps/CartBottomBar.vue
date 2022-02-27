<template>
  <div class="bottom-bar">

    <div class="check-content">
      <check-button 
      :is-checked="isSelectAll" 
      class="check-button" 
      @click.native="checkClick">
      </check-button>
      <span>全选</span>
    </div>

    <div class="total-price">
      合计: {{totalPrice}}
    </div>

    <div class="calculate" @click="calcClick">
      去计算({{checkLength}}) 
    </div>
  </div>
</template>

<script>
import CheckButton from 'components/content/checkButton/CheckButton'

import { mapGetters } from 'vuex'

export default {
  name: "CartBottomBar",
  components: {
    CheckButton,
  },
  computed: {
    ...mapGetters(['cartList']),
    totalPrice() {
      return '￥' + this.cartList.filter(item => {
        return item.checked
      }).reduce((preValue, item) => {
        return preValue + item.price * item.count
      }, 0).toFixed(2)
    },
    checkLength() {
      return this.cartList.filter(item => item.checked).length
    },
    isSelectAll() {
      if (this.cartList.length === 0) return false

      // 运用数组的高阶函数实现全选功能
      // 1.使用filter
      // return !(this.cartList.filter(item => !item.checked).length)

      // 2.使用find函数
      return !this.cartList.find(item => !item.checked)

      // 3.利用遍历实现全选功能
      // for (let item of this.cartList) {
      //   if(!item.checked) {
      //     return false
      //   }
      // }
      // return true

    }
  },
  methods: {
    checkClick() {
      if(this.isSelectAll) { //此时是全部选中的，点击后要变成全部补选中
        this.cartList.forEach(item => item.checked = false)
      } else { //有部分或全部不选中，点击后全部选中
        this.cartList.forEach(item => item.checked = true)
      }

      // this.cartList.forEach(item => item.checked = !this.isSelectAll)
      // 不可以这样做简化

    },
    calcClick() {
      if (!this.isSelectAll) {
        this.$toast.show('请选择购买的商品', 2000)
      }
    }


  }
}
</script>

<style scoped>
  .bottom-bar {
     position: relative;
    /* bottom: 40px; */
    display: flex;

    height: 40px;
    line-height: 40px;

    background-color: #eee;

    font-size: 14px;
  }

  .check-content {
    display: flex;
    align-items: center;
    /* 垂直居中 */
    margin-left: 10px;
    width: 60px;
  }

  .check-button {
    width: 20px;
    height: 20px;
    line-height: 20px;
    margin-right: 5px;
  }

  .total-price {
    margin-left: 20px;
    flex: 1;
  }

  .calculate {
    width: 90px;
    background-color: red;
    color: #fff;
    text-align: center;
  }
</style>