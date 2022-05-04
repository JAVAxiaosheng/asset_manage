<template>
  <div>
    <el-table :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" style="width: 100%">
      <el-table-column prop="student_id" label="ID" min-width="180"/>
      <el-table-column prop="student_name" label="姓名" min-width="180"/>
      <el-table-column prop="sex" label="性别" min-width="180"/>
      <el-table-column prop="student_num" label="学号" min-width="180"/>
      <el-table-column label="操作">
        <el-button type="danger" style="font-size: 10px">
          <el-icon style="vertical-align: middle">
            <delete/>
          </el-icon>
          <span style="vertical-align: middle">删除</span>
        </el-button>
      </el-table-column>
    </el-table>

    <el-pagination
        background
        class="pageInput"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.length"
        style="margin-top: 8px;float: right">
    </el-pagination>
  </div>

</template>

<script>

export default {
  name: "StudentInfo",

  data() {
    return {
      tableData: [],
      pageSize: 10,
      currentPage: 1,
      count: 0,
    };
  },

  mounted() {
    //this.getInfo();
    this.test(1256);
  },
  methods: {
    // 算法入口
    test(num) {
      num = Math.abs(num);
      if (num < 58) {
        num = 58
      }
      let sum = this.disassembleInt(num);
      console.log(sum);
    },
    // 递归
    disassembleInt(num) {
      let arrStr = num.toString().split('');
      let arrNum = [];
      for (let i = 0; i < arrStr.length; i++) {
        arrNum.push(parseInt(arrStr[i]));
      }
      let sum = 0;
      for (let i = 0; i < arrNum.length; i++) {
        sum += arrNum[i];
      }
      if (sum === arrNum[arrNum.length - 1]) {
        return sum;
      } else {
        return this.disassembleInt(sum);
      }
    },
    getInfo() {
      this.$http.get('/host/student').then(resp => {
        if (resp.status === 200) {
          console.log(resp);
          this.tableData = resp.data;
        } else {
          this.$message.error("查询学生信息接口错误," + resp.status)
        }
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    }
  }
}
</script>

<style scoped>

</style>