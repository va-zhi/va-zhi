<template>
  <div class="users">
    <el-breadcrumb >
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model='queryInfo.query' clearable @clear="getUser">
            <el-button slot="append" icon="el-icon-search" @click="getUser"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表 -->
      <el-table :data="users" border stripe :disabled="userInfo.id == 500">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态" >
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="175px" >
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeDialog(scope.row.id)"></el-button>
            <el-tooltip class="item" effect="dark" content="权限管理" placement="top-start" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click=setRole(scope.row)></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 3, 5]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogVisible">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" >
        <el-form-item label="用户名" prop="username" >
          <el-input v-model="addForm.username" ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile" >
          <el-input v-model="addForm.mobile" maxlength='11'></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary"  @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
      >
      <el-form :model="editForm"  :rules="editFormRules" ref="editFormRef" label-width="100px" >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username"  disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile" >
          <el-input v-model="editForm.mobile" maxlength='11'></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo(editForm.id)">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 权限管理 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRoleDialogClosed"
      >
      <div>
        <p>当前的用户：{{userInfo.username}}</p>
        <p>当前的角色：{{userInfo.role_name}}</p>
        <p>分配新角色：
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    var checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/

      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb()
      }

      cb(new Error('请输入合法的邮箱'))
    }

    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/

      if (regMobile.test(value)) {
        return cb()
      }

      cb(new Error('请输入合法的手机号'))
    }

    return {
      // 添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editForm: {},
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 修改验证规则
      editFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' }

        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' }
        ]
      },
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      total: 0,
      users: [],
      addDialogVisible: false,
      editDialogVisible: false,
      setRightDialogVisible: false,
      userInfo: {},
      rolesList: [],
      selectedRoleId: ''
    }
  },
  created () {
    this.getUser()
  },
  methods: {
    async getUser () {
      const { data: { data, meta } } = await this.$http.get('users', { params: this.queryInfo })
      if (meta.status !== 200) return this.$message.error(meta.msg)
      this.total = data.total
      this.users = data.users
    },
    handleSizeChange (newSize) {
      // console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getUser()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getUser()
    },
    async userStateChanged (userInfo) {
      const { data: { meta } } = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
      if (meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('操作失败')
      }
    },
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    addUser () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: { meta } } = await this.$http.post('users', this.addForm)
        if (meta.status !== 201) {
          return this.$message.error('添加失败')
        }
        this.$message.success('添加成功')
        this.addDialogVisible = false
        this.getUser()
      })
    },
    // 修改点击
    async showEditDialog (id) {
      const { data: { data, meta } } = await this.$http.get('users/' + id)
      if (meta.status !== 200) return this.$message.error(meta.msg)
      this.editForm = data
      this.editDialogVisible = true
    },
    // 监听修改用户对话框的关闭事件
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    editUserInfo (id) {
      console.log(id)
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: { meta } } = await this.$http.put('users/' + id, {
          email: this.editForm.email,
          mobile: this.editForm.mobile
        })
        if (meta.status !== 200) {
          return this.$message.error('更新用户信息失败！')
        }
        this.$message.success('更新用户信息成功！')
        this.editDialogVisible = false
        this.getUser()
      })
    },
    async removeDialog (id) {
      try {
        await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const { data: { meta } } = await this.$http.delete('users/' + id)
        if (meta.status !== 200) {
          return this.$message.error('删除失败')
        }
        this.$message.success('删除成功')
        this.getUser()
      } catch (err) {
        this.$message.info('已经取消')
      }
    },
    async setRole (row) {
      this.userInfo = row
      console.log(this.userInfo)
      this.setRightDialogVisible = true
      const { data: { data, meta } } = await this.$http.get('roles')
      if (meta.status !== 200) {
        return this.$message.error('获取角色列表失败！')
      }
      this.rolesList = data
    },
    async saveRoleInfo () {
      if (!this.selectedRoleId) {
        return this.$message.error('请选择要分配的角色！')
      }
      const { data: { meta } } = await this.$http.put(`users/${this.userInfo.id}/role`, { rid: this.selectedRoleId })
      if (meta.status !== 200) return this.$message.error('更新角色失败！')
      this.$message.success('更新角色成功！')
      this.getUser()
      this.setRightDialogVisible = false
    },
    setRoleDialogClosed () {
      this.selectedRoleId = ''
      this.userInfo = {}
    }
  }
}
</script>
<style lang='less' scoped>
</style>
