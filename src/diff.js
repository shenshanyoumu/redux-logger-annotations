import differ from "deep-diff";

// 下面键分别表示Edit、New、Delete和Add四种操作，这也是在对象编辑距离算法中常见的操作
const dictionary = {
  E: {
    color: "#2196F3",
    text: "CHANGED:"
  },
  N: {
    color: "#4CAF50",
    text: "ADDED:"
  },
  D: {
    color: "#F44336",
    text: "DELETED:"
  },
  A: {
    color: "#2196F3",
    text: "ARRAY:"
  }
};

// 针对不同操作用颜色区分
export function style(kind) {
  return `color: ${dictionary[kind].color}; font-weight: bold`;
}

// 对比左右两个对象在对应位置的差异，并打印输出
export function render(diff) {
  const { kind, path, lhs, rhs, index, item } = diff;

  switch (kind) {
    case "E":
      return [path.join("."), lhs, "→", rhs];
    case "N":
      return [path.join("."), rhs];
    case "D":
      return [path.join(".")];
    case "A":
      return [`${path.join(".")}[${index}]`, item];
    default:
      return [];
  }
}

/**
 *
 * @param {*} prevState redux上一个状态
 * @param {*} newState 触发action后，修改得到的新状态
 * @param {*} logger 日志记录组件
 * @param {*} isCollapsed 表示日志分组是否需要在控制台被收缩
 */
export default function diffLogger(prevState, newState, logger, isCollapsed) {
  // 对比前后state的差异
  const diff = differ(prevState, newState);

  try {
    // 下面针对标签"diff"进行分组
    if (isCollapsed) {
      logger.groupCollapsed("diff");
    } else {
      logger.group("diff");
    }
  } catch (e) {
    logger.log("diff");
  }

  if (diff) {
    // 针对两个对象的差异数组，分别输出打印
    diff.forEach(elem => {
      const { kind } = elem;
      const output = render(elem);

      logger.log(`%c ${dictionary[kind].text}`, style(kind), ...output);
    });
  } else {
    logger.log("—— no diff ——");
  }

  try {
    logger.groupEnd();
  } catch (e) {
    logger.log("—— diff end —— ");
  }
}
