<template>
  <div>
    <div>
        <el-button @click="handleClick" >
          点击上传
          <input 
          class="upload-input" 
          type="file" 
          :multiple="multiple" 
          ref="input" 
          @change="handleChange" 
          :accept="accept" />
        </el-button>
    </div>
    <!-- 图片裁剪框 -->
    <div v-if="listType=='cropper'">
      <cropper 
      :max-file-size="maxFileSize"
      :fixed-number="fixedNumber" 
      :show-cropper.sync="showCropper" 
      :httpurl="cropperImg"
      @upload="uploadCropper" />
    </div>
    <!-- 上传进度条 -->
    <el-progress v-if="uploadStatus=='uploading'" :percentage="uploadRate" :color="customColor"></el-progress>
    <!-- 文件列表 -->
    <div v-if="listType=='file'" class="file-list">
      <template v-for="(item,index) in fileList">
        <div 
          class="list" 
          :key="index"
           >
          <div><i class="el-icon-document"></i>&nbsp;{{item.name}}</div>
          <div class="list-success">
            <i class="el-icon-circle-check" ></i>
          </div>
          <!-- 删除选中文件 -->
          <div @click="handleDelete(index)" class="list-delete">
            <i class="el-icon-close"></i>
          </div>
        </div>
      </template>
    </div>
    <!-- 图片卡片显示列表 -->
    <div v-if="listType=='picture-card'" class="file-list">
      <template v-for="(item,index) in fileList">
        
        <div 
          class="list" 
          :key="index"
           >
           <img
              class="list-img"
              :src="item.url"
            />
          <div><i class="el-icon-document"></i>&nbsp;{{item.name}}</div>
          <div class="list-success">
            <i class="el-icon-circle-check" ></i>
          </div>
          <!-- 删除选中文件 -->
          <div @click="handleDelete(index)" class="list-delete">
            <i class="el-icon-close"></i>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import cropper from "./components/Cropper";
