<template>
  <view
    class="page-content"
    :class="cueTheme"
  >
    <nav-bar
      title="充值中心"
      :backState="1000"
      :homeState="1000"
    ></nav-bar>

    <!-- ios不展示充值页面 -->
    <!-- && serviceStatus -->
    <remind
      v-if="deviceInfo == 'ios'"
      :showCustomerService="serviceStatus"
    />

    <template v-else>
      <view
        v-if="!showUserPhoneInput"
        class="user-info"
      >
        <view class="user-name">
          {{ userInfo.level == 0 ? '普通用户' : '尊享会员' }}
          <vipLevel :userVipLevel="userInfo.level"></vipLevel>
        </view>
        <view class="user-item">
          <view>有效时间： {{ userInfo.expire && userInfo.expire || "您还不是会员" }}</view>
          <view>点数：{{ userInfo.point }}点
            <text
              style="color:#1DCCAF;margin-left:20rpx;"
              @click="goDetail()"
            >
              明细
              <text style="margin-left: 20rpx;"> > </text>
            </text>
          </view>
        </view>
      </view>

      <view
        v-else
        class="form-box"
      >
        <u-form
          ref="uForm"
          label-position="top"
          label-width="180"
          :model="userInfoFormData"
          :label-style="formLabelStyle"
        >
          <u-form-item label="充值账号(必填)">
            <input
              class="input-box"
              v-model="userInfoFormData.phone"
              placeholder="请输入充值手机号"
              placeholder-class="placeholder_class"
              type="number"
            />
          </u-form-item>
        </u-form>
      </view>

      <view class="vip-box u-flex-col">
        <!-- menBar -->
        <scroll-view scroll-x="true">
          <view class="u-flex">
            <view
              class="tabitem-item"
              v-for="(item, index) in rechargeList "
              :key="index"
              :class="{ 'tabitem-active': packId == item.key }"
              @click="tabbarClick(item, index)"
            >{{ item.name }}</view>
          </view>
        </scroll-view>
        <!-- vip -->
        <!-- 套餐栏 -->
        <view
          class="u-flex-col space-y-12 u-m-t-40"
          v-if="showVipCard"
        >
          <view
            class="u-flex u-row-between u-flex-wrap"
            v-if="vipCardList.length > 0"
          >
            <view
              class="card-item"
              v-for="(item, index) in vipCardList"
              :key="index"
              :class="{ 'card-active': powerIndex == index }"
              v-if="item.price != '免费'"
              @click="powerType(index, item)"
            >
              <view class="name">
                {{ item.title }}
              </view>
              <view class="card-subtitle">{{ item.subTitle }}</view>
              <!-- 划线价 -->
              <view
                class="orargy"
                v-if="item.original_price > 0"
              >
                ￥{{ item.original_price }}
              </view>
              <!-- 折扣 -->
              <view
                class="prefer"
                v-if="item.discount != '0'"
                :style="{ background: item.bgColor }"
              >
                {{ item.discount }}
              </view>
              <view
                class="price_month"
                :class="{ 'active': powerIndex == index }"
              >
                <text>￥</text>{{ item.price }}
                <text>/{{ item.month }}</text>
              </view>
            </view>
          </view>

          <view class="vip-tips font_10 u-m-t-40 ">
            办理会员后
            <text
              style="color: #1DCCAF;"
              @click="contactService()"
            >联系客服</text>
            加入会员专属群
          </view>
        </view>
        <!-- 点数列表 -->
        <view
          v-if="packId == 'point'"
          class="poin-box"
        >
          <view
            class="poin-item"
            v-for="(item, index) in currentPackList"
            :key="index"
            :class="{ 'active': powerIndex == index }"
            @click="powerType(index, item)"
          >
            <view class="poin-info u-flex-col">
              <view class="u-flex u-row-between">
                <view class="u-flex u-col-center">
                  <!-- 左边标题 -->
                  <view class="poin-title">{{ item.title }}</view>
                  <!-- 标签 -->
                  <view
                    class="poin-discount"
                    v-if="item.discount != '0'"
                    :style="{ background: item.bgColor }"
                  >
                    {{ item.discount }}
                  </view>
                </view>
                <!-- 右边价格 -->
                <view class="price-box u-flex ">
                  <view class="poin-price-icon u-m-r-8">¥</view>
                  <view class="poin-price">{{ item.price }}</view>
                </view>
              </view>
            </view>
            <!-- 底部副标题跟划线价格 -->
            <view class="u-flex u-row-between u-col-center">
              <view class="poin-detail">{{ item.subTitle }}</view>
              <view
                v-if="item.original_price > 0"
                class="poin-original-price"
              >{{ item.original_price }}</view>
            </view>
          </view>

        </view>

        <view
          v-if="showVipCard && currentPackList && currentPackList.length > 0"
          class="vip-details"
        >
          <view class="details-title">会员权益对比
            <text
              v-if="showDoublue"
              class="active-text"
            >（活动期间点数双倍赠送）</text>
          </view>
          <view class="details-box u-flex">
            <!-- 权益对比 -->
            <view class="column-item u-flex-col u-col-center u-row-center">
              <view
                class="table-title u-flex u-col-center "
                :class="{ 'while': index == 0 }"
                v-for="(item, index) in vipContrastTitle"
                :key="index"
                @click="tableTitleClick(item, index)"
              >
                {{ item.name }}
                <i
                  v-if="item.name == '生成通道' || item.name == '等待通道'"
                  class="iconfont icon-wenhao-xianxingyuankuang "
                ></i>
              </view>
            </view>

            <view
              class="column-item u-flex-col u-col-center u-row-center"
              v-for="(item, index) in currentPackList"
              :key="index"
              :class="{ 'active': index === powerIndex + 1 }"
            >
              <view
                class="table-title"
                :class="{ 'while': textIndex == 0 }"
                v-for="(textItem, textIndex) in vipContrastTitle.map((item) => item.key)"
                :key="textIndex"
              >
                {{ item[textItem] || '' }}
              </view>
            </view>
          </view>
        </view>
      </view>
      <!-- 底部按钮栏 -->
      <view class="refooter u-flex u-row-between u-col-bottom">
        <view class="refooter-numll">
          ￥{{ showVipCard ? playInfo.actual_payment : playInfo.price }}
          <text class="actual">实付</text>
          <text
            class="first"
            v-if="playInfo.save_money > 0"
          >立省{{ playInfo.save_money }}元</text>
        </view>

        <view
          v-if="deviceInfo == 'ios'"
          class="refooter-pay"
          @click="contactService()"
        >联系客服</view>
        <view
          v-else
          class="refooter-pay"
          @click="immediatePayment()"
        >立即支付</view>
      </view>
    </template>



    <view style="height:1px"></view>

    <!-- 会员---套餐-->
    <u-popup
      :show="status"
      mode="bottom"
      border-radius="40"
      height="800"
      mask-close-able="true"
      zIndex="998"
    >
      <view class="speak">
        <view class="speak-title">请确认购买信息
          <image
            @click="cancelPackage()"
            src="/static/img/detail/colse.png"
          />
        </view>
        <view class="flex-col space-y-24">
          <view class="self-center group_6">
            <view class="font_9 text_10">购买产品：{{ playInfo.title }}
            </view>
            <view
              class="font_9 text_12"
              v-if="discountObj.pay"
              style="text-decoration:line-through;margin:12rpx 0;"
            >折扣前价格：¥{{ showVipCard ? playInfo.actual_payment : playInfo.price }}</view>
            <view
              class="font_9 text_11"
              style="margin:12rpx 0;"
            >
              支付金额</view>
            <view class="pricek">
              <text>¥</text>{{ discountObj.pay ? discountObj.pay / 100 :
                showVipCard ? playInfo.actual_payment : playInfo.price }}
            </view>
            <view
              class="font_9 text_12"
              v-if="!discountObj.pay"
            >
              若有折扣码， <text
                class="font_9 text_13"
                @click="getModalShow()"
              >请点击输入</text>
            </view>
          </view>
        </view>


        <view
          class="paytype"
          v-if="!isWeixin"
        >
          <view
            class="paytype-item"
            @click="playType(1)"
          >
            <image
              class="icon"
              src="/static/img/payment/wechat.png"
            ></image>
            微信支付
            <image
              class="play"
              :src="payIndex == 1 ? '/static/img/clip/status_active.png' : '/static/img/clip/status.png'"
            ></image>
          </view>
          <view class="paytype-border"></view>
          <view
            class="paytype-item"
            @click="playType(2)"
          >
            <image
              class="icon"
              src="/static/img/payment/alipay.png"
            ></image>
            支付宝支付
            <image
              class="play"
              :src="payIndex == 2 ? '/static/img/clip/status_active.png' : '/static/img/clip/status.png'"
            ></image>
          </view>
        </view>


        <view class="speak-footer">
          <view
            class="item left"
            @click="cancelPackage()"
          >取消
          </view>
          <view
            class="item right"
            @click="eqPayment()"
          >确定支付</view>
        </view>
      </view>
    </u-popup>

    <e-model
      v-if="needRegister"
      :showModel="needRegister"
      title="温馨提示"
      confirmText="前往注册"
      @cancelHandle="needRegister = false"
      @confirmHandle="register()"
    >
      <template v-slot:content>
        <view class="content-box u-flex-col u-col-center">
          <view>该手机号还未注册</view>
          <view class="mgt-4">注册完成后享受更多惊喜哦~</view>
        </view>
      </template>
    </e-model>

    <e-model
      v-if="passagewayShow"
      :showModel="passagewayShow"
      title="温馨提示"
      confirmText="确认"
      @cancelHandle="passagewayShow = false"
      @confirmHandle="passagewayShow = false"
    >
      <template v-slot:content>
        <view class="content-box u-flex-col u-col-center">
          <view>生成通道数是指可同时生成的数量</view>
          <view class="mgt-4">等待通道数是指可同时提交的数量</view>
        </view>
      </template>
    </e-model>

    <e-model
      v-if="moveModalShow"
      :showModel="moveModalShow"
      title="请输入折扣码"
      confirmText="确认"
      @cancelHandle="getModalShow()"
      @confirmHandle="moveToGallery()"
    >
      <template v-slot:content>
        <view class="content-box u-flex-col u-col-center">
          <input
            class="input-box"
            type="text"
            placeholder="请输入折扣码"
            v-model="codeValue"
            focus
            auto-blur
            adjust-position
            name='phone'
            maxlength="24"
            style="width:100%"
          >
        </view>
      </template>
    </e-model>

  </view>
