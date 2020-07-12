// 获取当前时间
class GetWeekDate {
    constructor() {
      let now = new Date(); //当前日期 
      this.nowDayOfWeek = now.getDay(); //今天本周的第几天
      this.nowYear = now.getYear(); //当前年 
      this.nowMonth = now.getMonth(); //月 
      this.nowDay = now.getDate(); //日 
      this.beginHour = "00:00:00";
      this.endHour = "23:59:59";
      this.nowYear += (this.nowYear < 2000) ? 1900 : 0; //
      this.nowDayOfWeek = this.nowDayOfWeek == 0 ? 7 : this.nowDayOfWeek; // 如果是周日，就变成周七
    }
    //获得本日的开端日期
    getDayStartDate() {
      let weekStartDate = new Date(this.nowYear, this.nowMonth, this.nowDay);
      return ~~(weekStartDate.getTime() / 1000); 
    }
    //获得本月的开端日期
    getMonthStartDate() {
      let weekStartDate = new Date(this.nowYear, this.nowMonth, 1);
      return ~~(weekStartDate.getTime() / 1000); 
    }
}
  
  //时间格式化到天 yyyy-mm-dd
  export function formatDate(timeStamp) {
    var date = new Date();
    date.setTime(timeStamp * 1000);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ("0" + m) : m;
    var d = date.getDate();
    d = d < 10 ? ("0" + d) : d;
    return y + "-" + m + "-" + d 
  }
  // 时间格式化 将时间段换算成秒
  export function formatSeconds(value) {
    var second = parseInt(value); // 秒
    var minute = 0; // 分
    var hour = 0; // 小时
    if (second > 60) {
      minute = parseInt(second / 60);
      second = parseInt(second % 60);
      if (minute > 60) {
        hour = parseInt(minute / 60);
        minute = parseInt(minute % 60);
      }
    }
    const s = "s",
        min = "min",
        h = "h";
    var result = "" + parseInt(second) + s;
    if (minute > 0) {
      result = "" + parseInt(minute) + min + result;
    }
    if (hour > 0) {
      result = "" + parseInt(hour) + h + result;
    }
    return result;
  }
  // 时间格式化 yyyy-mm-dd hh:mm:ss
  export function formatDateTime(timeStamp) {
    var date = new Date();
    date.setTime(timeStamp * 1000);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ("0" + m) : m;
    var d = date.getDate();
    d = d < 10 ? ("0" + d) : d;
    var h = date.getHours();
    h = h < 10 ? ("0" + h) : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? ("0" + minute) : minute;
    second = second < 10 ? ("0" + second) : second;
    return y + "-" + m + "-" + d + " " + h + ":" + minute + ":" + second
  }
  
  // 将时间转为时间戳
  
  export function getTime(date) {
    return new Date(date).getTime() / 1000;
  }
  
  
  export default GetWeekDate