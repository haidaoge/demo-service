<template>
  <div class="main_wraper">
    <div class="block">
      <span class="demonstration">作业时间范围选择：</span>
      <el-date-picker
        v-model="dates"
        type="datetimerange"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions">
      </el-date-picker>
      <el-button class="lfmarge" type="primary" @click="loadJobsData">查询</el-button>
    </div>
    <div class="content-wrapper">
      <div class="jobs-map">
        <amap ref="myMap" :center.sync="center" :zoom.sync="zoom">
          <amap-tile-layer :tile-url="tileUrl" />
          <amap-polyline
            :path.sync="path"
            :stroke-color="red"
            :stroke-weight="4"/>
          <amap-polyline
            :path.sync="bpath"
            :stroke-color="green"
            :stroke-weight="4"/>
        </amap>
      </div>
      <div class="jobs-table-wraper">
        <div class="jobs-table">
          <el-table
            ref="multipleTable"
            height="calc(100% - 40px)"
            :data="tableData.slice((currentPage-1)*pageSize, currentPage*pageSize)"
            tooltip-effect="dark"
            style="width: 100%"
            @select="getTrack"
            @selection-change="handleSelectionChange">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              prop="Workid"
              label="作业时间"
              :formatter="dateFormat"
              width="190">
            </el-table-column>
            <el-table-column
              prop="Are"
              label="作业面积(亩)"
              :formatter="m2tomu"
              width="190">
            </el-table-column>
            <el-table-column
              prop="Account"
              label="账号名"
              width="190">
            </el-table-column>
            <el-table-column
              prop="Dose"
              label="用药量(L)"
              :formatter="ml2l"
              width="190">
            </el-table-column>
          </el-table>
        </div>
        <el-pagination class="pagePos" @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-size="pageSize"
          :page-sizes="[30, 40, 50]" :current-page="pageIndex" layout="total,sizes, prev, pager, next,jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
  @import '~@/assets/style/home.scss';
</style>
<script>
import GetWeekDate, {formatDateTime} from '@/utils/date';
import GPS from '@/utils/gps';
let date = new GetWeekDate();
  export default {
    created() {
      this.loadJobsData()
    },
    data() {
      return {
        allUrl: '/server/selectallwork',
        tileUrl: 'https://mt{1,2,3,0}.google.cn/maps/vt?lyrs=s@194&hl=zh-CN&gl=cn&x=[x]&y=[y]&z=[z]',
        starttime: new Date(),
        endtime: new Date(),
        table: ["app"],
        dates: [new Date(formatDateTime(date.getDayStartDate()-3*24*3600)), new Date()],
        path: null,
        bpath: null,
        center: null,
        zoom: 18,
        pageIndex: 1,
        red: '#ff0000',
        green: '00FF7F',
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }],
          // onPick(rangs){
          //   this.starttime = rangs.minDate;
          //   this.endtime = rangs.maxDate;
          // }
        },
        tableData: [],  /** 作业记录表格数据 */
        currentPage: 1,   // 当前页码
        total: 20,    // 总条数
        pageSize: 30,   // 每页的数据条数
        multipleSelection: []
      }
    },
    computed: {
      $map() {
        return this.$refs.myMap.$map;
      },
    },
    methods: {
      handleSelectionChange() {

      },
      // 加载轨迹
      getTrack(data) {
        let d = data[0],
            params = {
              workid: d.Workid,
              droneid: d.Droneid,
              table: 'app'
            },
            pms = Object.assign(params, this.$basePms.get());
        this.$axios.post('/server/worktrack', pms).then((r) => {
          let res = r.data;
          if (res.code != 0) {
            this.notice(res.message)
            return;
          }
          this.parseTrack(res.data);
        })
      },
      // 解析经纬度
      parseTrack(d){
        let path = [],
            bpath = [],
            gps = new GPS(),
            lnglat = null,
            lat = null,
            lng = null;
        for (let i in d) {
          lat = d[i].lat/1e7;
          lng = d[i].lng/1e7;
          lnglat = gps.gcj_encrypt(lat, lng);
          if (lat == 0 || lng == 0) {
            continue
          }
          if (d[i].flg == 0) {
            path.push(lnglat);
          } else {
            bpath.push(lnglat);
          }
        }
        this.path = path;
        this.bpath = bpath;
        // this.center = path[0];
        this.$map.setCenter(path[0]);
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.currentPage = 1;
        this.pageSize = val;
        
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.currentPage = val;
        console.log(this.tableData.slice((this.currentPage-1)*this.pageSize, this.currentPage*this.pageSize))
      },
      loadJobsData() {
        console.log(this.dates)
        // 加载架次记录
        let params = {
          starttime: ~~(this.dates[0].getTime() / 1000),
          endtime: ~~(this.dates[1].getTime() / 1000),
          table: 'app'
        }
        let pms = Object.assign(params, this.$basePms.get())
        let formData = new FormData();
        for (let key in pms) {
          formData.append(key, pms[key])
        }
        let config = {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          transformRequest: [function (data) {
            return data
          }]
        }
        this.$axios.post(this.allUrl, formData, config).then((r) => {
          let res = r.data;
          if (res.code != 0) {
            this.notice(res.message)
            return;
          }
          this.total = res.count;
          this.tableData = res.workdatas;
        })
      },
      notice(message, type='error'){
        this.$notify({
          title: '友情提示',
          message: message,
          type: type
        });
      },
      // 时间格式化
      dateFormat(row) {
        return formatDateTime(row.Workid)
      },
      // 面积转化为亩
      m2tomu(row) {
        let area = Math.floor(row.Are * 0.15) / 100;
        return area
      },
      // ml to l
      ml2l(row) {
        return (row.Dose / 1000).toFixed(1)
      }
    }
  }
</script>