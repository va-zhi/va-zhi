<template>
    <el-container class="home-container">
    <el-header>
      <div>
        <img src="./heima.png" alt="">
        <span>电商项目管理</span>
      </div>
      <el-button type="primary" @click="toLogin">退出</el-button>
    </el-header>
    <el-container>
    <el-aside :width="width">
      <div class="toggle-button" @click="toggleCollapse">|||</div>
      <el-menu
      background-color="#333744"
      text-color="#fff"
      active-text-color="#ffd04b"
      unique-opened
      :collapse = 'isCollapse'
      :collapse-transition = "false"
      router
      :default-active="activePath"
      >
        <el-submenu :index="menu.id+''" v-for="menu in menus" :key="menu.id">
          <template slot="title">
            <i :class="icontObj[menu.id]"></i>
            <span>{{menu.authName}}</span>
          </template>
            <el-menu-item :index="'/'+submenu.path" v-for="submenu in menu.children" :key="submenu.id"
            @click="saveNvaState('/'+submenu.path)">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{submenu.authName}}</span>
              </template>
            </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  created () {
    this.getMenus()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  data () {
    return {
      menus: [],
      activePath: '',
      isCollapse: false,
      icontObj: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      }
    }
  },
  methods: {
    toLogin () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenus () {
      const { data: { data, meta } } = await this.$http.get('menus')
      console.log(data, meta)
      if (meta.status !== 200) return this.$message.error(meta.msg)
      this.menus = data
    },
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    saveNvaState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  },
  computed: {
    width () {
      return this.isCollapse ? '64px' : '200px'
    }
  }
}
</script>
<style lang='less' scoped>
  .home-container {
    height: 100%;
  }
  .el-header {
    background-color: #373d41;
    display:flex;
    justify-content:space-between;
    padding-left: 0;
    align-items: center;
    color: #fff;
    font-size: 20px;
    > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
  }
  .el-aside {
    background-color: #333744;
    .toggle-button {
      background-color: pink;
      font-size: 10px;
      line-height: 24px;
      color: #fff;
      text-align: center;
      letter-spacing: 0.2em;
      cursor: pointer;
    }
    .el-menu {
      border-right: none;
    }
  }
  .el-main {
  background-color: #eaedf1;
  }
  .iconfont {
  margin-right: 10px;
}
</style>
