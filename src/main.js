import Vue from 'vue'
import App from './App'
import Router from './router'
import 'muse-components/styles/base.less'
import row from 'muse-components/grid/row'
import col from 'muse-components/grid/col'
import slider from 'muse-components/slider'
import iconButton from 'muse-components/iconButton'
import flatButton from 'muse-components/flatButton'
import floatButton from 'muse-components/floatButton'
import dialog from 'muse-components/dialog'
import card from 'muse-components/card/card'
import cardTitle from 'muse-components/card/cardTitle'
import cardText from 'muse-components/card/cardText'
import cardActions from 'muse-components/card/cardActions'
import tooltip from 'muse-components/tooltip'
import textField from 'muse-components/textField'
import datePicker from 'muse-components/datePicker'
import snackbar from 'muse-components/snackbar'

const MUComponents = {
  row
  ,col
  ,slider
  ,iconButton
  ,flatButton
  ,floatButton
  ,dialog
  ,card
  ,cardTitle
  ,cardText
  ,cardActions
  ,tooltip
  ,textField
  ,datePicker
  ,snackbar
};

Object.keys(MUComponents).forEach((key) => {
  Vue.component(MUComponents[key].name, MUComponents[key])
})

import nebulas from "nebulas"
import nebpayCls from "nebpay.js"

var HttpRequest = nebulas.HttpRequest,
  Neb = nebulas.Neb,
  Account = nebulas.Account,
  Transaction = nebulas.Transaction,
  Unit = nebulas.Unit,
  Utils = nebulas.Utils;

var chainnetConfig = {
  mainnet: {
    name: "主网",
    contractAddress: "n1jPTNAdis1AwgjkrB2xeoRhDowjMqKz8wh",
    txhash: "51fdf96049a0335425cd69a0bf149c120fd96365d4774b523005eb957de97fb5",
    host: "https://mainnet.nebulas.io",
    payhost: "https://pay.nebulas.io/api/mainnet/pay",
    admin: "n1Wtby3Pv2k66w9DMHaSmM7DYMFuqiQQcF8",
  },
  testnet: {
    name: "测试网",
    contractAddress: "n1ervGaZAEeHgFeJRhXnW8S6PFvQZVmMehS",
    txhash: "9f0015c93730a15116be69d698a7fbed2b3975e6b4fd3d5be45f85c91337283e",
    host: "https://testnet.nebulas.io",
    payhost: "https://pay.nebulas.io/api/pay",
    admin: "n1J5YqDGzXbGNUwW9asuh4py2sjHr86XyHr",
  }
}
// var chain = process.env.NODE_ENV == 'development' ? "testnet" : "mainnet"
var chain = "mainnet"
var chainInfo = chainnetConfig[chain]
var contractAddress = chainInfo.contractAddress

var neb = new Neb();
neb.setRequest(new HttpRequest(chainInfo.host));

var nebApi = neb.api;
var nebPay = new nebpayCls();

Vue.prototype.nebApi = nebApi
Vue.prototype.nebPay = nebPay
Vue.prototype.chainInfo = chainInfo

var app

