module.exports = {
  name: "getStringFromDate",
  description: "日付を取得",
  run(date) {
    try {
      var year_str = date.getFullYear();
      var month_str = date.getMonth() + 1;
      var day_str = date.getDate();
      var hour_str = (date.getHours() + 9) % 24;
      var minute_str = date.getMinutes();
      var second_str = date.getSeconds();

      var format_str = "YYYY年MM月DD日 hh時mm分ss秒";
      format_str = format_str.replace(/YYYY/g, year_str);
      format_str = format_str.replace(/MM/g, month_str);
      format_str = format_str.replace(/DD/g, day_str);
      format_str = format_str.replace(/hh/g, hour_str);
      format_str = format_str.replace(/mm/g, minute_str);
      format_str = format_str.replace(/ss/g, second_str);

      return format_str;
    } catch (error) {
      console.log(error);
    }
  }
}