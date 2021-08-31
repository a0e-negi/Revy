module.exports = {
  name: "getHms",
  description: '秒から時分秒形式へ変換',
  run(time) {
    var hms = "";
    const h = time / 3600 | 0;
    const m = time % 3600 / 60 | 0;
    const s = time % 60;

    function padZero(v) {
      if (v < 10) {
        return "0" + v;
      } else {
        return v;
      }
    }

    if (h != 0) {
      hms = h + "時間" + padZero(m) + "分" + padZero(s) + "秒";
    } else if (m != 0) {
      hms = m + "分" + padZero(s) + "秒";
    } else {
      hms = s + "秒";
    }
    return hms;
  }
}