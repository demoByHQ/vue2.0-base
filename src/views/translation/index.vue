<template>
  <div class="translation">
    <base-loading v-if="isLoadingData"></base-loading>
    <div v-if="!isLoadingData" class="translation-content">
      <group>
        <x-input title="title" v-model="message"></x-input>
      </group>
      <button @click="test">翻译</button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {
  Group,
  XInput,
} from 'vux'
import baseLoading from 'components/base-loading.vue'
import { translate } from '@/api/translation'
import MD5 from '@/utils/md5.js'

export default {
  name: 'translation',
  components: {
    baseLoading,
    Group,
    XInput,
  },
  data () {
    return {
      isLoadingData: false,
      translation: [],
      message: '',
    }
  },
  created () {

  },
  mounted () {

  },
  methods: {
    test () {
      let appid = '20200103000372429'
      let key = 'vKTGHi_8yRLSOReaWdBa'
      let salt = (new Date()).getTime()
      let query = 'apple'
        // 多个query可以用\n连接  如 query='apple\norange\nbanana\npear'
      let from = 'en'
      let to = 'zh'
      let str1 = appid + query + salt + key
      let sign = MD5(str1)
      console.log(str1)
      console.log(sign)
      translate({
        q: query,
        appid: appid,
        salt: salt,
        from: from,
        to: to,
        sign: sign,
      }).then(response => {
        console.log(response)
      })
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style type="text/scss">
  .translation {
    position: absolute;
    width: 100%;
    height: 100%;
  }
</style>
