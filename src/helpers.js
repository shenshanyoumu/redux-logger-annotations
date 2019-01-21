// 下面空数组中每个元素通过str进行连接，其实就是重复str子串
export const repeat = (str, times) => new Array(times + 1).join(str);

// 补位填充
export const pad = (num, maxLength) =>
  repeat("0", maxLength - num.toString().length) + num;

// 每个action触发都有时刻，因此对时刻格式化处理
export const formatTime = time =>
  `${pad(time.getHours(), 2)}:${pad(time.getMinutes(), 2)}:${pad(
    time.getSeconds(),
    2
  )}.${pad(time.getMilliseconds(), 3)}`;

//现代浏览器实现的performance比Date更加精确
export const timer =
  typeof performance !== "undefined" &&
  performance !== null &&
  typeof performance.now === "function"
    ? performance
    : Date;
