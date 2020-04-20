<template>
  <div class="foot-button" v-if="show">

    <div @click="leftButtonEvent" class="fb-left-button"
         :style="[leftButton==='保存' ? leftButtonSave : leftButtonReject]">
      {{leftButton}}
    </div>

    <div @click="rightButtonEvent" class="fb-right-button"
         :style="[ ( rightButton ==='下一步' || rightButton === '提交' ) ? rightButtonSubmit : rightButtonPass]">
      {{rightButton}}
    </div>

  </div>
</template>

<style>
  .foot-button {
    height: 50px;
    position: fixed;
    z-index: 8;
    bottom: 0;
    width: 100%;
    border-top: 1px solid #dedede;
  }

  .fb-left-button {
    width: 50%;
    float: left;
    height: 50px;
    line-height: 50px;
    text-align: center;
    font-size: 16px;
  }

  .fb-right-button {
    width: 50%;
    float: left;
    height: 50px;
    line-height: 50px;
    text-align: center;
    font-size: 16px;
  }
</style>

<script type="text/ecmascript-6">
  export default {
    props: {
      leftButton: String,
      rightButton: String,
      show: {
        type: Boolean,
        default: function () {
          return true;
        }
      }
    },
    data() {
      return {
        leftButtonSave: {
          background: 'white',
          color: '#129CDA'
        },
        leftButtonReject: {
          background: '#FFFFFF',
          color: '#0092da'
        },
        rightButtonSubmit: {
          background: '#0092da',
          color: 'white'
        },
        rightButtonPass: {
          background: '#0092da',
          color: 'white'
        }
      };
    },
    methods: {
      leftButtonEvent() {
        this.$emit('leftButtonEvent')
      },
      rightButtonEvent() {
        this.$emit('rightButtonEvent')
      }
    }
  };
</script>
