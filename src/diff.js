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

export default function diffLogger(prevState, newState, logger, isCollapsed) {
  const diff = differ(prevState, newState);

  try {
    if (isCollapsed) {
      logger.groupCollapsed("diff");
    } else {
      logger.group("diff");
    }
  } catch (e) {
    logger.log("diff");
  }

  if (diff) {
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
