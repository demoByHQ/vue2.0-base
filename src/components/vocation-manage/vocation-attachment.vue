<template>
  <div class="attachment-group">
    <group :title="title">
      <div class="attachment-area">
        <div class="img-area" v-for="(img, index) in showList" @click="show(index)">
          <div class="delete" @click.stop="deleteImg(index)" v-if="!noAdd">-</div>
          <img class="previewer-img" :src="img" />
        </div>
        <div class="img-area" v-if="showList.length != max && !noAdd" @click="choose">
          <img :src="photoImg" />
        </div>
        <div v-transfer-dom>
          <previewer :list="previewList" ref="previewer" :options="options"></previewer>
        </div>
      </div>
    </group>
  </div>
</template>

<script>
  import {
    Group,
    Previewer,
    TransferDom
  } from 'vux'

  export default {
    name: 'attachmentGroup',
    data() {
      return {
        showImgPreview: false,
        nowImg: '',
        photoImg: require('../../assets/images/vocation-manage/photo@3.png'),
        showList: [],
        previewList: [],
        options: {
          getThumbBoundsFn(index) {
            // find thumbnail element
            let thumbnail = document.querySelectorAll('.previewer-img')[index]
            // get window scroll Y
            let pageYScroll = window.pageYOffset || document.documentElement.scrollTop
            // optionally get horizontal scroll
            // get position of element relative to viewport
            let rect = thumbnail.getBoundingClientRect()
            // w = width
            return {
              x: rect.left,
              y: rect.top + pageYScroll,
              w: rect.width
            }
            // Good guide on how to get element coordinates:
            // http://javascript.info/tutorial/coordinates
          }
        }
      }
    },
    directives: {
      TransferDom
    },
    components: {
      Group,
      Previewer
    },
    /**
     * @param imgList: 传入的图片数组
     * @param title: 组件内group标题
     * @param max: 最大图片数量
     * @emit choose : 点击选择图片时触发的方法，应该实现为调用微信jssdk拍照或从相册选择图片
     * @emit delete : 点击图片右上角删除按钮时触发的方法，返回图片的索引index
     */
    props: ['imgList', 'title', 'max', 'noAdd'],
    methods: {
      show: function(index) {
        this.$refs.previewer.show(index);
      },
      choose: function() {
        this.$emit('choose');
      },
      deleteImg: function(index) {
        this.$emit('delete', index);
        this.showList.splice(index, 1);
        this.previewList.splice(index, 1);
      },
      showPreviewer: function(img) {
        this.showImgPreview = true;
        this.nowImg = img;
      },
      getImageData: function(img) {
        let _this = this;
        if (window.__wxjs_is_wkwebview) {
          if (img.substr(0, 2) === 'wx' || img.substr(0, 6) === 'weixin') {
            this.$wechat.getLocalImgData({
              localId: img,
              success: function(res) {
                _this.$nextTick(function() {
                  _this.showList.push(res.localData);
                  _this.previewList.push({
                    src: res.localData
                  })
                })
              }
            })
          }else{
            this.showList = [].concat(this.imgList);
            this.previewList = [];
            this.imgList.forEach(function(item, index) {
              this.previewList.push({
                src: item
              })
            }, this);
          }
        } else {
          this.showList = [].concat(this.imgList);
          this.previewList = [];
          this.imgList.forEach(function(item, index) {
            this.previewList.push({
              src: item
            })
          }, this);
        }
      }
    },
    mounted() {
      console.log(JSON.stringify(this.imgList[0]));
      this.getImageData(this.imgList[0]);
    },
    watch: {
      imgList: function(newImgList, oldImgList) {
        if (newImgList.length > oldImgList.length) {
          this.getImageData(this.imgList[this.imgList.length - 1]);
        } else {
          if (newImgList.length == 0) {
            this.previewList = [];
            this.showList = [];
          }
        }
      }
    }
  }
</script>

<style lang="scss">
  .attachment-group {
    .attachment-area {
      padding: 0 4vw;
      display: flex;
      display: -webkit-flex;
      display: -moz-box;
      display: -ms-flexbox;
      flex-wrap: wrap;
      -ms-flex-wrap: wrap;
      -webkit-flex-wrap: wrap;
      min-height: 1rem;
      .img-area {
        position: relative;
        margin: 10px 4vw;
        width: 22vw;
        height: 22vw;
        .delete {
          position: absolute;
          right: -10px;
          top: -10px;
          color: white;
          width: 15px;
          height: 15px;
          box-sizing: content-box;
          text-align: center;
          line-height: 15px;
          background: red;
          border-radius: 50%;
          border: 5px solid transparent;
          -webkit-background-clip: padding-box;
          background-clip: padding-box;
        }
        img {
          margin: 0;
          width: 100%;
          height: 100%;
        }
      }
    }
  }
</style>
