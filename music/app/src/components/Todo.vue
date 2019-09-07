<template>
    <div>
        <span v-for="(item,index) in musicList" :key="index">
            <slot :data="item.title">
                <!--  -->
            </slot>
        </span>
    </div>
   
</template>

<script>
export default {
  props: ["musicList"],
  data() {
    return {};
  }
  // methods: {
  //     deleteFn(){

  //    },
  //     EditFn(){

  //     }
  // },
};
</script>