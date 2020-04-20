<template>
  <div class="vocation-info">
    <div v-if="id == '16' || (fStatus =='1' && id =='4')" class="history-head">
      <img src="../../assets/images/approve-history.png" alt="" width="15px">
      <span>审核历史</span>
    </div>

    <div class="timeline-box" v-if="id == '16' || (fStatus =='1' && id =='4')">
      <ul v-show="showDetailHistory">
        <li v-for="(item, index) in approveHistoryList">
          <img v-if='index == approveHistoryList.length-1' src="../../assets/images/current-circle.png"
               class="process-cicrle-img" alt="process-circle">
          <img v-else src="../../assets/images/process-circle.png" class="process-cicrle-img" alt="process-circle">
          <div class="time-tail-line" :class="{'time-tail-line-end': index == approveHistoryList.length-1}"></div>
          <div class="main-content">
            <flexbox :gutter="0">
              <flexbox-item :span="8">
                {{item.fStepFlagName}} {{item.fItemName}} {{item.fStatusResult}}
              </flexbox-item>
              <flexbox-item :span="4" align="center">
                <img src="../../assets/images/approved.png" class="approve-img" alt="approve">
                <!-- <img src="../../assets/images/wait-approve.png" class="approve-img" alt="approve"> -->
                <span class="time">{{item.fCreateTime}}</span>
              </flexbox-item>
            </flexbox>
            <p class="desc-content">
              {{item.fComment}}
            </p>
          </div>
        </li>
      </ul>

      <div @click="showDetailHistory = !showDetailHistory"><img src="../../assets/logo.png" alt="" width="20px"
                                                                class="change-down-arrow"
                                                                :class="{'change-up-arrow': !showDetailHistory}"></div>
    </div>

    <loading v-model="showLoading" :text="responseStatus"></loading>

    <!-- 需要逻辑控制 margin-top -->
    <group style="margin-top: -21px">
      <selector style="margin-left: -7px;font-size: 16px;color: #4c4c4c;" v-model="params.fApplyType" title="休假类型"
                :options="vocationList" :readonly="id == '4' || id == '16'" @on-change="onChange">
      </selector>

      <cell v-if="fStatus ==='4' && id == '2' &&　params.remainingTime" :title="'可用时间'"
            :value="params.remainingTime"></cell>

      <datetime :title="'开始时间'" format="YYYY-MM-DD HH:mm" v-model="params.fStartTime"
                :readonly="id == '4' || id == '16'" @on-change="changeStart">
      </datetime>

      <datetime :title="'结束时间'" format="YYYY-MM-DD HH:mm" v-model="params.fEndTime" :readonly="id == '4' || id == '16'"
                @on-change="changeEnd">
      </datetime>

      <cell :title="'申请时长'" :value="params.applyTime"></cell>

      <cell readonly :title="'申请原因'"></cell>
      <x-textarea class="text-area" :max="200" v-model="params.applyReason" autosize
                  :readonly="id == '4' || id == '16'"></x-textarea>
    </group>

    <vocation-attachment :img-list="imgList" max="9" v-if="showAttachment" :title='attachmentTitle'
                         :no-add="id == '4' || id == '16'" @choose="chooseImg" @delete="deleteImg"
                         :class="{'end-bottom': id == '2' || id}">
    </vocation-attachment>

    <divider v-if="saveSuccess" style="margin-bottom: 50px;">信息保存完成!</divider>

    <foot-button v-if="fStatus ==='4' && id == '2'" left-button="保存" right-button="提交" @leftButtonEvent="save"
                 @rightButtonEvent="submit"></foot-button>

    <group v-if="fStatus ==='1' && id == '4'" style="margin-bottom:55px">
      <cell :title="'审批意见'"></cell>
      <x-textarea class="text-area" :max="200" v-model="params.fApprovalOpinion" autosize></x-textarea>
    </group>

    <foot-button v-if="fStatus ==='1' && id == '4'" left-button="驳回" right-button="同意" @leftButtonEvent="refuse"
                 @rightButtonEvent="agree"></foot-button>

    <!--<group v-if="id == '2'" style="margin-bottom:55px">-->
    <!--<cell :title="'撤销原因'"></cell>-->
    <!--<x-textarea class="text-area" :max="200" v-model="params.backoutReason" autosize></x-textarea>-->
    <!--</group>-->
    <x-button v-if="fStatus ==='4' && id == '4'" class="revoke-button" @click.native="revoke">撤 销</x-button>

  </div>