</template>

<script>
import { getUserInfo, mpToOpenIdOauth, checkUserRegisterByPhone } from '@/static/api/user.js'
import { createOrder, walletBuyByPhone, discountCode } from '@/static/api/order.js'
import utils from '@/static/utils/utils';
import vipLevel from '@/components/vipLevel/vipLevel';
import remind from "../components/remind.vue";


export default {
  components: {
    remind,
    vipLevel
  },
  data() {
    return {
      deviceInfo: '',//手机系统IOS 
      isWeixin: false,
      userCode: '', //微信h5内置浏览器支付使用
      payIndex: 0, //选择支付方式
      packId: 'month',
      userInfo: {}, //用户信息
      discountObj: {},
      status: false,  // 支付信息弹框
      rechargeList: [],  // 充值套餐列表
      powerIndex: 0,
      currentSelectPack: null,
      vipIntroduce: [],
      serviceStatus: '',
      passagewayShow: false,  // 通道说明显示
      vipContrastTitle: [
        { name: '权益', key: 'title' }, { name: '价格', key: 'actual_payment' }, { name: '每月发放', key: 'monthlyGrantPoin' },
        { name: '生成通道', key: 'passageway' }, { name: '等待通道', key: 'waitPassageway' }, { name: '水印', key: 'watermark' },
        { name: '创作记录', key: 'creationRecord' }, { name: '高清画质', key: 'HDQuality' },
      ],
      // 标记双十一活动用户手机输入框
      showUserPhoneInput: false,
      userInfoFormData: {
        phone: '',
      },
      formLabelStyle: {
        color: 'fff',
      },
      // 标记手机号填写错误
      phoneFail: false,
      // 是否已注册
      needRegister: false,
      // 失焦时才判断手机号是否已注册，防止失焦立马点击支付弹出两个弹框
      canBuy: false,
      moveModalShow: false,
    };
  },
  watch: {
    packId: {
      handler(newV, oldV) {
        let item = this.rechargeList.find((item) => item.key == newV)
        this.currentSelectPack = item || this.rechargeList[0]
      },
      immediate: true
    },
    'userInfoFormData.phone'(newVal, oldVal) {
      console.log('>>>>>>>>>>>>>newVal', newVal)
      this.checkPhone()
    }
  },
  computed: {
    currentPackList() {
      return this.currentSelectPack && this.currentSelectPack.list || []
    },
    vipCardList() {
      let list = this.currentSelectPack && this.currentSelectPack.list || []
      if (list.length > 0) {
        return list.slice(1)
      }
      return list
    },
    // 当前套餐
    playInfo() {
      if (this.packId !== 'point') {
        return this.vipCardList[this.powerIndex] || {}
      }
      return this.currentSelectPack && this.currentSelectPack.list[this.powerIndex] || {}
    },
    showVipCard() {
      return this.packId !== 'point'
    },
    showDoublue() {
      // 获取当前时间
      var currentTime = new Date();
      // 设置目标时间为2024年1月7日 00:00:00
      var targetTime = new Date(2024, 1, 17, 0, 0, 0);
      return targetTime > currentTime
    },
  },
  onShow() {
    if (!this.status && !this.showUserPhoneInput) {
      this.getuserInfo();
    }
  },
  onLoad(res) {

    // 只在小程序执行
    // #ifdef MP
    this.deviceInfo = uni.getSystemInfoSync().platform
    // #endif

    // 活动充值页 不需要登陆，直接展示数据
    if (res.navType && res.navType === 'ios') {
      this.showUserPhoneInput = true
      this.formLabelStyle.color = '#fff'

    }

    // #ifdef WEB
    // 验证是否微信内置浏览器
    let ua = window.navigator.userAgent.toLowerCase()
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
      console.log('是微信内置浏览器')
      this.isWeixin = true;

      if (!uni.getStorageSync('openid')) {
        // 活动页进来的充值使用静默授权
        this.getCodeFun()
      }

    } else {
      this.payIndex = 2;
      this.isWeixin = false;
      console.log('不是微信内置浏览')
    }
    // #endif

    // #ifdef MP-WEIXIN
    this.isWeixin = true;
    // #endif

    this.getVipRecharge()

  },
  methods: {
    getModalShow() {
      this.moveModalShow = !this.moveModalShow;
      this.codeValue = '';
      this.status = !this.status;
    },
    async moveToGallery() {
      let that = this;
      let data = {
        type: that.playInfo.type,
        code: that.codeValue,
      }
      if (!data.code) {
        uni.showToast({
          title: '折扣码不能为空',
          icon: 'none',
          duration: 3000
        });
        return
      }
      if (this.packId == 'point') {
        data.amount = this.playInfo.date;
      }
      try {
        const { code, result } = await discountCode(data)
        if (code == 200) {
          // 金额转换
          that.discountObj = result;
          that.moveModalShow = false;
          that.status = true;
          that.userCode = '';
          uni.showToast({
            title: '折扣成功',
            icon: 'none',
            duration: 3000
          });
        }
      } catch (error) {
        console.error('error', error);
      }

    },
    tableTitleClick(item, index) {
      if (item.name == '生成通道' || item.name == '等待通道') {
        this.passagewayShow = true
      }
    },
    async checkPhone() {
      let phoneReg = /^1(([378][\d])|(4[01456789])|([59][012356789])|(6[2567]))[\d]{8}$/
      let newValue = this.userInfoFormData.phone
      let length = newValue.toString().length
      this.canBuy = false
      if ((length == 11) && phoneReg.test(newValue)) {
        this.phoneFail = false
        try {
          uni.showLoading({
            title: '充值账号校验中...',
          })
          const res = await checkUserRegisterByPhone(newValue)
          setTimeout(() => {
            uni.hideLoading()
          }, 500);
          if (res.code == 200) {
            this.canBuy = true
            this.needRegister = false
          } else if (res.code == 404) {
            this.canBuy = false
            this.needRegister = true
          }
        } catch (error) {
          uni.hideLoading()
        }
      } else {
        this.phoneFail = true
      }
    },
    register() {
      this.needRegister = false
      uni.navigateTo({
        url: '/plogin/register?type=1'
      })
    },
    goDetail() {
      uni.navigateTo({
        url: '/pmine/recharge/detail'
      });
    },
    async getuserInfo() {
      this.vipList = [];
      try {
        const { code, result } = await getUserInfo()
        if (code == 200) {
          this.userInfo = { ...result.user }
          uni.setStorageSync('userInfo', result.user)
        }
      } catch (error) {
        console.error(error);
      }
    },
    getVipRecharge() {
      uni.showLoading({
        mask: true,
        title: '加载中...'
      });
      let jsonUrl = 'https://cdn.lingchuang.art/sdv/recharge.json?time=' + utils.getTime()
      // if (this.$baseURL == "https://app.onefold.cn") {
      //   //测试环境
      //   jsonUrl = 'https://cdn.drawai.cn/public/recharge_test.json?time='
      // }
      uni.request({
        url: jsonUrl,
        method: 'GET',
        success: ({ data }) => {

          const { service_status, recharge_list } = data
          this.serviceStatus = service_status

          this.rechargeList = recharge_list
          let packItem = recharge_list.find((item) => item.key == this.packId)
          if (!packItem) {
            this.currentSelectPack = recharge_list[0]
            this.packId = this.currentSelectPack.key
          } else {
            this.currentSelectPack = packItem
          }
        },
        fail: (err) => {
          console.error(err);
        },
        complete: () => {
          uni.hideLoading();
        },
      });
    },

    // 选择购买点数
    powerType(index, res) {
      this.powerIndex = index;
      // that.playInfo = res; //支付信息
      if (!uni.getStorageSync('openid') && this.isWeixin) {
        // 活动页进来的充值使用静默授权
        this.getCodeFun()
        return
      }
    },
    getCodeFun() {
      let that = this;
      that.getCode();
      // setTimeout(() => {
      //   // 弹框授权
      //   uni.showModal({
      //     title: '温馨提示',
      //     content: '为保证支付成功，请同意授权',
      //     success: res => {
      //       if (res.confirm) {
      //         that.getCode();
      //       }
      //     }
      //   })
      // }, 15000);
    },

    getCode() { // 非静默授权，第一次有弹框
      let that = this;
      this.userCode = ''
      let appid = 'wx56f072f1563a013a'
      that.userCode = that.getUrlCode().code  // 截取code
      let webSiteUrl = 'https://m.aiker.art/%23/pmine/recharge/recharge'
      if (!that.userCode) { // 如果没有code，则去请求

        let url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${webSiteUrl}?navType=''&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect`
        if (this.showUserPhoneInput) {
          url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${webSiteUrl}?navType=ios&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect`
        }
        window.location.href = url
      } else {
        // 调用新code换取openid接口
        mpToOpenIdOauth({ code: that.userCode }).then(res => {
          console.log(res, '授权后得到的数据')
          if (res.code == 200) {
            uni.setStorageSync("openid", res.result);
          }
        }).catch((err) => {
          console.error('mpToOpenIdOauth-----', err);
        })
      }
    },

    // 截取url中的code方法
    getUrlCode() {
      var url = location.search
      this.winUrl = url
      var theRequest = new Object()
      if (url.indexOf("?") != -1) {
        var str = url.substr(1)
        var strs = str.split("&")
        for (var i = 0; i < strs.length; i++) {
          theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1])
        }
      }
      return theRequest
    },

    cancelPackage() {
      this.status = false;
      this.codeValue = '';
      this.discountObj = {};
    },
    tabbarClick(clickItem, index) {
      this.packId = clickItem.key
      this.powerIndex = 0;
    },
    // 选择支付方式
    playType(e) {
      this.payIndex = e;
    },
    //  联系客服
    contactService() {
      utils.contactCustomer()
    },
    // 立即支付
    immediatePayment() {
      if (this.showUserPhoneInput) {
        if (!this.userInfoFormData.phone || this.phoneFail) {
          return uni.showToast({
            title: '请输入正确的充值账户', icon: 'none', duration: 3500
          })
        } else if (!this.canBuy) {
          // setTimeout(() => {
          // 注册弹框弹出，用户点击取消，仍然点击立即支付时弹出提示
          if (!this.needRegister) {
            this.needRegister = true
          }
          // }, 300);
          return
        }
      }
      this.status = true;

    },
    //支付购买权益次数
    async eqPayment() {
      let that = this;
      //微信内置浏览器 必须要有openID 
      if (!uni.getStorageSync('openid') && that.isWeixin) {
        that.getCode();
        return
      }
      // 外置浏览器提示
      if (this.payIndex == 1) {
        return uni.showToast({
          title: '请前往微信进行支付', icon: 'none', duration: 3500
        })
      }

      let data = {
        type: that.playInfo.type,
        amount: this.packId !== 'point' ? 1 : +that.playInfo.date,
        // alipay_h5 :支付宝  wxpay_ma：微信小程序 wxpay_js:微信H5
        // #ifdef H5
        method: that.isWeixin ? 'wxpay_js' : that.payIndex == 1 ? 'wxpay_h5' : 'alipay_h5',
        // #endif
        // #ifdef MP-WEIXIN
        method: 'wxpay_js',
        // #endif
        appid: getApp().globalData.appid || 'wx56f072f1563a013a',
        openid: uni.getStorageSync('openid'),
        code: that.codeValue,
      }

      try {
        console.log('------------data', data);
        let res
        if (this.showUserPhoneInput) {
          res = await walletBuyByPhone(data, this.userInfoFormData.phone)
        } else {
          res = await createOrder(data)
        }

        console.error('>>>>>>>>>>createOrder', res);
        if (res.code == 200) {
          const { order_id, prepay_param } = res.result;

          that.powerStatus = false;
          that.eqStatus = false;

          // #ifdef H5
          // 微信支付
          if (that.isWeixin) {
            //微信内置浏览器
            WeixinJSBridge.invoke(
              'getBrandWCPayRequest', {
              "appId": prepay_param.appId, //公众号名称，由商户传入
              "timeStamp": prepay_param.timeStamp, //时间戳，自1970年以来的秒数
              "nonceStr": prepay_param.nonceStr, //随机串
              "package": prepay_param.packageValue,
              "signType": prepay_param.signType, //微信签名方式：
              "paySign": prepay_param.paySign //微信签名
            },
              (res) => {
                that.status = false
                if (!that.showUserPhoneInput) {
                  // 更新用户信息
                  that.getuserInfo();
                }
              }
            )
          } else {
            if (this.payIndex == 1) {
              return uni.showToast({
                title: '请前往微信进行支付', icon: 'none', duration: 3500
              })
              //外置浏览器 微信h5支付
              document.location.href = res.result.prepay_param.mwebUrl
            } else if (that.payIndex == 2) {
              // 支付宝h5支付
              document.querySelector('body').innerHTML = res.result.pay_form
              //调用submit方法
              document.forms[0].submit()
            }

          }

          // #endif   

          // #ifdef MP-WEIXIN
          uni.requestPayment({
            timeStamp: prepay_param.timeStamp,
            nonceStr: prepay_param.nonceStr,
            package: prepay_param.packageValue,
            signType: prepay_param.signType,
            paySign: prepay_param.paySign,
            success: (res) => {
              uni.showToast({
                title: '支付成功', icon: 'success', duration: 3500
              })
              that.status = false
              if (!that.showUserPhoneInput) {
                // 更新用户信息
                that.getuserInfo();
              }

            },
            fail: (err) => {
              console.error('支付失败', err)
              uni.showToast({
                title: '支付失败', icon: 'none'
              })
            }
          })

          // #endif   

          // #ifdef APP-PLUS


          let orderInfo
          if (this.payIndex == 1) {
            // 微信的orderInfo是 Object
            orderInfo = {
              appid: prepay_param.appId,  // 微信开放平台-移动应用-AppId，不是微信小程序、公众号 AppId
              noncestr: prepay_param.nonceStr, // 随机字符串
              package: prepay_param.packageValue,        // 固定值
              partnerid: prepay_param.partnerId,      // 微信支付商户号
              prepayid: prepay_param.prepayId, // 统一下单订单号 
              timestamp: prepay_param.timeStamp,        // 时间戳（单位：秒）
              sign: prepay_param.sign // 签名，这里用的 MD5 签名
            }
          } else if (this.payIndex == 2) {
            // 支付宝的是 String
            orderInfo = JSON.stringify(prepay_param)
          }
          uni.requestPayment({
            provider: this.payIndex == 1 ? 'wxpay' : 'alipay',
            orderInfo: orderInfo,
            success: (res) => {
              uni.showToast({
                title: '支付成功', icon: 'success', duration: 3500
              })
              that.status = false
              if (!that.showUserPhoneInput) {
                // 更新用户信息
                that.getuserInfo();
              }

            },
            fail: (err) => {
              console.error('支付失败', err)
              uni.showToast({
                title: '支付失败', icon: 'none'
              })
            }
          })
          // #endif   
        }
      } catch (error) {
        console.error(error);
      }
    },

    contactService() {
      utils.contactCustomer()
    },
  },
}
</script>

