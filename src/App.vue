<template>
  <div id="app">
    <cc-header></cc-header>
    <router-view></router-view>
    <cc-footer></cc-footer>
    <mu-snackbar v-if="toast_state" :message="toast_messae" action="关闭" @actionClick="hideToast" @close="hideToast"/>
  </div>
</template>

<script>
import CC from "./js/base.js";
import Sidebar from "./components/Sidebar";
import Subject from "./components/Subject";
import CcHeader from "./components/cc-header";
import CcFooter from "./components/cc-footer";
import CcList from "./components/cc-list";
export default {
  name: "app",
  data() {
    return {
      resume: JSON.parse(window.localStorage.getItem("resume")) || CC,
      avatar: JSON.parse(window.localStorage.getItem("avatar")) || ""
    };
  },
  components: {
    Sidebar,
    Subject,
    CcHeader,
    CcFooter,
    CcList
  },
  methods: {
    toast(message, time) {
      this.toast_messae = message;
      this.toast_state = true;
      if(!time){
        return
      }

      if (this.toast_timer) clearTimeout(this.toast_timer);

      this.toast_timer = setTimeout(() => {
        this.toast_state = false;
      }, time ? time : 2000);
    },
    hideToast() {
      this.toast_state = false;
      if (this.toast_timer) clearTimeout(this.toast_timer);
    },

    add(val, type, index, types) {
      let vals = {};
      for (let i in val) {
        vals[i] = val[i];
        val[i] = "";
      }
      if (arguments.length === 2) {
        this.resume[type].push(vals);
      } else {
        this.resume[type][index][types].push(vals);
      }
    },
    del(val, type, index, types) {
      if (arguments.length === 2) {
        this.resume[type].splice(val, 1);
      } else {
        this.resume[type][index][types].splice(val, 1);
      }
    },
    change(val) {
      this.avatar = val;
    },
    changeJ(obj) {
      this.resume = obj;
    },
    reset() {
      this.resume = {
        core: [

          { name: "姓名", value: "" },
          { name: "职业", value: "" },
          { name: "电话", value: "" },
          { name: "简介", value: "" }
        ],
        skils: [
          { name: "skilname", skil: 10 },
          { name: "skilname", skil: 22 },
          { name: "skilname", skil: 30 }
        ],
        exp: [
          {
            name: "教育经历",
            exp: [
              { startTime: "", endTime: "", company: "", job: "", exps: "" }
            ]
          },
          {
            name: "工作经历",
            exp: [
              { startTime: "", endTime: "", company: "", job: "", exps: "" }
            ]
          },
          {
            name: "项目经历",
            exp: [
              { startTime: "", endTime: "", company: "", job: "", exps: "" }
            ]
          }
        ],
        custom: [{ name: "自我评价", exps: "" }]
      };
      this.avatar = "";
    },
    cc() {
      this.resume = CC;
    }
  },
  watch: {
    resume: {
      handler: function(resume) {
        window.localStorage.setItem("resume", window.JSON.stringify(resume));
      },
      deep: true
    },
    avatar: {
      handler: function(avatar) {
        window.localStorage.setItem("avatar", window.JSON.stringify(avatar));
      }
    }
  },
  data() {
    return {
      toast_state: false,
      toast_messae: ""
    };
  },
};
</script>

<style>
#app {
  width: 100%;
  background: #fff;
}
#app .sidebar {
  width: 100%;
}
#app .subject {
  width: 100%;
  padding: 20px;
  padding-bottom: 0;
  background: #ddd;
}
#app .mu-slider-thumb {
  background-color: #fff;
  color: #fff;
}
#app .mu-slider-fill {
  background-color: #fff;
}
@media screen and (min-width: 375px) {
  html {
    /* iPhone6的375px尺寸作为16px基准，414px正好18px大小, 600 20px */
    font-size: calc(100% + 2 * (100vw - 375px) / 39);
    font-size: calc(16px + 2 * (100vw - 375px) / 39);
  }
}
@media screen and (min-width: 414px) {
  html {
    /* 414px-1000px每100像素宽字体增加1px(18px-22px) */
    font-size: calc(112.5% + 4 * (100vw - 414px) / 586);
    font-size: calc(18px + 4 * (100vw - 414px) / 586);
  }
}
@media screen and (min-width: 600px) {
  html {
    /* 600px-1000px每100像素宽字体增加1px(20px-24px) */
    font-size: calc(125% + 4 * (100vw - 600px) / 400);
    font-size: calc(20px + 4 * (100vw - 600px) / 400);
  }
  #app {
    flex-direction: row;
  }
  #app .sidebar {
    width: 35%;
  }
  #app .subject {
    width: 65%;
  }
  #app .avatar {
    width: 10em;
    height: 10em;
  }
}
.app-main{
  display: flex;
  margin: 0 auto;
  background: #fff;
}
@media screen and (min-width: 1000px) {
  html {
    /* 1000px往后是每100像素0.5px增加 */
    font-size: calc(137.5% + 6 * (100vw - 1000px) / 1000);
    font-size: calc(22px + 6 * (100vw - 1000px) / 1000);
  }
  .app-main {
    width: 1000px;
  }
  .app-main .subject {
    width: 75%;
    padding: 1.5em 2em;
  }
  .app-main .avatar {
    width: 13em;
    height: 13em;
  }
}
@media screen and (min-width: 1200px) {
  .app-main {
    width: 1200px;
  }
}
</style>