</template>

<script>
  import {formatDateTime} from '@/utils/common'
  import footButton from 'components/out-apply/foot-button.vue';
  import vocationAttachment from 'components/vocation-manage/vocation-attachment';
  import WX_CONFIGS from '@/utils/wx-config';
  import {
    saveOrSubmit,
    getVocationType,
    calcApplyTime,
    wxAttachment,
    passWorkflowVacation,
    rejectWorkflowVacation,
    recallWorkflowVacation,
    getItemVacation
  } from '@/api/vocation';
  import {
    Selector,
    Group,
    XTextarea,
    Datetime,
    Divider,
    Cell,
    XButton,
    Timeline,
    TimelineItem,
    Loading,
    Flexbox,
    FlexboxItem
  } from 'vux';
  import {GetWFApprove} from '@/api/my-approve'
  import axios from 'axios'
  import router from '@/router'
  import {check, checkStatus} from '@/api/my-apply';

  export default {
    name: 'vocationInfo',
    components: {
      Selector,
      Group,
      XTextarea,
      Datetime,
      footButton,
      vocationAttachment,
      Divider,
      Cell,
      XButton,
      Timeline,
      TimelineItem,
      Loading,
      Flexbox,
      FlexboxItem
    },
    data() {
      return {
        isMessage: false, //是否是消息推送
        id: "2",
        fStatus: "4",
        params: {
          emplNbr: '12229',
          fBillNo: Date.parse(new Date()),
          fApplyDate: "",
          fApplyType: '',
          remainingTime: '',//可用时间
          fStartTime: '',
          fEndTime: '',
          applyTime: '',
          applyReason: '',
          fAttachment: [],
          backoutReason: "",               //撤回原因
          fApprovalOpinion: "",            //同意驳回意见
          fBiller: "",                     //驳回人
          fClassTypeId: "",                //单据类别
          Node: "",                        //驳回结点名称
        },
        showAttachment: false,
        showDetailHistory: true,
        saveSuccess: false,
        showLoading: false,
        defaultValue: '',
        responseStatus: '',
        attachmentTitle: '附件信息（最多传9张）',
        vocationList: [],
        imgList: [],
        vocationInfoList: [],
        approveHistoryList: []
      }
    },
    created() {
      //id  2表示 “未审批” ；  4表示 “审批中”； 16 表示 “已审批”；
      if (this.$route.params.vocationApply) {
//        if (this.$route.params.fStatus === "4") {
//          this.fStatus = "4";
//        } else if (this.$route.params.fStatus === "1") {
//          this.fStatus = "1";
//        }
//        if (this.$route.params.id === "2") {
//          this.id = "2";
//        } else if (this.$route.params.id === "4") {
//          this.id = "4";
//        } else if (this.$route.params.id === "16") {
//          this.id = "16";
//        }

        if (this.$route.params.fStatus === "4") {//4 我的申请
          this.fStatus = "4";
          if (this.$route.params.id === "2") { //待提交  保存 提交
            this.status = "0";
            this.id = "2";
          } else if (this.$route.params.id === "4") { //审批中 撤回
            this.status = "1";
            this.isCheckStatus(this.$route.params.vocationApply.fBillNo, this.$route.params.vocationApply.fClassTypeId);
          } else if (this.$route.params.id === "16") { //已审批 查看历史
            this.status = "1";
            this.id = "16";
            this.getHistory(this.$route.params.vocationApply.fBillNo, this.$route.params.vocationApply.fClassTypeId);
          }
        } else if (this.$route.params.fStatus === "2") { //2已审批的
          this.fStatus = "2";
          this.status = "1";
          this.id = "16";
          this.getHistory(this.$route.params.vocationApply.fBillNo, this.$route.params.vocationApply.fClassTypeId);
        } else if (this.$route.params.fStatus === "1") { //1我待批的
          this.getHistory(this.$route.params.vocationApply.fBillNo, this.$route.params.vocationApply.fClassTypeId);
          if (this.$route.params.id === "4") { //审批
            this.fStatus = "1";
            this.status = "1";
            this.id = "4";
          }
          this.getHistory(this.$route.params.vocationApply.fBillNo, this.$route.params.vocationApply.fClassTypeId);
        }

        let vocationApplyItem = this.$route.params.vocationApply;
        this.params.fBillNo = vocationApplyItem.fBillNo;
        this.params.fApplyType = vocationApplyItem.fApplyType;
        this.params.fStartTime = vocationApplyItem.fStartTime.substring(0, vocationApplyItem.fStartTime.length - 3);
        this.params.fEndTime = vocationApplyItem.fEndTime.substring(0, vocationApplyItem.fStartTime.length - 3);
        this.params.applyTime = vocationApplyItem.applyTime;
        this.params.applyReason = vocationApplyItem.applyReason;
        this.params.fBiller = vocationApplyItem.fBiller;
        this.params.fClassTypeId = vocationApplyItem.fClassTypeId;
        this.imgList = vocationApplyItem.fAttachment;
        console.log(this.imgList);
        if (this.imgList.length >= 1) {
          this.showAttachment = true;
        }
        this.attachmentTitle = '附件信息';
      }
    },
    methods: {
      add(item) {
        this.$router.push('/vacationRequest');
      },
      //选择休假类型 获取时间 判断是否需要附件
      onChange(val) {
        console.log(val);
        const selectedItem = this.vocationInfoList.filter((item, index, array) => {
          return item.leaveType == val;
        });
        console.log(JSON.stringify(selectedItem));
        if (selectedItem.length != 0) {
          if (selectedItem[0].baseTime === null) {
            this.params.remainingTime = 0;
          } else {
            this.params.remainingTime = String(selectedItem[0].baseTime);
          }
          this.showAttachment = selectedItem[0].checkAtt === 'Y' ? true : false;
          if (val == 'CN-LV-病假') {
            if (this.params.applyTime >= selectedItem[0].attachmentTime) {
              this.showAttachment = true;
            } else {
              this.showAttachment = false;
            }
          }
          if (this.params.fStartTime && this.params.fEndTime) {
            this.calcTime();
          }
        }
      },
      chooseImg() {
        let _this = this;
        this.$wechat.chooseImage({
          count: 1, //默认9（每次只能选取一张）
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: function (res) {
            _this.imgList = _this.imgList.concat(res.localIds);
          }
        });
      },
      deleteImg(index) {
        this.imgList.splice(index, 1);
      },
      uploadImg(successCount, needUploadImg, flag) {
        let _this = this;
        this.showLoading = true;
        let count = successCount + 1;
        this.responseStatus = '上传中' + count + '/' + needUploadImg.length;
        this.$wechat.uploadImage({
          localId: needUploadImg[successCount],
          isShowProgressTips: 0,
          success: function (res) {
            if (res.errMsg.substr(-2, 2) == 'ok' || res.errMsg == 'uploadImage:ok') {
              try {
                wxAttachment({
                  serverId: res.serverId
                }).then(res => {
                  if (res.status == 200 && res.data && res.data.rows && res.data.rows[0]) {
                    _this.params.fAttachment.push(res.data.rows[0].imagePath);
                    successCount++;
                    if (successCount == needUploadImg.length) {
                      _this.$vux.toast.text('图片全部上传成功', 'middle');
                      if (flag == 'save') {
                        _this.responseStatus = '上传成功,保存中...';
                        _this.params.fid = "save";
                        saveOrSubmit(_this.params).then(response => {
                          _this.$vux.toast.text(response.data.message, 'middle');
                          _this.showLoading = false;
                          if (response.data && response.data.success) {
                            _this.saveSuccess = true;
                          } else {
                            _this.saveSuccess = false;
                          }
                          setTimeout(function () {
                            _this.$router.go(-1);
                          }, 500);
                        }).catch(error => {
                          _this.showLoading = false;
                          console.log(error.response);
                        })
                      } else if (flag == 'submit') {
                        _this.responseStatus = '上传成功,提交中...';
                        _this.params.fid = "submit";
                        saveOrSubmit(_this.params).then(response => {
                          _this.$vux.toast.text(response.data.message, 'middle');
                          _this.showLoading = false;
                          setTimeout(function () {
                            _this.$router.go(-1);
                          }, 500);
                        }).catch(error => {
                          _this.showLoading = false;
                          console.log(error.response);
                        })
                      }
                    } else {
                      _this.uploadImg(successCount, needUploadImg, flag);
                    }
                  } else {
                    successCount = successCount + 1;
                    _this.showLoading = false;
                    _this.$vux.toast.text('第' + successCount + '张图片上传失败！', 'middle');
                  }
                })
              } catch (e) {
                _this.showLoading = false;
                _this.$vux.toast.text(e, 'middle');
              }
            } else {
              successCount = successCount + 1;
              _this.showLoading = false;
              _this.$vux.toast.text('第' + successCount + '张图片上传失败！', 'middle');
            }
          }
        });
      },
      //计算时长
      calcTime() {
        if (this.$route.params.vocationApply) {
          if (this.$route.params.id === "2") {
            calcApplyTime({
              emplNbr: this.params.emplNbr,
              startTime: this.params.fStartTime + ":00",
              endTime: this.params.fEndTime + ":00",
              vocationType: this.params.fApplyType
            }).then(response => {
              if (response.data.success) {
                this.params.applyTime = String(response.data.rows[0]);
                if (this.params.fApplyType === "CN-LV-病假") {
                  if (this.params.applyTime >= 8) {
                    this.showAttachment = true;
                  } else {
                    this.showAttachment = false;
                  }
                }
              } else {
                this.$vux.toast.text(response.data.message, 'middle');
                this.params.applyTime = "";
              }
            }).catch(error => {
              console.log(error);
            })
          }
        } else {
          let WxUrlObj = {};
          let urlParamsArrays = window.location.href.split('?');
          if (urlParamsArrays[1]) {
            let urlParamsArray = urlParamsArrays[1].substring(1).split('&');
            urlParamsArray.forEach((item, index, array) => {
              let pos = item.indexOf('=');
              if (pos == '-1') {
              } else {
                WxUrlObj[item.split('=')[0]] = item.split('=')[1];
              }
            });
            if (WxUrlObj.fBillNo && WxUrlObj.fClassTypeId) {
              return;
            } else {
              calcApplyTime({
                emplNbr: this.params.emplNbr,
                startTime: this.params.fStartTime + ":00",
                endTime: this.params.fEndTime + ":00",
                vocationType: this.params.fApplyType
              }).then(response => {
                if (response.data.success) {
                  this.params.applyTime = String(response.data.rows[0]);
                  //this.showAttachment = response.data.rows[0].haveAttachment;
                  if (this.params.fApplyType === "CN-LV-病假") {
                    if (this.params.applyTime >= 8) {
                      this.showAttachment = true;
                    } else {
                      this.showAttachment = false;
                    }
                  }
                } else {
                  this.$vux.toast.text(response.data.message, 'middle');
                  this.params.applyTime = "";
                }
              }).catch(error => {
                console.log(error);
              })
            }
          } else {
            calcApplyTime({
              emplNbr: this.params.emplNbr,
              startTime: this.params.fStartTime + ":00",
              endTime: this.params.fEndTime + ":00",
              vocationType: this.params.fApplyType
            }).then(response => {
              if (response.data.success) {
                this.params.applyTime = String(response.data.rows[0]);
                //this.showAttachment = response.data.rows[0].haveAttachment;
                if (this.params.fApplyType === "CN-LV-病假") {
                  if (this.params.applyTime >= 8) {
                    this.showAttachment = true;
                  } else {
                    this.showAttachment = false;
                  }
                }
              } else {
                this.$vux.toast.text(response.data.message, 'middle');
                this.params.applyTime = "";
              }
            }).catch(error => {
              console.log(error);
            })
          }
        }
      },
      changeStart(time) {
        if (this.params.fEndTime === '') {
        } else {
          if (this.params.fStartTime > this.params.fEndTime) {
            this.$nextTick(function () {
              this.params.fStartTime = "";
            });
            this.$vux.toast.text('开始时间不能大于结束时间', 'middle');
          } else {
            if (this.params.fStartTime && this.params.fEndTime && this.params.fApplyType) {
              this.calcTime();
            }
          }
        }
      },
      changeEnd(time) {
        if (this.params.fStartTime === '') {
        } else {
          if (this.params.fEndTime < this.params.fStartTime) {
            this.$nextTick(function () {
              this.params.fEndTime = "";
            });
            this.$vux.toast.text('结束时间不能小于开始时间', 'middle');
          } else {
            if (this.params.fStartTime && this.params.fEndTime && this.params.fApplyType) {
              this.calcTime();
            }
          }
        }
      },
      save() {
        this.params.fApplyDate = formatDateTime(new Date(), "dateTime");
        this.params.fid = "save";
        console.log(JSON.stringify(this.params));
        if (this.params.applyTime === "") {
          this.$vux.toast.text('保存失败，无有效时长', 'middle');
        } else if (this.params.fApplyType === 'CN-LV-年假' && this.params.applyTime >= this.params.remainingTime) {
          this.$vux.toast.text('保存失败，剩余时长不足', 'middle');
        } else {
          if (this.imgList.length > 0) {
            this.uploadImg(0, this.imgList, 'save');
          } else {
            this.showLoading = true;
            this.responseStatus = '保存中...';
            saveOrSubmit(this.params).then(response => {
              if (response.data && response.data.success) {
                this.showLoading = false;
                this.$vux.toast.text("保存成功", 'middle');
                this.saveSuccess = true;
                this.goBack();
              } else {
                this.showLoading = false;
                this.saveSuccess = false;
              }
            }).catch(error => {
              this.showLoading = false;
              console.log(error.response);
            })
          }
        }
      },
      submit() {
        this.params.fApplyDate = formatDateTime(new Date(), "dateTime");
        this.params.fid = "submit";
        if (this.params.applyTime === "") {
          this.$vux.toast.text('提交失败，无有效时长', 'middle');
        } else if (this.params.fApplyType === 'CN-LV-年假' && this.params.applyTime >= this.params.remainingTime) {
          this.$vux.toast.text('提交失败，剩余时长不足', 'middle');
        } else {
          if (this.imgList.length > 0) {
            this.uploadImg(0, this.imgList, 'submit');
          } else {
            this.showLoading = true;
            this.responseStatus = '提交中...';
            //this.params.fApplyDate = formatDateTime(new Date(), "dateTime");
            saveOrSubmit(this.params).then(response => {
              if (response.data.success) {
                this.$vux.toast.text("提交成功", 'middle');
                this.showLoading = false;
                if (this.isMessage) {
                  router.replace({ //跳转到登录页面
                    path: '/',
                  });
                } else {
                  let _this = this;
                  setTimeout(function () {
                    _this.$router.go(-1);
                  }, 1600);
                }
              }
            }).catch(error => {
              this.showLoading = false;
              console.log(error.response);
            })
          }
        }
      },
      //同意
      agree() {
        passWorkflowVacation({
          "fBillNo": this.params.fBillNo,
          "fBiller": this.params.fBiller,
          "fClassTypeID": this.params.fClassTypeId,
          "fApprovalOpinion": this.params.fApprovalOpinion,
        }).then(response => {
          console.log(JSON.stringify(response));
          if (response.data.success) {
            this.$vux.toast.text(response.data.message, 'middle');
            this.goBack();
          } else {
            this.$vux.toast.text("同意失败", 'middle');
            this.$vux.loading.hide();
          }
        }).catch(error => {
          console.log(error.response);
        });
      },
      //驳回
      refuse() {
        if (this.params.fApprovalOpinion === "") {
          this.$vux.toast.text('请输入驳回原因', 'middle');
          return;
        } else {
          rejectWorkflowVacation({
            "fBillNo": this.params.fBillNo,
            "fBiller": this.params.fBiller,
            "fClassTypeID": this.params.fClassTypeId,
            "fApprovalOpinion": this.params.fApprovalOpinion,
            "Node": "",
          }).then(response => {
            console.log(JSON.stringify(response));
            if (response.data.success) {
              this.$vux.toast.text(response.data.message, 'middle');
              this.goBack();
            } else {
              this.$vux.toast.text("驳回失败", 'middle');
              this.$vux.loading.hide();
            }
          }).catch(error => {
            console.log(error.response);
          });
        }
      },
      //召回
      revoke(){
        recallWorkflowVacation({
          "fBillNo": this.params.fBillNo
        }).then(response => {
          console.log(JSON.stringify(response));
          if (response.data.success) {
            this.$vux.toast.text(response.data.message, 'middle');
            this.goBack();
          } else {
            this.$vux.toast.text("撤销失败", 'middle');
            this.$vux.loading.hide();
          }
        }).catch(error => {
          console.log(error.response);
        });
      },
      //获取历史
      getHistory(fBillNo, fClassTypeId){
        GetWFApprove({
          "fBillNo": fBillNo,
          "fClassTypeID": fClassTypeId
        }).then(response => {
          if (response.data.success) {
            this.approveHistoryList = response.data.rows;
          } else {

          }
        });
      },
      //判断是否为审批人
      checkApprover(fBillNo, fClassTypeId){
        check({"fBillNo": fBillNo, "fClassTypeId": fClassTypeId}).then(response => {
          if (response.data.success) {
            this.id = "4";
            this.status = "1";
          } else {
            this.id = "16";
            this.status = "1";
          }
        });
      },
      isCheckStatus(fBillNo, fClassTypeId){
        checkStatus({"fBillNo": fBillNo, "fClassTypeId": fClassTypeId}).then(response => {
          if (response.data.success) {
            this.id = "4";
          } else {
            this.id = "16";
            this.getHistory(fBillNo, fClassTypeId);
          }
        });
      },
      goBack(){
        if (this.isMessage) {
          router.replace({ //跳转到登录页面
            path: '/',
          });
        } else {
          let _this = this;
          setTimeout(function () {
            _this.$router.go(-1);
          }, 1600);
        }
      }
    },
    mounted() {
      console.log(location.href);
      if (this.$route.params.id == '2' || !this.$route.params.id) {
        WX_CONFIGS.wxConfig(location.href.split('#')[0], ['chooseImage', 'uploadImage', 'getLocation', 'getLocalImgData']);
        this.$wechat.error((err) => {
          err && this.$vux.toast.text(err.errMsg, 'middle');
        });
      }
      this.showLoading = true;
      if (window.location.hostname === 'localhost') {
        getVocationType({emplNbr: ""}).then(response => {
          this.showLoading = false;
          this.vocationInfoList = response.data.rows || [];
          for (let i = this.vocationInfoList.length - 1; i >= 0; i--) {
            if (this.vocationInfoList[i].leaveName === '外出' || this.vocationInfoList[i].leaveName === '出差') {
              this.vocationInfoList.splice(i, 1);
            }
          }
          this.vocationList = response.data.rows.map((item, index, array) => {
            let list = {};
            list.key = item.leaveType;
            list.value = item.leaveName;
            return list;
          });
        }).catch(error => {
          this.showLoading = false;
          console.log(error);
        });
        return;
      } else {
        let WxUrlObj = {};
        let urlParamsArrays = window.location.href.split('?');
        let urlParamsArray = urlParamsArrays[1].substring(1).split('&');
        urlParamsArray.forEach((item, index, array) => {
          let pos = item.indexOf('=');
          if (pos == '-1') {
          } else {
            WxUrlObj[item.split('=')[0]] = item.split('=')[1];
          }
        });
        let that = this;
        if (WxUrlObj.fBillNo && WxUrlObj.fClassTypeId) {
          that.isMessage = true;
          let loginUrl = 'http://60.191.94.124:8092/core/oauth/token?client_id=client' +
            '&client_secret=secret&grant_type=password&username=' + WxUrlObj.code + '&password=' + WxUrlObj.code;
          let instance = axios.create({
            timeout: 30000,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          });
          instance.post(loginUrl).then(function (response) {
            // success callback
            if (response && response.data && typeof response.data === 'object' && response.data.access_token) {
              window.localStorage.setItem('ACCESS_TOKEN', response.data.access_token);
              getVocationType({
                emplNbr: that.params.emplNbr
              }).then(response => {
                that.showLoading = false;
                that.vocationInfoList = response.data.rows || [];
                for (let i = that.vocationInfoList.length - 1; i >= 0; i--) {
                  if (that.vocationInfoList[i].leaveName === '外出' || that.vocationInfoList[i].leaveName === '出差') {
                    that.vocationInfoList.splice(i, 1);
                  }
                }
                that.vocationList = response.data.rows.map((item, index, array) => {
                  let list = {};
                  list.key = item.leaveType;
                  list.value = item.leaveName;
                  return list;
                });
                getItemVacation({"fBillNo": WxUrlObj.fBillNo}).then(response => {
                  if (response.data.success) {
                    that.$vux.loading.hide();
                    that.$vux.toast.text(response.data.message, 'middle');

                    that.params.fBillNo = response.data.rows[0].fBillNo;
                    that.params.fApplyType = response.data.rows[0].fApplyType;
                    that.params.fStartTime = response.data.rows[0].fStartTime.substring(0, response.data.rows[0].fStartTime.length - 3);
                    that.params.fEndTime = response.data.rows[0].fEndTime.substring(0, response.data.rows[0].fEndTime.length - 3);
                    that.params.applyTime = response.data.rows[0].applyTime;
                    that.params.applyReason = response.data.rows[0].applyReason;
                    that.params.fBiller = response.data.rows[0].fBiller;
                    that.params.fClassTypeId = response.data.rows[0].fClassTypeId;
                    that.imgList = response.data.rows[0].fAttachment;
                    if (that.imgList.length >= 1) {
                      that.showAttachment = true;
                    }
                    that.attachmentTitle = '附件信息';

                    if (WxUrlObj.fStatus === "4") {//4 我的申请
                      that.fStatus = "4";
                      if (response.data.rows[0].fMultiCheckStatus === "2") { //待提交  保存 提交
                        that.status = "0";
                        that.id = "2";
                      } else if (response.data.rows[0].fMultiCheckStatus === "4") { //审批中 撤回
                        that.status = "1";
                        that.isCheckStatus(WxUrlObj.fBillNo, WxUrlObj.fClassTypeId);
                      } else if (response.data.rows[0].fMultiCheckStatus === "16") { //已审批 查看历史
                        that.status = "1";
                        that.id = "16";
                        that.getHistory(WxUrlObj.fBillNo, WxUrlObj.fClassTypeId);
                      }
                    } else if (WxUrlObj.fStatus === "2") { //2已审批的
                      that.fStatus = "2";
                      that.id = "16";
                      that.getHistory(WxUrlObj.fBillNo, WxUrlObj.fClassTypeId);
                    } else if (WxUrlObj.fStatus === "1") { //1我待批的
                      if (response.data.rows[0].fMultiCheckStatus === "4") { //审批
                        that.status = "1";
                        that.checkApprover(WxUrlObj.fBillNo, WxUrlObj.fClassTypeId);
                      } else if (response.data.rows[0].fMultiCheckStatus === "16") { //已审批 查看历史
                        that.status = "1";
                        that.id = "16";
                      }
                      that.getHistory(WxUrlObj.fBillNo, WxUrlObj.fClassTypeId);
                    }
                  } else {
                    that.$vux.loading.hide();
                  }
                }).catch(error => {
                  console.log(error.response);
                });
              }).catch(error => {
                that.showLoading = false;
                console.log(error);
              })
            }
          }, function (error) {
            //error callback
          }).catch(function (error) {
          })
        } else {
          getVocationType({emplNbr: ""}).then(response => {
            this.showLoading = false;
            this.vocationInfoList = response.data.rows || [];
            for (let i = this.vocationInfoList.length - 1; i >= 0; i--) {
              if (this.vocationInfoList[i].leaveName === '外出' || this.vocationInfoList[i].leaveName === '出差') {
                this.vocationInfoList.splice(i, 1);
              }
            }
            this.vocationList = response.data.rows.map((item, index, array) => {
              let list = {};
              list.key = item.leaveType;
              list.value = item.leaveName;
              return list;
            });
          }).catch(error => {
            this.showLoading = false;
            console.log(error);
          });
        }
      }
    }
  }
