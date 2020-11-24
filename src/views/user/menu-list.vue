<template>
  <div>
    <!-- 添加权限 -->
    <el-button type="primary" size="mini" @click="addClick">添加一级菜单</el-button>
    <el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick">
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span class="tree-item-edit">
            <el-button
              v-if="node.level<3"
              type="text"
              size="mini"
              @click="() => addClick(data.id)"
            >添加子菜单</el-button>
            <el-button type="text" size="mini" @click="() => updateClick(data)">编辑</el-button>
            <el-button type="text" size="mini" @click="() => delClick(data)">删除</el-button>
          </span>
        </span>
    </el-tree>
    <!-- 编辑 -->
    <el-dialog
      :title="detail.id ? '编辑菜单' : '新增菜单'"
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
        <!-- 菜单名 -->
        <el-form-item label="菜单名">
            <el-input
              v-model="detail.menuname"
              placeholder="请输入菜单名"
            ></el-input>
        </el-form-item>
        <!-- 菜单说明 -->
        <el-form-item label="菜单说明">
          <el-input
            v-model="detail.brief"
            placeholder="请输入菜单说明"
          ></el-input>
        </el-form-item>
        <!-- 菜单地址 -->
        <el-form-item label="菜单地址">
          <el-input
            v-model="detail.menuurl"
            placeholder="请输入菜单地址"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="confirmClick">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getMenuList, delMenu, addUpdateMenu } from "@/api/user";
export default {
  data() {
    return {
      treeData: [],
      tableLoading: false, //列表加载中
      // 列表分页
      listQuery: {
        page: 1,
        limit: 10,
      },
      total: 0, //总数
      detail: {
        id: "",
        menuname: "",
        menuurl: "",
        pid:0
      }, //详情
      dialogVisible: false,
      selectAuthListId:[],
      defaultProps: {
        children: 'children',
        label: 'menuname'
      }
    };
  },
  mounted() {
    // 初始化
    this.getList();
  },
  methods: {
    // 获取各种数据
    async getList() {
      try {
        this.tableLoading = true;
        const res = await getMenuList();
        this.treeData = res;
        this.tableLoading = false;
      } catch (error) {
        console.log("error", error);
        this.tableLoading = false;
      }
    },
    updateClick(obj) {
      this.detail = obj;
      console.log(obj);
      this.dialogVisible = true;
    },
    // 确认修改权限
    async confirmClick() {
      let res = await addUpdateMenu(this.detail);
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
    async addClick(pid=0) {
      this.detail={
        id: "",
        menuname: "",
        menuurl: "",
        pid
      }
      this.dialogVisible = true;
    },
    // 删除权限
    async delClick(data) {
      let arr = this.idDigui(data);
      let res = await delMenu({ menu: arr });
      this.$message({
        message: "删除成功",
        type: "success",
      });
      this.getList();
    },
    idDigui(data){
        let arr = [];
        arr.push(data.id);
        data.children.forEach((item)=>{
            let arr1 = this.idDigui(item)
            arr.push(...arr1)
        })
        return arr;
    },
    handleNodeClick(data) {
        console.log(data);
      }
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
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
  .tree-item-edit {
    display: none;
  }
}
.custom-tree-node:hover {
  .tree-item-edit {
    display: block !important;
  }
}
</style>