Vue.prototype.$hub = new Vue({
  watch: {
    address(n, o) {
      if (!n) {
        return
      }
    }
  },
  created: function () {
    this.messageListener()
    this.getWallectInfo()
    this.fetchUserInfo();
  },
  methods: {
    fetchUserInfo() {
      if (!this.address) {
        return
      }
      this.nebApiCall({
        func: "getColl"
      }).then(data => {
        if (data) {
          this.user = data
        }
      });
    },
    getWallectInfo: function () {
      window.postMessage({
        "target": "contentscript",
        "data": {},
        "method": "getAccount",
      }, "*");
    },
    messageListener: function () {
      var _this = this
      window.addEventListener('message', function (e) {
        if (e.data && e.data.data) {
          if (e.data.data.account) {
            _this.address = e.data.data.account
            // _this.updateUserInfo()
          }
        }
      })
    },
    nebApiCall: function (config) {
      // var _this = this
      var args = config.args || []
      return nebApi.call({
        chainID: this.nebState.chain_id,
        from: config.from || this.address || contractAddress,
        to: contractAddress,
        value: config.value || 0,
        // nonce: nonce,
        gasPrice: config.gasPrice || 1000000,
        gasLimit: config.gasLimit || 2000000,
        contract: {
          function: config.func,
          args: JSON.stringify(args)
        }
      }).then(resp => {
        if (resp.execute_err && resp.execute_err != 'insufficient balance') {
          // app.$refs.app.toast(resp.execute_err, 2000)
          app.$refs.app.toast('1111', 2000)
          // throw new Error(resp.execute_err)
        }
        // var result = JSON.parse(resp.result)
        // return result
      })
    },
    nebPayCall: function (config) {

      var options = config.options,
        toAddress = config.address || contractAddress,
        serialNumber = "",
        _this = this;

      if (!options) {
        options = {
          callback: chainInfo.payhost,
          listener: function (value) {
            mylog("listener:", value, serialNumber)

            if (typeof value == 'string') {

              app.$refs.app.toast("用户取消了交易！", 2000)
              return
            }


            config.serialNumber = serialNumber
            config.txhash = value.txhash

            app.$refs.app.toast("正在获取交易状态……")

            _this.checkTransaction(config)
          }
        }
      }


      serialNumber = nebPay.call(
        toAddress,
        config.value || 0,
        config.func,
        JSON.stringify(config.data),
        options
      );

      // mylog("生成的serialNumber：", serialNumber)

    },
    checkTransaction: function (config) {

      var serialNumber = config.serialNumber,
        context = config.context,
        minInterval = 6,
        intervalTime = config.intervalTime || minInterval,
        timeOut = config.timeOut || 60; //60秒后超时
      if (intervalTime < minInterval) { //API限制每分钟最多查询6次
        intervalTime = minInterval
      }
      var timeOutId = 0
      var timerId = setInterval(function () {
        // mylog("查询：", serialNumber)
        nebApi.getTransactionReceipt({
          hash: config.txhash
        }).then(function (receipt) {
          // status Transaction status, 0 failed, 1 success, 2 pending.
          // mylog("receipt:",receipt)

          if (receipt.status === 1) {
            clearInterval(timerId)
            // config.transStateNotify.close()
            app.$refs.app.toast_state = false

            if (timeOutId) {
              clearTimeout(timeOutId)
            }

            if (config.successMsg) {

              app.$refs.app.toast(config.successMsg || "操作成功", 2000)
            }
            // mylog(context)
            if (config.successFunc) {
              setTimeout(function () {
                config.successFunc(receipt)
              }, 500)

            }
          } else if (receipt.status === 0) {
            app.$refs.app.toast("合约调用失败！" + receipt.execute_result, 2000)
            clearInterval(timerId)
            if (timeOutId) {
              clearTimeout(timeOutId)
            }
          }
        }).catch(function (err) {
          // context.$message.error("查询交易结果发生了错误！" + err)
          app.$refs.app.toast("查询交易结果发生了错误！" + err, 2000)
        });
      }, intervalTime * 1000)
      timeOutId = setTimeout(function () {
        // config.transStateNotify.close()
        app.$refs.app.toast_state = false
        if (timerId) {
          // context.$message.error("查询超时！请稍后刷新页面查看最新内容！")
          app.$refs.app.toast("查询超时！请稍后刷新页面查看最新内容！", 2000)
          clearInterval(timerId)
        }
      }, timeOut * 1000)
    }
  },
  data() {
    return {
      address: "",
      user: {
        address: "",
        created: 0,
        companyHash: "",
        name: "",
        isCompanyAdmin: false,
      },
      company: {
        name: "",
        hash: ""
      },
      nebState: {
        chain_id: 0,
        height: "",
        lib: "",
        protocol_version: "",
        synchronized: false,
        tail: "",
        version: ""
      }
    }
  }
})

/* eslint-disable no-new */
app = new Vue({
  el: '#app',
  template: '<App ref="app" />',
  components: { App },
  router: Router
})