</script>

<style type="text/scss" lang="scss" rel="stylesheet/scss">
  .vocation-info {
    .history-head {
      background: #239cda;
      height: 30px;
      line-height: 30px;
      text-align: left;
      color: white;
      font-size: 0.875rem;
      img {
        vertical-align: sub;
        padding-left: 12px;
        padding-right: 5px;
      }
    }
    .timeline-box {
      padding: 0.5rem;
      background: white;
      color: #666666;
      font-size: 0.875em;
      position: relative;
      ul {
        -webkit-padding-start: 26px;
      }
      ul > li {
        list-style: none;
        position: relative;
      }
      .process-cicrle-img {
        width: 15px;
        position: absolute;
        z-index: 10;
        left: -22px;
      }
      .time-tail-line {
        position: absolute;
        z-index: 9;
        height: 100%;
        width: 1px;
        transform: scaleX(0.5) scaleY(1);
        -webkit-transform: scaleX(0.5) scaleY(1);
        background: #ececec;
        left: -15px;
        top: 12px;
      }
      .time-tail-line-end {
        display: none;
      }
      .main-content {
        margin-bottom: 10px;
        .approve-img {
          width: 10px;
        }
        .time {
          padding-left: 5px;
        }
      }
      .desc-content {
        font-size: xx-small;
        text-align: left;
        color: #b0b0b0
      }
      .change-down-arrow {
        transform: rotate(180deg);
      }
      .change-up-arrow {
        transform: rotate(0deg);
      }
    }
    .text-area {
      padding-top: 0px;
      &.weui-cell:before {
        border-top: none;
      }
    }
    .weui-select {
      float: right;
      width: auto;
      color: #999999;
    }
    .weui-cell {
      text-decoration: none;
    }
    .vux-selector {
      text-decoration: none;
      &.weui-cell_select-after {
        padding-left: 2px;
      }
    }
    p {
      -webkit-margin-before: 0em;
      -webkit-margin-after: 0em;
      font-size: 16px;
      color: #4c4c4c;
    }
    .title {
      padding: 10px 15px;
      color: #4c4c4c;
    }
    .weui-cells__title {
      background-color: #FFFFFF;
      padding: 10px;
      margin-top: 0px;
      margin-bottom: 0px;
      /*border-top: 1px solid #EFF4F8;*/
      padding: 10px 15px;
      color: #2c3e50;
      text-align: left;
    }
    .revoke-button {
      background: #1793d7;
      color: white;
      position: fixed;
      z-index: 11;
      bottom: -2px;
      border-radius: 0;
    }
    .end-bottom {
      margin-bottom: 50px;
    }
  }

  .vux-loading {
    .weui-toast {
      p {
        color: white;
      }
    }
  }

  .vux-label {
    text-align: left;
  }
</style>
