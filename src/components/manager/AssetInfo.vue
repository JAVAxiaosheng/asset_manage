<template>
  <div>
    <div style="background-color: #fdfdfe;margin-bottom: 15px">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="资产名称" style="margin-top: 15px">
              <el-input v-model="searchForm.property_name" @change="search" style="width: 180px"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="&nbsp;&nbsp;&nbsp;购买人" style="margin-top: 15px">
              <el-select v-model="searchForm.buyer" class="m-2" clearable filterable placeholder="请选择"
                         @change="search" style="width: 180px">
                <el-option
                    v-for="item in buyerOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="3">
            <el-form-item style="margin-top: 15px;margin-left:10px;float: right">
              <el-button type="primary" plain round @click="search">
                <el-icon style="vertical-align: middle">
                  <search/>
                </el-icon>
                <span style="vertical-align: middle">查询</span>
              </el-button>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item style="margin-top: 15px;float: left">
              <el-button type="success" round @click="addPropertyDialogFormVisible=true">
                <el-icon style="vertical-align: middle">
                  <plus/>
                </el-icon>
                <span style="vertical-align: middle">添加</span>
              </el-button>
            </el-form-item>
          </el-col>

        </el-row>
        <el-row :gutter="20">

          <el-col :span="8">
            <el-form-item label="入库时间">
              <el-date-picker @change="search" v-model="searchForm.create_time" type="date"
                              placeholder="请选择时间" style="width: 180px"/>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="资产状态">
              <el-select v-model="searchForm.property_state" class="m-2" clearable filterable placeholder="请选择"
                         @change="search" style="width: 180px">
                <el-option
                    v-for="item in propertyStateOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="8">

          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table :data="tableData" border v-loading="loading" stripe style="width: 100%">
      <el-table-column prop="property_num" label="编号" min-width="100px" fixed>
        <template v-slot="props">
          <el-tag type="info">{{ props.row.property_num }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="property_model" label="型号" min-width="80px"/>
      <el-table-column prop="property_name" label="资产名称" min-width="100px">
        <template v-slot="props">
          <el-tag>{{ props.row.property_name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="property_price" label="价格" min-width="120px">
        <template v-slot="props">
          <el-tag type="danger" round>{{ '￥' + formatMoney(props.row.property_price, 2) }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="property_factory" label="生产厂家" min-width="150px">
        <template v-slot="props">
          <el-tag type="warning">{{ props.row.property_factory }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="produce_date" label="生产时间" min-width="130px">
        <template v-slot="props">
          <el-tag type="success">{{ formatDate(props.row.produce_date) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="create_date" label="入库时间" min-width="130px" @change="search">
        <template v-slot="props">
          <el-tag>{{ formatDate(props.row.create_date) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="buyer" label="购买人" min-width="80px"/>
      <el-table-column prop="property_type" label="资产类型" width="100px"/>
      <el-table-column prop="property_state" label="资产状态" width="100px">
        <template v-slot="props">
          <template v-if="props.row.property_state==1">
            <el-tag type="success">{{ formatState(props.row.property_state) }}</el-tag>
          </template>
          <template v-if="props.row.property_state==2">
            <el-tag type="primary">{{ formatState(props.row.property_state) }}</el-tag>
          </template>
          <template v-if="props.row.property_state==3">
            <el-tag type="warning">{{ formatState(props.row.property_state) }}</el-tag>
          </template>

        </template>
      </el-table-column>

      <el-table-column label="操作" fixed="right" width="110">
        <template v-slot="props">
          <el-button type="primary" plain circle
                     @click="openModifyPropertyDialog(props.row)">
            <el-icon style="vertical-align: middle">
              <edit/>
            </el-icon>
          </el-button>

          <el-popconfirm
              confirm-button-text="确定"
              cancel-button-text="取消"
              @confirm="deleteProperty(props.row)"
              title="确定要删除此资产么?">
            <template #reference>
              <el-button type="danger" plain circle>
                <el-icon style="vertical-align: middle">
                  <delete/>
                </el-icon>
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <el-pagination
        background
        class="pageInput"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        v-model:currentPage="pageNum"
        v-model:page-size="pageSize"
        :page-sizes="[5, 10, 15, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        style="margin-top: 8px;float: right;background-color: #fdfdfe">
    </el-pagination>

    <!-- 添加资产-->
    <div>
      <el-dialog
          v-model="addPropertyDialogFormVisible"
          title="添 加 资 产"
          :close-on-click-modal="false"
          :close-on-press-escape="false"
          :show-close="false"
          width="52%">
        <el-form :model="addPropertyForm" :rules="addPropertyRules" ref="addPropertyFromRef">
          <el-row>
            <el-col :span="12">
              <el-form-item label="资产编号" style="margin-left: 20px" prop="property_num">
                <el-input v-model.number="addPropertyForm.property_num" style="width: 220px"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="&nbsp;&nbsp;型&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号" style="margin-left: 20px">
                <el-input v-model="addPropertyForm.property_model" style="width: 220px"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="&nbsp;&nbsp;名&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;称" style="margin-left: 20px">
                <el-input v-model="addPropertyForm.property_name" style="width: 220px"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="价&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;格" style="margin-left: 20px"
                            prop="property_price">
                <el-input v-model.number="addPropertyForm.property_price" style="width: 220px"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="&nbsp;&nbsp;生产厂家" style="margin-left: 20px;"
                            prop="department_id">
                <el-input v-model.number="addPropertyForm.property_factory" style="width: 220px"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;生产时间">
                <el-date-picker @change="propertyTime" v-model="addPropertyForm.produce_time" type="date"
                                placeholder="请选择时间"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>

            <el-col :span="12">
              <el-form-item label="&nbsp;&nbsp;购&nbsp;&nbsp;买&nbsp;&nbsp;人"
                            style="margin-left: 20px;">
                <el-select v-model="addPropertyForm.buyer" class="m-2" filterable placeholder="请选择">
                  <el-option
                      v-for="item in buyerOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;资产类型">
                <el-input v-model="addPropertyForm.property_type" style="width: 220px"/>
              </el-form-item>
            </el-col>
          </el-row>

        </el-form>
        <template #footer>
      <span class="dialog-footer">
        <el-button type="warning" plain @click="addPropertyCancel">取 消</el-button>
        <el-button type="success" @click="addProperty">添 加</el-button>
      </span>
        </template>
      </el-dialog>
    </div>

    <!-- 修改资产信息 -->
    <div>
      <el-dialog
          v-model="updatePropertyDialogFormVisible"
          title="修 改 资 产"
          :close-on-click-modal="false"
          :close-on-press-escape="false"
          :show-close="false"
          width="52%">
        <el-form :model="updatePropertyForm" :rules="updatePropertyRules" ref="updatePropertyFromRef">
          <el-row>
            <el-col :span="12">
              <el-form-item label="资产编号" style="margin-left: 20px" prop="property_num">
                <el-input v-model.number="updatePropertyForm.property_num" style="width: 220px" disabled/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="&nbsp;&nbsp;型&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号" style="margin-left: 20px">
                <el-input v-model="updatePropertyForm.property_model" style="width: 220px"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="&nbsp;&nbsp;名&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;称" style="margin-left: 20px">
                <el-input v-model="updatePropertyForm.property_name" style="width: 220px"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="价&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;格"
                            style="margin-left: 20px;position: relative"
                            prop="property_price">
                <el-input v-model.number="updatePropertyForm.property_price" style="width: 220px">
                  <template #append>
                    <el-button :icon="Search">元</el-button>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="&nbsp;&nbsp;生产厂家" style="margin-left: 20px">
                <el-input v-model.number="updatePropertyForm.property_factory" style="width: 220px"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;生产时间">
                <el-date-picker v-model="updatePropertyForm.produce_time" type="date" placeholder="请选择时间"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;资产状态">
                <el-select v-model="updatePropertyForm.property_state" class="m-2" filterable disabled
                           placeholder="请选择">
                  <el-option
                      v-for="item in propertyStateOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="&nbsp;&nbsp;购&nbsp;&nbsp;买&nbsp;&nbsp;人"
                            style="margin-left: 20px;">
                <el-select v-model="updatePropertyForm.buyer" class="m-2" filterable placeholder="请选择">
                  <el-option
                      v-for="item in buyerOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;资产类型">
                <el-input v-model="updatePropertyForm.property_type" style="width: 220px"/>
              </el-form-item>
            </el-col>

          </el-row>
        </el-form>
        <template #footer>
      <span class="dialog-footer">
        <el-button type="warning" plain @click="updatePropertyCancel">取 消</el-button>
        <el-button type="success" @click="updateProperty">修改</el-button>
      </span>
        </template>
      </el-dialog>

    </div>

  </div>
</template>

<script>
import moment from "moment";

export default {
  name: "AssetInfo",
  data() {
    return {
      pageNum: 1,
      pageSize: 10,
      total: 1,
      loading: false,
      addPropertyDialogFormVisible: false,
      updatePropertyDialogFormVisible: false,
      addPropertyForm: {
        id: '',
        property_num: '',
        property_model: '',
        property_name: '',
        property_price: '',
        property_factory: '',
        produce_time: '',
        create_time: '',
        buyer: '',
        property_type: '',
        property_state: '',

      },
      updatePropertyForm: {
        id: '',
        property_num: '',
        property_model: '',
        property_name: '',
        property_price: '',
        property_factory: '',
        produce_time: '',
        create_time: '',
        buyer: '',
        property_type: '',
        property_state: '',

      },
      propertyStateOptions: [
        {
          label: '入库',
          value: 1
        },
        {
          label: '借出',
          value: 2
        },
        {
          label: '维修',
          value: 3
        }
      ],
      buyerOptions: [
        {
          label: '小红',
          value: '1'
        },
        {
          label: '小刚',
          value: '2'
        },
        {
          label: '小明',
          value: '3'
        }
      ],
      searchForm: {
        property_name: "",
        create_time: '',
        buyer: '',
        property_state: ''
      },
      tableData: [
        {
          id: 1,
          property_num: 1001,
          property_model: '型号',
          property_name: '资产名称',
          property_price: '价格',
          property_factory: '生产厂家',
          produce_time: '生产时间',
          create_time: '入库时间',
          buyer: '购买人',
          property_type: '资产类型',
          property_state: '资产状态',

        }
      ],
      addPropertyRules: {
        property_num: [
          {required: true, type: 'number', message: '编号必须为数字', trigger: 'change'}
        ],
        property_price: [
          {required: true, type: 'number', message: '价格必须为数字', trigger: 'change'}
        ],
      },
      updatePropertyRules: {
        property_num: [
          {required: true, type: 'number', message: '编号必须为数字', trigger: 'change'}
        ],
        property_price: [
          {required: true, type: 'number', message: '价格必须为数字', trigger: 'change'}
        ],
      }
    }
  },


  mounted() {
    this.search();
    this.searchEmployeeName();
  },
  methods: {
    // 格式化日期
    formatDate(time) {
      return moment(time * 1000).format("YYYY-MM-DD");
    },
    formatMoney(s, n) {
      n = n > 0 && n <= 20 ? n : 2;
      s = parseFloat((s + "").replace(/[^\d.-]/g, "")).toFixed(n) + "";
      let l = s.split(".")[0].split("").reverse(), r = s.split(".")[1];
      let t = "";
      for (let i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
      }
      return t.split("").reverse().join("") + "." + r;
    },
    // 改变状态
    formatState(state) {
      if (state === 1) {
        return '入库'
      } else if (state === 2) {
        return '借出';
      } else {
        return '维修';
      }
    },

    handleSizeChange(val) {
      this.search();
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.search();
      this.pageNum = val;
    },
    search() {
      this.loading = true;
      let params = {
        page_num: this.pageNum,
        page_size: this.pageSize,
      };
      if (this.searchForm.property_state !== '') {
        params['property_state'] = this.searchForm.property_state;
      }
      if (this.searchForm.property_name !== '') {
        params['property_name'] = this.searchForm.property_name;
      }
      if (this.searchForm.buyer !== '') {
        params['buyer'] = this.searchForm.buyer;
      }
      if (this.searchForm.create_time !== '') {
        params['create_time'] = new Date(this.searchForm.create_time).getTime() / 1000;
      }
      this.$http.get('api/property_info/query_property', {params}).then((resp) => {
        let apiData = resp.data;
        // console.log(apiData);
        setTimeout(() => {
          if (apiData.code === 0) {
            this.tableData = apiData.data;
            this.total = apiData.total;
            this.loading = false;
          } else {
            this.$message.error("查询列表接口错误");
            this.loading = false;
          }
        }, 500)

      })
    },

    // 删除资产信息
    deleteProperty(row) {
      // console.log(row);
      let params = {
        id: row.id,
      };
      this.$http.delete('/api/property_info/delete_property', {data: params}).then(resp => {
        console.log(resp);
        let apiData = resp.data;
        if (apiData.code === 0) {
          this.$message.success("删除成功");
          this.search();
        } else {
          this.$message.error("修改接口错误," + apiData.message)
        }
      })
    },
    // 取消添加资产信息
    addPropertyCancel() {
      this.addPropertyDialogFormVisible = false;
      this.$refs['addPropertyFromRef'].resetFields();
    },
    // 添加资产信息
    addProperty() {
      this.$refs['addPropertyFromRef'].validate((valid) => {
        if (valid) {
          let params = {
            property_name: this.addPropertyForm.property_name,
            property_model: this.addPropertyForm.property_model,
            property_type: this.addPropertyForm.property_type,
            property_price: this.addPropertyForm.property_price,
            property_factory: this.addPropertyForm.property_factory,
            property_state: this.addPropertyForm.property_state,
            produce_time: new Date(this.addPropertyForm.produce_time).getTime() / 1000,
            property_num: this.addPropertyForm.property_num,
          };
          this.$http.post('api/property_info/save_property', params).then((resp) => {
            console.log(resp);
            let apiData = resp.data;
            if (apiData.code === 0) {
              this.addPropertyDialogFormVisible = false;
              this.search();
              this.$refs['addPropertyFromRef'].resetFields();
            }
          })
        }
      })

    },
    // 取消修改资产信息
    updatePropertyCancel() {
      this.updatePropertyDialogFormVisible = false;
    },
    // 打开修改资产信息
    openModifyPropertyDialog(row) {
      // alert(row)
      // console.log(row.produce_time);
      this.updatePropertyDialogFormVisible = true;
      this.updatePropertyForm = row;

      this.updatePropertyForm.produce_time = this.formatDate(row.produce_date);
      this.updatePropertyForm.property_num = Number(row.property_num);


      // console.log(row.property_state);


    },
    // 修改资产信息
    updateProperty() {
      this.$refs['updatePropertyFromRef'].validate((valid) => {
        if (valid) {
          let params = {
            id: this.updatePropertyForm.id,
            buyer: this.updatePropertyForm.buyer,
            property_name: this.updatePropertyForm.property_name,
            property_model: this.updatePropertyForm.property_model,
            property_type: this.updatePropertyForm.property_type,
            property_price: this.updatePropertyForm.property_price,
            property_factory: this.updatePropertyForm.property_factory,
            property_state: this.updatePropertyForm.property_state,
            produce_date: new Date(this.updatePropertyForm.produce_time).getTime() / 1000,
            property_num: this.updatePropertyForm.property_num,
          };
          this.$http.put('api/property_info/update_property', params).then((resp) => {
            // console.log(resp);
            let apiData = resp.data;
            if (apiData.code === 0) {
              this.updatePropertyDialogFormVisible = false;
              this.search();
              this.$refs['updatePropertyFromRef'].resetFields();
            }
          })
        }
      })

    },
    searchEmployeeName() {
      let params = {
        page_size: 1000,
        page_num: 1,
      };
      this.$http.get('api/employee/query_employee', {params}).then(resp => {
        let apiData = resp.data;
        // console.log(apiData);
        for (let i = 0; i < apiData.data.length; i++) {
          this.buyerOptions.push({
            label: apiData.data[i].employee_name,
            value: apiData.data[i].employee_name
          })

        }
      })
    }
  }
}
</script>

<style scoped>

</style>