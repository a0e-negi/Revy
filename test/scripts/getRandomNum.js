module.exports = {
  name: "getRandomNum",
  description: "乱数生成",
  run(weight) {
    let totalWeight = 0;
    for (var i = 0; i < weight.length; i++) {
      totalWeight += weight[i];
    }
    let random = Math.random() * totalWeight;
    for (var j = 0; j < weight.length; j++) {
      if (random < weight[j]) {
        return j;
      } else {
        random -= weight[j];
      }
    }

    return;
  }
}