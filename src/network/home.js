// 对首页的数据请求
import { request } from "./request";

export function getHomeMultidata() {
  return request({
    url: './home/multidata'
  })
}

export function getHomeGoods(type, page) {
  return request({
    url: './home/data',
    params: {
      type,
      page
    }
  })
}

// 函数调用  -> 压入函数栈（保存函数调用过程中的所有变量）
// 函数调用结束 -> 弹出函数栈（释放函数所有的变量）
// 例如：
// function test() {
//   const name = ['why', 'aaa']
// }
// test()

// // 将一个数组里的数据放到另一个数组里面
// const totalNums = []

// const nums1 = [20, 11, 222]
// const nums2 = [111, 222 ,333]

// // 1.遍历
// for (let n of nums1) {
//   totalNums.push(n)
// }

// // 2.
// totalNums.push(...nums1)