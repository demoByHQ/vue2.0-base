<template>
  <div class="exception-manage">

    <base-loading v-if="isLoadingData"></base-loading>

    <scroller v-if="!isLoadingData">
      <exception-list>
        <exception-item v-for="(item,index) in exceptionManageList" :key="index" :item="item"
                        @click="repairCard(item)"></exception-item>
      </exception-list>
    </scroller>

  </div>
</template>

<script type="text/ecmascript-6">

  import baseLoading from 'components/base-loading.vue';
  import exceptionList from 'components/exception-manage/exception-list.vue';
  import exceptionItem from 'components/exception-manage/exception-item.vue';
  import {exceptionsQuery} from '@/api/exception'

  export default {
    name: 'exceptionManage',
    components: {
      baseLoading,
      exceptionList,
      exceptionItem,
      exceptionsQuery
    },
    data () {
      return {
        isLoadingData: true,
        exceptionManageList: "",
      }
    },
    mounted() {
      exceptionsQuery().then(response => {
        console.log(JSON.stringify(response));
        if (response.data.success) {
          this.exceptionManageList = response.data.rows;
          this.isLoadingData = false;
        } else {
          this.exceptionManageList = [];
          this.isLoadingData = false;
        }
      }).catch(error => {
        console.log(error.response);
        this.isLoadingData = false;
      })
    },
    methods: {
      repairCard(item){
        console.log('goTarget.menu:' + JSON.stringify(item));
        //this.$router.push('/exceptionApply');
        this.$router.push({
          name: 'exceptionApply',
          params: {item: item}
        });
      }
    }
  }


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>


</style>
