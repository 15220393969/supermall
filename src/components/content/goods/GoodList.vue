<template>
  <div class="goods">
    <goods-list-item v-for="(item, index) in goods" :key="index" :goods-item="item"></goods-list-item>
    <!-- {{goods}} -->
  </div>
</template>

<script>
import GoodsListItem from './GoodListItem'

export default {
  name: "GoodList",
  components: {
    GoodsListItem
  },
  props: {
    goods: {
      type: Array,
      default() {
        return []
      }
    }
  }
}
</script>

<style scoped>
  .goods { 
    display: flex;
    flex-wrap: wrap;
    /* 均等分 */
    justify-content: space-around;
    padding: 2px;
  } 
</style>