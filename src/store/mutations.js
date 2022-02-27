import {
  ADD_COUNTER,
  ADD_TO_CART
} from './mutation-types'

export default {
  // mutations唯一的目的就是修改state中的状态
  // mutations中的每个方法可能的完成的事件比较单一一点
  // addCart(state, payload) {
  //   // 1.payload新添加的商品（判断是否添加）
  //   // 数组函数常用的方法？ push/pop/unshift/shift/sort/reverse/map/filter/reduce/join
  //   // let oldProduct = null;
  //   // for(let item of state.cartList) {
  //   //   if(item.iid === payload.iid) {
  //   //     oldProduct = item;
  //   //   }
  //   // }

  //   // 1.查找之前数组中是否有该商品
  //   // let oldProduct = state.cartList.find(function (item) {
  //   //   return item.iid === payload.iid
  //   // })
  //   // 也可以写成箭头函数
  //   let oldProduct = state.cartList.find(item => item.iid === payload.iid)

  //   // 2.判断oldProduct是否有值
  //   if(oldProduct) {
  //     oldProduct.count += 1
  //   } else {
  //     payload.count = 1
  //     // 这里通过payload定义了count
  //     state.cartList.push(payload)
  //   }
  // }
  [ADD_COUNTER](state, payload) {
    payload.count++
  },
  [ADD_TO_CART](state, payload) {
    payload.checked = true
    state.cartList.push(payload)
  }
}