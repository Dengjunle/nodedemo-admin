<template>
  <div>
    <!-- 添加角色 -->
    <el-button type="primary" size="mini" @click="addClick">添加角色</el-button>
    <!-- 删除角色 -->
    <el-button
      type="danger"
      :disabled="selectAuthListId.length <= 0"
      @click="delClick(selectAuthListId)"
      size="mini"
      >批量删除角色</el-button
    >
    <el-table
      :data="tableData"
      border
      v-loading="tableLoading"
      style="width: 100%"
      @selection-change="handleselectAuth"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="id" label="id" width="55"> </el-table-column>
      <el-table-column prop="name" label="角色名" width="180">
      </el-table-column>
      <el-table-column prop="brief" label="角色说明"> </el-table-column>
      <!-- 操作 -->
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <!-- 修改、删除 -->
          <el-button @click="updateClick(scope.row)" type="text" size="small"
            >修改</el-button
          >
          <el-button @click="delClick([scope.row.id])" type="text" size="small"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
    <!-- 编辑 -->
    <el-dialog
      :title="detail.id ? '编辑' : '新增'"
      :visible.sync="dialogVisible"
      class="dialog-form"
    >
      <el-form
        :model="detail"
        status-icon
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <!-- 角色名 -->
        <el-form-item label="角色名">
          <el-input v-model="detail.name" placeholder="请输入角色名"></el-input>
        </el-form-item>
        <!-- 角色路径 -->
        <el-form-item label="角色描述">
          <el-input
            v-model="detail.brief"
            placeholder="请输入角色描述"
          ></el-input>
        </el-form-item>
        <el-form-item label="权限">
          <el-transfer
            :titles="['未拥有的权限', '拥有的权限']"
            :data="authList"
            v-model="detail.authList"
          ></el-transfer>
        </el-form-item>
        <el-form-item label="菜单">
        <el-tree ref="tree"  node-key="id" :data="menuList" :props="defaultProps" show-checkbox @check-change="handleCheckChange"></el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editClick">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList, delRole, addUpdateRole, getAuthList,getMenuList } from "@/api/user";
import Pagination from "@/components/Pagination";
export default {
  components: {
    Pagination,
  },
  data() {
    return {
      tableData: [],
      tableLoading: false, //列表加载中
      // 列表分页
      listQuery: {
        page: 1,
        limit: 10,
      },
      total: 0, //总数
      detail: {
        id: "",
        name: "",
        brief: "",
        authList:[],
        menuList:[]
      }, //详情
      dialogVisible: false,
      selectAuthListId: [],
      authList: [],
      menuList: [],
      defaultProps: {
        children: 'children',
        label: 'menuname'
      }
    };
  },
  mounted() {
    // 初始化
    this.getList();
    this.getAuth();
    this.getMenu();
  },
  methods: {
    // 获取各种数据
    async getList(obj = this.listQuery) {
      try {
        this.tableLoading = true;
        const res = await getRoleList(obj);
        this.tableData = res.list;
        this.total = res.total;
        this.tableLoading = false;
      } catch (error) {
        console.log("error", error);
        this.tableLoading = false;
      }
    },
    // 获取权限列表
    async getAuth() {
      let params = { page: 1, limit: 900 };
      let res = await getAuthList(params);
      let authList = this.authList;
      res.list.forEach((item) => {
        authList.push({
          key: item.id,
          label: item.authname,
          disabled: false,
        });
      });
    },
    // 获取菜单列表
    async getMenu(){
        let res = await getMenuList();
        this.menuList = res;
    },
    // 编辑角色
    updateClick(obj) {
      this.detail = obj;
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys(obj.menuList);
      });
      console.log(obj, this.authList);
      this.dialogVisible = true;
    },
    // 确认修改角色
    async editClick() {
      this.detail.menuList = this.$refs.tree.getCheckedKeys();
        console.log(this.detail)
      let res = await addUpdateRole(this.detail);
      this.$message({
        message: "操作成功",
        type: "success",
      });
      this.dialogVisible = false;
      this.getList();
    },
    // 选中角色
    handleselectAuth(val) {
      let arr = [];
      val.forEach((item) => {
        arr.push(item.id);
      });
      this.selectAuthListId = arr;
      console.log(this.selectAuthListId);
    },
    // 添加角色
    async addClick() {
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys([]);
      });
      this.dialogVisible = true;
    },
    // 删除角色
    async delClick(arr) {
      let res = await delRole({ auth: arr });
      this.$message({
        message: "删除成功",
        type: "success",
      });
      this.getList();
    },
    // 选择的菜单发生变化
    handleCheckChange(data){
        console.log(data)
        console.log(this.$refs.tree.getCheckedNodes());
        console.log(this.$refs.tree.getCheckedKeys());
    }
  },
};
</script>

<style lang="scss">
.detail-header {
  display: flex;
  align-items: center;
  .detail-img {
    width: 100px;
    height: 100px;
    border-radius: 999px;
    background-color: #cccccc;
    img {
      width: 100%;
      height: 100%;
      border-radius: 999px;
    }
  }
  .detail-upload {
    margin-left: 20px;
  }
}
.imgheader {
  width: 70px;
  height: 70px;
  img {
    width: 100%;
    height: 100%;
  }
}
.el-transfer-panel {
  width: 170px;
}
.el-transfer__buttons {
  padding: 0 15px;
}
</style>