import {upload} from "@/api/upload";
import { isImageFile, isMaxFileSize, readFile } from './upload' // 见下文
export default {
  components:{
    cropper
  },
  props:{
      //显示的风格 file文件列表 picture-card图片卡片式
      listType:{
        type:String,
        default:"file"
      },
      //总共上传的文件数量   
      limit:{
          type:Number,
          default:1
      },
      //是否多文件上传
      multiple:{
          type:Boolean,
          default:false
      },
      //已上传文件的列表  
      fileList:{
          type:Array,
          default:()=>[]
      },
      // 图片裁剪比列
      fixedNumber: {
        type: Array,
        default: function() {
          return [13, 7]
        }
      },
      // 最大上传文件的大小
      maxFileSize: {
        type: Number,
        default: 1 // （MB)
      },
      //接受上传的文件类型
      accept: String,  
      beforeUpload: Function,//上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。
      onSuccess: Function,//文件上传成功时的钩子
      onProgress: Function,//文件上传时的钩子
  },
  data() {
    return { 
      showCropper:false,//裁剪显示
      cropperImg:"",//裁剪图片路径
      focusing:false,//是否获取焦点
      uploadRate:0,//上传进度
      customColor: '#409eff',
      uploadStatus:"success",//uploading上传中 success成功 error失败
    };
  },
  methods: {
    //触发上传事件
    handleClick(){
        this.$refs.input.value = null;
        this.$refs.input.click();
    },
    // 上传裁剪图片
    uploadCropper(file){
      this.upload(file);
    },
    // 上传文件的变化
    async handleChange(ev){
      const files = ev.target.files;
      if(!files) return;
      console.log("文件数量",files.length)
      let {limit,fileList} = this;
      // 判断文件上传的数量
      if(limit<files.length+fileList.length){
        console.log("文件超过设定的数量")
        return;
      }
      if(this.listType=='cropper'){//处理裁剪操作
          // 读取文件
          const src = await readFile(files[0])
          this.cropperImg = src;
          this.showCropper = true;
      }else{
        // 把文件内容转为数组
        let postFiles = Array.prototype.slice.call(files);
        if(postFiles.length===0){return;}
        // 循环上传文件
        postFiles.forEach(rawFile => {
          if(isMaxFileSize(rawFile,this.maxFileSize)){
            this.upload(rawFile);
          }else{
            console.log("超过最大限制大小")
          }
        });
      }
    },
    // 处理上传前的操作
    upload(rawFile){
      // 是否启用上传前的钩子
      if(this.beforeUpload){
        // beforeUpload返回false或者promise的reject则停止上传
        const before = this.beforeUpload(rawFile);
        if(before && before.then){
          before.then(processedFile => {
            // 判断文件类型Object.prototype.toString.call
            const fileType = Object.prototype.toString.call(processedFile);
            if(fileType === '[object File]'||fileType === '[object Blob]'){
              if(fileType === '[object Blob]'){
                processedFile = new File([processedFile],rawFile.name,{
                  type:rawFile.type
                })
              }
              for(const p in rawFile){
                // 对象自身属性中是否具有指定的属性
                if(rawFile.hasOwnProperty(p)){
                  processedFile[p] = rawFile[p];
                }
              }
              this.post(processedFile);
            }else{
              this.post(rawFile);
            }
          },()=>{
            console.log("异常")
          })
        } else if (before !== false) {
          this.post(rawFile);
        }
      }else{
        this.post(rawFile);
      }
    },
    // 上传文件
    async post(rawFile){
      let {fileList} = this;
      // 上传文件
      console.log("文件",rawFile)
      this.$refs.input.value = null;
      const {uid} = rawFile;
      let formData = new FormData();
      formData.append("file",rawFile);
      const options = {
        headers:{'Content-Type':'multipart/form-data'},
        onUploadProgress:(e)=>{
          //属性lengthComputable主要表明总共需要完成的工作量和已经完成的工作是否可以被测量
          //如果lengthComputable为false，就获取不到e.total和e.loaded
          // console.log("进度",e,e.loaded,e.total)
          if(e.lengthComputable){
            this.uploadStatus = "uploading"
            let rate = e.loaded/e.total;
            if(rate<1){
              let uploadRate = (rate*100).toFixed(0);
              this.uploadRate = Number(uploadRate);
              this.onProgress&&this.onProgress(this.uploadRate,rawFile,fileList);
            }
          }else{
            this.uploadStatus = "error"
            console.log("获取不到异常")
          }
        }
      }
      // 调用上传文件接口
      let res = await upload(formData,options)
      console.log("上传结果",res)
      this.uploadRate = 100;
      this.uploadStatus = 'success'
      fileList.push({name:rawFile.name,url:res.path});
      this.onSuccess&&this.onSuccess(res,rawFile,fileList);
      this.onProgress&&this.onProgress(this.uploadRate,rawFile,fileList);
      // axios.post("http://47.99.194.188:9002/upload/file",formData,options)
      // .then((data)=>{
      //   console.log("上传结果",data)
      //   const res = data.data;
      //   this.uploadRate = 100;
      //   this.uploadStatus = 'success';
      //   fileList.push({name:rawFile.name,url:`http://47.99.194.188:9002/${res.data}`})

      // })
      // .catch((err)=>{
      //   console.log("上传出错",err)
      // })
    },
    // 删除文件
    handleDelete(index){
      let {fileList} = this;
      fileList.splice(index,1);
    }
  },
};
</script>

<style scoped>
.upload-input{
    display: none;
}
.file-list{
  margin-top: 10px;
}
.file-list .list{
  width: 100%;
  height: 25px;
  padding: 0 10px;
  margin-bottom: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #606266;
  border-radius: 3px;
  background-color: white;
}
.file-list .list:hover{
  color: cornflowerblue;
  background-color: rgba(0, 100, 250, 0.2);
  cursor: pointer;
}
.file-list .list .list-delete{
  display: none;
}
.file-list .list:hover .list-delete{
  display: block;
}
.file-list .list .list-success{
  color: chartreuse;
  display: block;
}
.file-list .list:hover .list-success{
  display: none;
}
.list-img{
  width: 100px;
  height: 100px;
}
</style>