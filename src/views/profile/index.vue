<template>
  <div>
    <el-card style="margin-bottom: 20px">
      <div slot="header" class="clearfix">
        <div class="card-header">
          <span>About me</span>
          <el-button type="primary" @click="onEdit">Edit</el-button>
        </div>
      </div>
      <div class="user-profile">
        <div class="box-center">
          <pan-thumb
            :image="imgPath+user.imgheader"
            :height="'100px'"
            :width="'100px'"
            :hoverable="false"
          >
            <div>Hello</div>
            {{ user.role[0] }}
          </pan-thumb>
        </div>
        <div class="box-center">
          <div class="user-name text-center">{{ user.username }}</div>
          <div class="user-role text-center text-muted">{{ user.role[0] }}</div>
        </div>
      </div>
      <div class="user-bio">
        <div class="user-education user-bio-section">
          <div class="user-bio-section-header">
            <svg-icon icon-class="education" /><span>Education</span>
          </div>
          <div class="user-bio-section-body">
            <div class="text-muted">
              JS in Computer Science from the University of Technology
            </div>
          </div>
        </div>
        <div class="user-skills user-bio-section">
          <div class="user-bio-section-header">
            <svg-icon icon-class="skill" /><span>Skills</span>
          </div>
          <div class="user-bio-section-body">
            <div class="progress-item">
              <span>Vue</span>
              <el-progress :percentage="70" />
            </div>
            <div class="progress-item">
              <span>JavaScript</span>
              <el-progress :percentage="18" />
            </div>
            <div class="progress-item">
              <span>Css</span>
              <el-progress :percentage="12" />
            </div>
            <div class="progress-item">
              <span>ESLint</span>
              <el-progress :percentage="100" status="success" />
            </div>
          </div>
        </div>
      </div>
    </el-card>
    <!-- 添加用户弹框 -->
    <el-dialog title="编辑" :visible.sync="dialogVisible">
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <div class="box-center">
          <pan-thumb
            :image="imgPath+ruleForm.imgheader"
            :height="'100px'"
            :width="'100px'"
            :hoverable="false"
          >
            <div>Hello</div>
            {{ user.role[0] }}
          </pan-thumb>
        </div>
        <el-form-item label="头像">
          <upload-file :fileList="[]" listType="cropper" :on-success="getLogoImages" />
        </el-form-item>
        <!-- 用户名 -->
        <el-form-item label="用户名" prop="merCode">
          <span>{{ user.username }}</span>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item label="密码" prop="password">
          <el-input v-model="ruleForm.password"></el-input>
        </el-form-item>
        <!-- 确认密码 -->
        <el-form-item
          label="确认密码"
          prop="confirmPassword"
        >
          <el-input v-model="ruleForm.confirmPassword"></el-input>
        </el-form-item>
        <!-- 手机号 -->
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="ruleForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="submitForm('ruleForm')"
          :loading="formLoading"
          >确定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import PanThumb from "@/components/PanThumb";
import UploadFile from "@/components/UploadFile";
import { setUserinfo } from '@/utils/auth'
import { mapState } from "vuex";
import { upload } from "@/api/upload";
import { updateUser } from "@/api/user";
import {IMGPATH} from "@/api/config";
export default {
  components: { PanThumb ,UploadFile},
  data() {
    // 密码不能为空
    var validatePassword = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$t("密码不能为空")));
      }
      callback();
    };
    // 手机号不能为空
    var validateMobile = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$t("手机号不能为空")));
      }
      callback();
    };
    // 确认密码
    var validateConfirmPassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error(this.$t("密码不能为空")));
      } else if (value != this.ruleForm.password) {
        callback(new Error(this.$t("密码不一致")));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        password: "",
        mobile: "",
        imgheader: "",
        confirmPassword: "",
      },
      rules: {
        password: [{ validator: validatePassword, trigger: "blur" }],
        mobile: [{ validator: validateMobile, trigger: "blur" }],
        confirmPassword: [
          { trigger: "blur", validator: validateConfirmPassword },
        ],
      },
      dialogVisible: false,
      formLoading: false,
    };
  },
  computed: {
    ...mapState({
      user: (state) => state.user.userinfo,
    }),
    imgPath(){
        return IMGPATH;
    }
  },
  methods: {
    onEdit() {
      this.dialogVisible = true;
      this.ruleForm.imgheader = this.user.imgheader;
      this.ruleForm.mobile = this.user.mobile;
    },
    // 确认添加或修改用户
    submitForm(formName) {
      this.formLoading = true;
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          try {
            console.log(this.ruleForm);
            let res = await updateUser(this.ruleForm);
            Object.assign(this.user,res);
            setUserinfo(this.user);
            this.dialogVisible = false;
            this.formLoading = false;
          } catch (error) {
            console.log('error',error)
            this.formLoading = false;
          }
        } else {
          console.log("error submit!!");
          this.formLoading = false;
          return false;
        }
      });
    },
     // 上传图片成功的回调
    getLogoImages(res,file,fileList){
      this.ruleForm.imgheader = res.imgPath;
    },
  },
};
</script>

<style lang="scss" scoped>
.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-profile {
  .user-name {
    font-weight: bold;
  }

  .box-center {
    padding-top: 10px;
  }

  .user-role {
    padding-top: 10px;
    font-weight: 400;
    font-size: 14px;
  }

  .box-social {
    padding-top: 30px;

    .el-table {
      border-top: 1px solid #dfe6ec;
    }
  }

  .user-follow {
    padding-top: 20px;
  }
}

.user-bio {
  margin-top: 20px;
  color: #606266;

  span {
    padding-left: 4px;
  }

  .user-bio-section {
    font-size: 14px;
    padding: 15px 0;

    .user-bio-section-header {
      border-bottom: 1px solid #dfe6ec;
      padding-bottom: 10px;
      margin-bottom: 10px;
      font-weight: bold;
    }
  }
}
</style>
