<template>
  <div class="custom-upload">
    <el-dialog
      v-if="showCropper"
      :title="$t('cropper.title')"
      :visible.sync="showCropper"
      top="10vh"
      width="50%"
      height="100%"
      class="cropper-dialog"
      center
      append-to-body
    >
      <vue-cropper
        v-if="showCropper"
        id="corpper"
        ref="cropper"
        :class="{ 'corpper-warp': showCropper }"
        v-bind="cropper"
      />
      <div v-if="showCropper" class="cropper-button">
        <el-button
          class="cancel-btn"
          size="small"
          @click.native="cancel"
          >{{ $t("cropper.cancel") }}</el-button
        >
        <el-button
          size="small"
          type="primary"
          :loading="loading"
          @click="uploadCover"
          >{{ $t("cropper.confirm") }}</el-button
        >
      </div>
    </el-dialog>
    <!-- <div v-if="tips" class="tips clear-margin-top">{{ tips }}</div> -->
  </div>
</template>

<script>
// 上传文件组件
import { VueCropper } from 'vue-cropper'
import { isMaxFileSize } from '../upload' // 见下文
import { Message } from 'element-ui'

export default {
  components: {
    VueCropper
  },
  props: {
    // 最大上传文件的大小
    maxFileSize: {
      type: Number,
      default: 1 // （MB)
    },
    // 是否显示裁剪框
    showCropper:{
      type:Boolean,
      default:false
    },
    // 提示内容
    tips: {
      type: String
    },
    // 图片裁剪比列
    fixedNumber: {
      type: Array,
      default: function() {
        return []
      }
    },
    // 图片文件分辨率的宽度
    width: {
      type: Number,
      default: 460
    },
    // 图片文件分辨率的高度
    height: {
      type: Number,
      default: 300
    },
    // 网络图片url
    httpurl: {
      type: String,
      default: ''
    },
    upload:{
      type:Function
    }
  },
  data() {
    return {
      id: 'cropper-input-' + +new Date(),
      loading: false,
      cropper: {
        img: '',
        info: true,
        size: 0.9,
        outputType: 'png',
        canScale: true,
        autoCrop: true,
        full: true,
        // 只有自动截图开启 宽度高度才生效
        autoCropWidth: this.width,
        autoCropHeight: this.height,
        fixedBox: false,
        // 开启宽度和高度比例
        fixed: true, // true开启, false关闭
        fixedNumber: this.fixedNumber,
        original: false,
        canMoveBox: true,
        canMove: true
      }
    }
  },
  watch:{
    httpurl(newVal,oldVal){
      this.cropper.img = newVal;
    }
  },
  methods: {
    // 封面上传功能
    uploadCover() {
      // blob类型
        this.$refs.cropper.getCropBlob(async imgRes => {
          try {
            // 文件大小限制
            if (!isMaxFileSize(imgRes, this.maxFileSize)) {
              console.log("文件超过设定大小")
              return
            }
            this.loading = true;
            let processedFile = new File([imgRes],new Date().getTime()+'.png',{
              type:imgRes.type
            })
            this.$emit("upload",processedFile)
            this.loading = false
            this.cancel();
          } catch (error) {
            this.loading = false
            this.cancel();
          }
        })
    },
    cancel(){
      this.$emit('update:showCropper',false)
    }
  }
}
</script>

<style lang="scss">
.custom-upload{
  display: block !important;
}
#corpper {
  // display: block;
  width: 100%;
  // width: 90%;
  min-height: 300px;
  margin: 0 auto;
  background-image: none;
  // background: #fff;
  background-color: #cccccc;
  z-index: 1002;
}
.cropper-dialog {
  min-height: 800px;
  text-align: center;
  .el-dialog__header {
    padding-top: 15px;
  }
  .el-dialog--center .el-dialog__body {
    padding-top: 0;
    padding-bottom: 15px;
  }
  .el-dialog {
    text-align: center;
  }
}
.cropper-button {
  z-index: 1003;
  text-align: center;
  margin-top: 20px;
  .el-button {
    font-size: 16px;
    cursor: pointer;
    text-align: center;
  }
  .cancel-btn {
    color: #373737;
  }
  .el-button:last-child {
    margin-left: 100px;
  }
}
.cropper-modal {
  background-color: rgba(0, 0, 0, 0.5) !important;
}
.custom-upload {
  .tips {
    margin-top: 10px;
    color: red;
    font-size: 12px;
  }
  .clear-margin-top {
    margin-top: 0;
  }
}
</style>
