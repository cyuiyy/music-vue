<template>
  <el-container>
    <el-header>
      <div class="musicBox">
        <div class="head">
          <span>logo</span>
          <span>
            欢迎:<span class="m-user">{{username}}</span>
            <el-button @click="quit">退出</el-button>
          </span>
        </div>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <p>音乐列表</p>
      </el-aside>
      <el-main>
        <p class="title">
          <span>音乐列表</span>
          <el-button @click="open">添加</el-button>
        </p>
        <!-- 音乐列表表格 -->
        <el-table :data="musicList" text-align="center" stripe style="width: 100%">
          <el-table-column header-align="center" type="index" label="序号" width="160"></el-table-column>
          <el-table-column header-align="center" prop="music_name" label="歌名" width="160"></el-table-column>
          <el-table-column header-align="center" label="图片" width="160">
            <!-- 作用域插槽 -->
            <template slot-scope="scope">
              <img :src="scope.row.pic" alt="" class="m-img">
            </template>
            <!-- 作用域插槽 -->
          </el-table-column>
          <el-table-column header-align="center" prop="singer_name" label="歌手" width="160"></el-table-column>
          <el-table-column header-align="center" prop="isup" label="是否上架" width="160">
             <!-- 作用域插槽 -->
            <template slot-scope="scope">
              <span>{{scope.row.isup ? "是" :"否"}}</span>
            </template>
             <!-- 作用域插槽 -->
          </el-table-column>

          <el-table-column header-align="center" label="操作">
              <!-- 作用域插槽 -->
            <template slot-scope="scope">
              <el-button size="mini" @click="EditFn(scope.row.id)">编辑</el-button>
              <el-button class="m-delete" size="mini" 
              @click="deleteFn(scope.row.id)">删除</el-button>
              <!-- 作用域插槽 -->
            </template>
            
          </el-table-column>
        </el-table>
        <!-- 音乐列表表格 -->

        <!-- 分页器 -->
        <el-pagination
          class="m-page"
          background
          layout="prev, pager, next"
          @current-change="handleCurrentChange"
          :total="total"
          :page-size="limit">
        </el-pagination>

        <!-- 弹框 -->
        <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
          <el-form
            status-icon
            ref="ruleForm"
            label-width="100px">
            <el-form-item label="歌名" >
              <el-input type="text" v-model="obj.music_name"></el-input>
            </el-form-item>
            <el-form-item label="歌手">
              <el-input type="text" v-model="obj.singer_name"></el-input>
            </el-form-item>
            <el-form-item label="上传图片">
              <input type="file"  @change="upload">
                 <img :src="obj.pic" alt="" class="m-img">
            </el-form-item>
            <el-form-item label="是否上架">
              <el-radio-group v-model="obj.isup" >
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group >
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="operate">{{editId ?'修改' :'添加'}}</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
        <!-- 弹框 -->
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Todo from "@/components/Todo.vue";
import { mapState, mapActions, mapMutations } from "vuex";
export default {
  components: {
    Todo
  },
  data() {
    return {
      username: "",
      dialogVisible: false, //控制弹窗的显示与隐藏
      obj:{
        music_name:"",
        singer_name:"",
        isup:"0",
        pic:""
      },
      limit:6,//每页条数
      pagenum:1, //当前页
      total:0,
      editId:""
    };
  },
  //获取用户信息
  created() {
    this.$api.music.getInfo().then(res => {
      if (res.data.code === 1) {
        this.username = res.data.data.username;
      }
    }),
      this.getMusicList();
  },
  computed: {
    ...mapState(["musicList"])
  },
  methods: {
    ...mapActions(["getData", "remove"]),
    //获取音乐列表
    getMusicList() {
      this.$api.music.getList({ pagenum:this.pagenum, limit: this.limit }).then(({ data }) => {
        if (data.code === 1) {
          this.getData(data.data);
          this.total = data.total
        }
      });
    },
    //点击退出,弹出确认框
    quit() {
      this.$confirm("确认要退出吗？", "确认信息", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确认",
        cancelButtonText: "取消"
      })
        .then(() => {
          //点击确认，删除token，退回login页面
          localStorage.removeItem("token");
          this.$router.replace("/login");
        })
        .catch(action => {
          this.$message({
            type: "info",
            message: "取消修改"
          });
        });
    },
    //打开弹窗
    open() {
      this.reset()
      this.dialogVisible=true;
     
    },
    //重置
    reset(){
        this.music_name="",
        this.singer_name="",
        this.isup="1",
        this.pic="",
        this.editId=""
    },
    //上传图片
   upload(e){
      //e.target.files 文件信息
    console.log(e.target.files,"========")
     //借助FormData构造函数 上传图片
    let file = e.target.files[0];
    let formdata=new FormData()
    formdata.append("file",file)
    //按照要求发送post请求，传入参数formdata
    this.$api.music.upImg(formdata).then(res=>{
        console.log(res.data)
        if(res.data.code ===1){
          this.obj.pic='http://localhost:3000'+res.data.url
        }
     })
   },
   //点击添加/修改
   operate(){
     //修改
     if(this.editId){
         this.editMusic()
         this.dialogVisible=false;
          this.reset()
     }else{//添加
        this.reset()
        this.addItem()
     }
   },
   //点击添加每一项
   addItem(){
     //1.发送请求
     this.$api.music.addMusic(this.obj).then(res=>{
        if(res.data.code ===1){
           //2.关闭弹窗，提示成功
           this.dialogVisible=false;
            this.$message({
              message: "添加成功",
              type: "success"
            });
            //3.重新获取一次数据,刷新页面
           this.getMusicList();
        }
      });
   },
   handleCurrentChange(val){
      // 改变当前页
      this.pagenum = val;
      this.getMusicList();
   },
    //点击删除
    deleteFn(id) {
       this.$confirm("确认要退出吗？", "确认信息", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确认",
        cancelButtonText: "取消"
      })
        .then(() => {
          //点击确认，发送请求，删除数据，更新页面
        this.$api.music.remove({id}).then(res=>{
          console.log(res)
          if(res.data.code ===1){
            this.$message({
                message: "删除成功",
                type: "success"
              });
              this.musicList.length <= 1 && this.pagenum > 1 ? --this.pagenum : this.pagenum 
            this.getMusicList();
          }
      })
        })
        .catch(action => {
          this.$message({
            type: "info",
            message: "取消修改"
          });
        });
      
    },
    //点击编辑
    EditFn(id) {
      this.dialogVisible=true;
      this.editId=id;
      let editObj=this.musicList.find(item=>item.id === id)
      this.obj.music_name=editObj.music_name
      this.obj.singer_name=editObj.singer_name
      this.obj.isup=editObj.isup
      this.obj.pic=editObj.pic
    },
    //修改音乐
    editMusic(){
      this.$api.music.upData({...this.obj,id:this.editId}).then(res=>{
        console.log(res)
        if(res.data.code === 1){
          this.$message({
                message: "修改成功",
                type: "success"
              });
            this.getMusicList();
        }
      })
    }
    
  }
};
</script>

<style lang="scss">
* {
  padding: 0;
  margin: 0;
}
html,
body,
#app {
  width: 100%;
  height: 100%;
}

.el-header {
  background-color: #b3c0d1;
  color: #333;
}

.head {
  display: flex;
  justify-content: space-between;
  line-height: 60px;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  padding: 10px 0;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  
}

.el-container {
  width: 100%;
  height: 100%;
  overflow: auto;
}

.has-gutter {
  text-align: center;
}

.title {
  padding: 15px 10px;
  display: flex;
  justify-content: space-between;
}

.el-table td {
  text-align: center;
}

.m-img {
  width: 80px;
  height: 80px;
}

.m-delete {
  background: red;
  color: #fff;
}

.m-page{
  text-align: center;
  margin:20px 0;
}

.m-user{
  color:#fff;
  font-size: 25px;
  // font-weight:bold;
}
</style>