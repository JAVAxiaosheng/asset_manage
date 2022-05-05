<template>

  <div>


    <div style="background-color: #fdfdfe">


      <el-form :inline="true" :model="searchForm" class="demo-form-inline">

        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="用户名" style="margin-top: 15px">
              <el-input v-model="searchForm.username" @change="search"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="身份" style="margin-top: 15px;">
              <el-select v-model="searchForm.role" class="m-2" clearable filterable placeholder="请选择" @change="search">
                <el-option
                    v-for="item in roleOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple"/>
          </el-col>
          <el-col :span="6">
            <el-form-item style="margin-top: 15px;float: right">
              <el-button type="primary" @click="search">
                <el-icon style="vertical-align: middle">
                  <search/>
                </el-icon>
                <span style="vertical-align: middle">查询</span>
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>


      </el-form>
    </div>

    <!-- 列表展示 -->
    <div style="margin-top: 10px">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="id" label="ID"/>
        <el-table-column prop="userName" label="用户名"/>
        <el-table-column prop="role" label="身份">
          <template v-slot="props">
            <el-tag v-if="props.row.role === 0">普通用户</el-tag>
            <el-tag v-if="props.row.role === 1" type="success">管理员</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="props">
            <el-button type="primary" plain style="font-size: 10px" @click="openModifyRoleDialog(props.row)">
              <el-icon style="vertical-align: middle">
                <edit/>
              </el-icon>
              <span style="vertical-align: middle">修改权限</span>
            </el-button>

            <el-popconfirm
                confirm-button-text="确定"
                cancel-button-text="取消"
                @confirm="deleteUser(props.row)"
                title="确定要删除此用户么?">
              <template #reference>
                <el-button type="danger" plain>
                  <el-icon style="vertical-align: middle">
                    <delete/>
                  </el-icon>
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          background
          class="pageInput"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          v-model:currentPage="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[5, 10, 15, 20]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          style="margin-top: 8px;float: right;background-color: #fdfdfe">
      </el-pagination>
    </div>

    <!--    修改权限-->
    <div>
      <el-dialog v-model="dialogFormVisible" title="权限修改">
        <el-form :model="form">
          <el-form-item label="用户名" style="margin-left: 20px">
            <el-input v-model="form.username" :disabled="true" style="width: 220px"/>
          </el-form-item>
          <el-form-item label="身份" style="margin-left: 20px">
            <el-select style="margin-left: 11px;width: 220px" v-model="form.role" class="m-2" filterable
                       placeholder="请选择">
              <el-option
                  v-for="item in roleOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="modifyRole">确定</el-button>
      </span>
        </template>
      </el-dialog>
    </div>


  </div>
</template>

<script>
import Cookies from 'js-cookie'
import {ElMessageBox} from 'element-plus'

export default {
  name: "UserInfo",
  data() {
    return {
      currentPage: 1,
      pageSize: 5,
      total: 0,
      tableData: [],
      searchForm: {
        username: '',
        role: '',
      },
      roleOptions: [{
        label: '管理员',
        value: 1,
      }, {
        label: '普通用户',
        value: 0,
      }],
      dialogFormVisible: false,
      form: {
        username: '',
        role: '',
        id: '',
      },
      beforeModifyId: '',
    };
  },
  mounted() {
    this.listUserInfo();
  },
  methods: {
    deleteUser(row) {
      let params = {
        id: row.id,
      };
      this.$http.delete('api/user_info/delete_user', {data: params}).then(resp => {
        let apiData = resp.data;
        if (apiData.code === 0) {
          this.$message.success("删除成功");
          if (row.userName === Cookies.get('user_name')) {
            ElMessageBox.alert('检测到当前登录用户已删除,请重新登录', '提示', {
              confirmButtonText: '确定',
              callback: () => {
                this.$router.push({
                  path: '/'
                });
                Cookies.remove('user_name');
                Cookies.remove('role');
                Cookies.remove('id');
              }
            });
          }
          this.listUserInfo();
        } else {
          this.$message.error("修改接口错误," + apiData.message)
        }
      });
    },
    openModifyRoleDialog(row) {
      console.log(row.id);
      this.dialogFormVisible = true;
      this.form.username = row.userName;
      this.form.role = row.role;
      this.form.id = row.id;
      this.beforeModifyRole = row.role;
    },
    modifyRole() {
      let params = {
        id: this.form.id,
        role: this.form.role,
      };
      console.log(params)
      this.$http.put('api/user_info/update_user', params).then(resp => {
        let apiData = resp.data;
        if (apiData.code === 0) {
          this.dialogFormVisible = false;
          this.$message.success("修改权限成功");
          if (Cookies.get('user_name') === this.form.username && Number(this.beforeModifyRole) !== Number(this.form.role)) {
            ElMessageBox.alert('检测到当前登录用户权限有所变动,请重新登录', '提示', {
              confirmButtonText: '确定',
              callback: () => {
                this.$router.push({
                  path: '/'
                });
                Cookies.remove('user_name');
                Cookies.remove('role');
                Cookies.remove('id');
              }
            });
          }
          this.listUserInfo();
        } else {
          this.$message.error("修改接口错误," + apiData.message)
        }
      });
    },
    search() {
      this.listUserInfo();
    },
    handleSizeChange(val) {
      this.search();
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.search();
      this.currentPage = val;
    },
    listUserInfo() {
      let params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        role: -1,
        id: -1,
      };
      if (this.searchForm.username !== '') {
        params['username'] = this.searchForm.username.trim();
      }
      if (this.searchForm.role !== '') {
        params['role'] = this.searchForm.role;
      }
      this.$http.get('api/user_info/query_user', {params}).then(resp => {
        console.log(resp.data);
        let apiData = resp.data;
        this.total = apiData.total;
        this.tableData = apiData.data;
      });
    }
  }
}
</script>

<style scoped>

</style>