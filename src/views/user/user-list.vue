<template>
  <div>
    <!-- 添加用户 -->
    <el-button type="primary" size="mini" @click="addClick">添加用户</el-button>
    <!-- 删除用户 -->
    <el-button
      type="danger"
      :disabled="selectUserListId.length <= 0"
      @click="delClick(selectUserListId)"
      size="mini"
      >批量删除用户</el-button
    >
    <el-table
      :data="tableData"
      border
      v-loading="tableLoading"
      style="width: 100%"
      @selection-change="handleSelectUser"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="id" label="id" width="55"> </el-table-column>
      <el-table-column prop="username" label="用户名" width="180">
      </el-table-column>
      <el-table-column prop="mobile" label="手机号" width="180">
      </el-table-column>
      <el-table-column prop="rolename" label="身份"> </el-table-column>
      <el-table-column prop="imgheader" label="头像">
        <template slot-scope="scope">
          <div class="imgheader">
            <img :src="imgpath + scope.row.imgheader" />
          </div>
        </template>
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
        <!-- 头像 -->
        <el-form-item label="头像">
          <div class="detail-header">
            <div class="detail-img">
              <img :src="imgpath + detail.imgheader" />
            </div>
            <div class="detail-upload">
              <upload-file
                :fileList="[]"
                listType="picture-card"
                :on-success="getLogoImages"
              />
            </div>
          </div>
        </el-form-item>
        <!-- 用户名 -->
        <el-form-item label="用户名">
          <span v-if="detail.id">{{ detail.username }}</span>
          <div v-if="!detail.id">
            <el-input
              v-model="detail.username"
              placeholder="请输入用户名"
            ></el-input>
          </div>
        </el-form-item>
        <!-- 手机号 -->
        <el-form-item label="手机号">
          <el-input
            v-model="detail.mobile"
            placeholder="请输入手机号"
          ></el-input>
        </el-form-item>
        <!-- 身份 -->
        <el-form-item label="身份">
          <el-radio-group v-model="detail.roleid">
            <template v-for="item in roleList">
              <el-radio :key="item.id" :label="item.id">{{
                item.name
              }}</el-radio>
            </template>
          </el-radio-group>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item  v-if="!detail.id" label="密码">
          <el-input
            v-model="detail.password"
            placeholder="请输入密码"
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
import {
  getUserList,
  editUser,
  delUser,
  addUser,
  getRole,
} from "@/api/user";
import Pagination from "@/components/Pagination";
import UploadFile from "@/components/UploadFile";
import { IMGPATH } from "@/api/config";
export default {
  components: {
    Pagination,
    UploadFile,
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
        imgheader: "",
        mobile: "",
        roleid: 2,
        password: "",
        username: "",
      }, //详情
      dialogVisible: false,
      roleList: [], //权限列表
      selectUserListId: [],
    };
  },
  computed: {
    imgpath() {
      return IMGPATH;
    },
  },
  mounted() {
    // 初始化
    this.getList();
    this.getRole();
  },
  methods: {
    // 获取身份权限列表
    async getRole() {
      let res = await getRole();
      this.roleList = res;
    },
    // 获取各种数据
    async getList(obj = this.listQuery) {
      try {
        this.tableLoading = true;
        const res = await getUserList(obj);
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
    // 上传图片成功的回调
    getLogoImages(res, file, fileList) {
      this.detail.imgheader = res.imgPath;
    },
    // 确认修改用户
    async editClick() {
      if (this.detail.id) {
        let res = await editUser(this.detail);
        this.$message({
          message: "修改成功",
          type: "success",
        });
      } else {
        let res = await addUser(this.detail);
        this.$message({
          message: "添加成功",
          type: "success",
        });
      }

      this.dialogVisible = false;
      this.getList();
    },
    // 选中用户
    handleSelectUser(val) {
      let arr = [];
      val.forEach((item) => {
        arr.push(item.id);
      });
      this.selectUserListId = arr;
      console.log(this.selectUserListId);
    },
    // 添加用户
    async addClick() {
      this.dialogVisible = true;
    },
    // 删除用户
    async delClick(arr) {
      let res = await delUser({ user: arr });
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