<style lang="scss">
.page-content {
  width: 100%;
  min-height: 100vh;
  color: var(--text-color);
  background-color: var(--bg-color);
  padding-bottom: 100rpx;
  padding-bottom: calc(100rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(100rpx + env(safe-area-inset-bottom));
}

.user-info {
  width: auto;
  border-radius: 16rpx;
  margin: 32rpx;
  padding: 32rpx 40rpx;
  background-color: #232323;
  color: var(--text-color);

  .user-name {
    font-size: 36rpx;
    font-weight: 500;
    margin-bottom: 20rpx;
    color: var(--text-color);
    display: flex;

    .ident image {
      width: 146rpx;
      height: 52rpx;
      position: relative;
      top: 0rpx;
      margin-left: 20rpx;
    }
  }

  .user-item {
    display: flex;
    justify-content: space-between;
    border-top: 2rpx solid rgba(244, 244, 244, 0.08);
    font-size: 22rpx;
    padding-top: 20rpx;
    color: rgba(244, 244, 244, 0.76);

  }
}

.vip-box {
  padding: 32rpx 32rpx 44rpx;
  background-position: 0% 0%;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  border-radius: 48rpx 48rpx 0 0;
  background: rgba(244, 244, 244, 0.08);
  box-shadow: inset 0rpx 2rpx 0rpx 0rpx rgba(244, 244, 244, 0.04);

  .tabitem-item {
    width: 170rpx;
    height: 68rpx;
    font-size: 28rpx;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 500;
    color: rgba(244, 244, 244, 0.48);
    line-height: 68rpx;
    text-align: center;

    &.tabitem-active {
      background: #F4F4F4;
      border-radius: 44rpx;
      color: #121212;
    }
  }


  .card-item {
    width: 324rpx;
    height: 376rpx;
    background: #353535;
    border-radius: 32rpx 96rpx 32rpx 32rpx;
    opacity: 1;
    border: 4rpx solid rgba(18, 18, 18, 0.12);
    padding: 32rpx 0 32rpx 32rpx;
    position: relative;
    margin-bottom: 20rpx;
    color: white;

    .name {
      font-size: 28rpx;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: bold;
      color: white;
    }

    .prefer {
      // padding: 6rpx 8rpx;
      // margin-top: 30rpx;
      position: absolute;
      left: 30rpx;
      right: 30rpx;
      bottom: 100rpx;
      // width: 100rpx;
      height: 44rpx;
      border-radius: 16rpx;
      color: white;
      font-size: 24rpx;
      text-align: center;
      line-height: 40rpx;
      border: 2rpx solid rgba(244, 244, 244, 0.48);
      max-width: 50%;
    }

    .card-subtitle {
      font-size: 24rpx;
      color: #959595;
      margin: 12rpx 0;
    }

    .orargy {
      font-size: 24rpx;
      text-decoration: line-through;
      color: #959595;
      margin-top: 12rpx;
    }

    .vip-tips {
      color: #F4F4F4;
    }

    .price_month {
      position: absolute;
      left: 30rpx;
      right: 30rpx;
      bottom: 30rpx;
      font-weight: 500;
      font-size: 44rpx;

      text {
        font-size: 22rpx;
      }

      &.active {
        color: #1DCCAF !important;
      }
    }

    &.card-active {
      border: 4rpx solid #61ffff;
      background: rgba(0, 194, 187, 0.08);
      color: #1ED6B7;
    }
  }


  .vip-details {
    font-size: 28rpx;
    color: #fff;
    margin-top: 56rpx;

    .details-title {
      font-size: 36rpx;
      font-weight: bold;
      margin-bottom: 24rpx;

      .active-text {
        color: #F04455;
        font-size: 26rpx;
      }
    }

    .details-box {
      background-color: #313131;
      border-radius: 16rpx;
      width: 100%;

      .column-item {
        flex: 1;


        .table-title {
          height: 80rpx;
          line-height: 80rpx;
          color: #D5D5D5;

          &.while {
            color: #fff;
          }

          .icon-wenhao-xianxingyuankuang {
            color: #1ED6B7;
            font-size: 24rpx;
            margin-left: 4rpx;
          }
        }

        &.active {
          background: rgba(38, 236, 200, 0.15);
        }
      }
    }
  }
}


.poin-box {
  margin-top: 56rpx;
  min-height: 50vh;

  .poin-item {
    padding: 32rpx 40rpx;
    border-radius: 32rpx 32rpx 32rpx 32rpx;
    border: 2rpx solid #DCDCDC;

    .poin-info {
      .poin-title {
        color: #FFFFFF;
        font-weight: 500;
        font-size: 36rpx;
      }

      .poin-discount {
        margin-left: 10rpx;
        font-size: 24rpx;
        padding: 4rpx 10rpx;
        border-radius: 20rpx;
        color: white;
        border-radius: 8px 8px 8px 0px;
        border: 1px solid rgba(255, 255, 255, 0.66);
      }

      .price-box {
        align-items: baseline;
        color: #1DCCAF;

        .poin-price-icon {

          font-size: 40rpx;
          font-weight: 500;
        }

        .poin-price {
          font-size: 56rpx;
          font-weight: 500;
        }
      }
    }

    .poin-detail {
      font-size: 24rpx;
      font-weight: 400;
      color: rgba(255, 255, 255, 0.46);
    }

    .poin-original-price {
      font-size: 24rpx;
      color: #ffffff;
      text-decoration: line-through;
    }

    &.active {
      border-color: #00ebd3;
      background: rgba(14, 245, 228, 0.04);
    }
  }

  .poin-item+.poin-item {
    margin-top: 32rpx;
  }
}

.refooter {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;

  background: #3B3B3B;
  padding: 0 30rpx;
  padding-bottom: 30rpx;
  padding-bottom: calc(30rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(30rpx + env(safe-area-inset-bottom));
  box-shadow: 0rpx -4rpx 24rpx 0rpx rgba(0, 0, 0, 0.08);

  .actual {
    position: absolute;
    top: -34rpx;
    left: 10rpx;
    font-size: 20rpx;
    color: #fff;
  }

  .first {
    font-size: 24rpx;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #F04455;
    line-height: 40rpx;
    margin-left: 10rpx;
  }

  .refooter-numll {
    position: relative;
    font-size: 36rpx;
    color: fff;
    font-weight: 500;
  }

  .refooter-pay {
    width: 351rpx;
    height: 84rpx;
    color: #000;
    background: linear-gradient(45deg, #2CE1F4 0%, #22F4A7 100%);
    border-radius: 70rpx;
    text-align: center;
    line-height: 84rpx;
    margin-top: 20rpx;

  }
}

.speak {
  width: 100%;
  min-height: 500rpx;
  padding: 0 32rpx 200rpx 32rpx;
  color: #fff;
  background: linear-gradient(226deg, #172828, #0f1817);

  .speak-title {
    margin-bottom: 40rpx;
    position: relative;
    line-height: 57px;
    text-align: center;
    font-size: 17px;
    font-weight: 700;

    image {
      width: 40rpx;
      height: 40rpx;
      position: absolute;
      top: 28rpx;
      right: 0rpx;
    }
  }

  .pricek {
    font-size: 96rpx;

    text {
      font-size: 30rpx;
      margin-right: 10rpx;
    }
  }

  .paytype {
    background: #f4f4f414;
    border-radius: 32rpx;
    margin-top: 80rpx;
  }

  .paytype-item {
    height: 144rpx;
    line-height: 144rpx;
    position: relative;

    .icon {
      width: 50rpx;
      height: 50rpx;
      position: relative;
      top: 10rpx;
      margin: 0 20rpx 0 40rpx;
    }

    .play {
      width: 50rpx;
      height: 50rpx;
      position: absolute;
      top: 50rpx;
      right: 30rpx;
    }
  }

  .paytype-border {
    height: 1rpx;
    background: #cccccc;
    margin-left: 100rpx;
  }


  .speak-footer {
    display: flex;
    justify-content: space-between;
    position: fixed;
    left: 20rpx;
    right: 20rpx;
    bottom: 40px;

    .item {
      line-height: 80rpx;
      text-align: center;
      border-radius: 70rpx;
      font-size: 28rpx;
    }

    .left {
      width: 35%;
      background: rgba(18, 18, 18, 0);
      border-radius: 43rpx;
      color: #fff;
      border: 1px solid #f5f5f5;
    }

    .right {
      width: 60%;
      color: #000;
      background: linear-gradient(45deg, #2CE1F4 0%, #22F4A7 100%);
      border-radius: 43rpx;
    }
  }
}

.font_9 {
  font-size: 28rpx;
  font-family: PingFangSC-Regular;
  line-height: 35rpx;
  color: #ffffff;
}

.group_6 {
  // line-height: 34rpx;
  text-align: center;
  padding-bottom: 40rpx;

  .text_10 {
    line-height: 34rpx;
  }

  .text_11 {
    line-height: 34rpx;
  }

  .text_12 {
    line-height: 34rpx;
  }

  .text_13 {
    color: #00ebd3;
    line-height: 34rpx;
  }
}


.form-box {
  padding: 32rpx;

  .input-box {
    width: 100%;
    margin-top: 20rpx;
    background: #262628;
    border-radius: 55rpx 55rpx 55rpx 55rpx;
    height: 68rpx;
    padding: 0 32rpx;
    color: #fff;
  }

  .placeholder_class {
    background: #262628;
    color: #fff;
  }
}

.content-box {
  color: #959595;
  font-size: 28rpx;

  .input-box {
    width: 100%;
    margin-top: 20rpx;
    background: #262628;
    border-radius: 55rpx 55rpx 55rpx 55rpx;
    height: 90rpx;
    line-height: 90rpx;
    padding: 0 32rpx;
    color: #fff;
  }
}


/deep/ .u-popup {
  z-index: 997 !important;
}

/deep/ .u-transition.u-fade-enter-to.u-fade-enter-active {
  z-index: 997 !important;
}
</style>
