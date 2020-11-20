<template>
  <div>
    <!-- 添加权限 -->
    <el-button type="primary" size="mini" @click="addClick">添加权限</el-button>
    <!-- 删除权限 -->
    <el-button
      type="danger"
      :disabled="selectAuthListId.length <= 0"
      @click="delClick(selectAuthListId)"
      size="mini"
      >批量删除权限</el-button
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
      <el-table-column prop="authname" label="权限名" width="180">
      </el-table-column>
      <el-table-column prop="authurl" label="权限路径">
      </el-table-column>
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
        <!-- 权限名 -->
        <el-form-item label="权限名">
            <el-input
              v-model="detail.authname"
              placeholder="请输入权限名"
            ></el-input>
        </el-form-item>
        <!-- 权限路径 -->
        <el-form-item label="权限路径">
          <el-input
            v-model="detail.authurl"
            placeholder="请输入权限路径"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editClick">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getAuthList, delAuth, addUpdateAuth } from "@/api/user";
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
        authname: "",
        authurl: "",
      }, //详情
      dialogVisible: false,
      selectAuthListId:[]
    };
  },
  mounted() {
    // 初始化
    this.getList();
  },
  methods: {
    // 获取各种数据
    async getList(obj = this.listQuery) {
      try {
        this.tableLoading = true;
        const res = await getAuthList(obj);
        this.tableData = res.list;
        this.total = res.total;
        this.tableLoading = false;
      } catch (error) {
        console.log("error", error);
        this.tableLoading = false;
      }
    },
    updateClick(obj) {
      this.detail = obj;
      console.log(obj, this.roleList);
      this.dialogVisible = true;
    },
    // 确认修改权限
    async editClick() {
      let res = await addUpdateAuth(this.detail);
      this.$message({
        message: "操作成功",
        type: "success",
      });
      this.dialogVisible = false;
      this.getList();
    },
    // 选中权限
    handleselectAuth(val) {
      let arr = [];
      val.forEach((item) => {
        arr.push(item.id);
      });
      this.selectAuthListId = arr;
      console.log(this.selectAuthListId);
    },
    // 添加权限
    async addClick() {
      this.dialogVisible = true;
    },
    // 删除权限
    async delClick(arr) {
      let res = await delAuth({ auth: arr });
      this.$message({
        message: "删除成功",
        type: "success",
      });
      this.getList();
    },
  },
};
</script>

<style lang="scss" scoped>
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
</style>