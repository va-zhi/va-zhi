<template>
  <div class="roles">
    <el-breadcrumb >
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="rolesList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for="(item1, i1) in scope.row.children" :key="item1.id" :class="['bdbottom','vcenter',{bdtop:i1==0}]">
              <el-col :span='5'>
                <el-tag>{{item1.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span='19'>
                <el-row v-for="(item2,i2) in item1.children" :key="item2.id" :class="{bdtop:i2!=0}">
                  <el-col :span='6'>
                    <el-tag type="success">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span='18'>
                    <el-tag type="warning" v-for="(item3 ) in item2.children" :key="item3.id" closable @close="removeRightById(scope.row, item3.id)">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限的对话框 -->
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" >
      <!-- 树形控件 -->
      <el-tree :data="rightsList" :props="treeProps" show-checkbox node-key="id" :default-checked-keys="defKeys" ref="treeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
          <el-button @click="setRightDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      rolesList: [],
      setRightDialogVisible: false,
      rightsList: [],
      defKeys: [],
      roleId: '',
      // 树形控件的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      }
    }
  },
  created () {
    this.getRoles()
  },
  methods: {
    async getRoles () {
      const { data: { data, meta } } = await this.$http.get('roles')
      if (meta.status !== 200) return this.$message.error('获取角色列表失败！')
      this.rolesList = data
    },
    async removeRightById (role, rightId) {
      console.log(role)
      try {
        await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const { data: { data, meta } } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
        if (meta.status !== 200) {
          return this.$message.error('删除失败')
        }
        this.$message.success('删除成功')
        role.children = data
      } catch (err) {
        this.$message.info('已经取消')
      }
    },
    async showSetRightDialog (role) {
      this.setRightDialogVisible = true
      this.roleId = role.id
      const { data: { data, meta } } = await this.$http.get('rights/tree')
      if (meta.status !== 200) return this.$message.error('获取权限数据失败！')
      this.rightsList = data
      console.log(data)
      this.getLeafKeys(role, this.defKeys)
    },
    getLeafKeys (node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    async allotRights () {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      console.log(idStr)

      const { data: { meta } } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      )
      if (meta.status !== 200) {
        return this.$message.error('分配权限失败！')
      }
      this.$message.success('分配权限成功！')
      this.getRoles()
      this.setRightDialogVisible = false
    }

  }
}
</script>
<style lang='less' scoped>
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display:flex;
  align-items: center
}
</style>
