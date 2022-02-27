import {
  ADD_COUNTER,
  ADD_TO_CART
} from './mutation-types'

export default {
  addCart(context, payload) {
    // 1.payload新添加的商品（判断是否添加）
    // 数组函数常用的方法？ push/pop/unshift/shift/sort/reverse/map/filter/reduce/join
    // let oldProduct = null;
    // for(let item of state.cartList) {
    //   if(item.iid === payload.iid) {
    //     oldProduct = item;
    //   }
    // }

    return new Promise((resolve, reject) => {
      // 1.查找之前数组中是否有该商品
      // let oldProduct = state.cartList.find(function (item) {
      //   return item.iid === payload.iid
      // })
      // 也可以写成箭头函数
      let oldProduct = context.state.cartList.find(item => item.iid === payload.iid)

      // 2.判断oldProduct是否有值
      if(oldProduct) { //数量+1
        // oldProduct.count += 1
        context.commit(ADD_COUNTER, oldProduct)
        resolve('当前商品数量+1')
      } else { //添加新的商品
        payload.count = 1
        // 这里通过payload定义了count
        // state.cartList.push(payload)
        context.commit(ADD_TO_CART, payload)
        resolve('添加了新的商品')

      }
    })
  }
}