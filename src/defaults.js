// 默认配置参数，在实际开发中可以覆盖
export default {
  level: "log",
  logger: console,
  logErrors: true,
  collapsed: undefined,
  predicate: undefined,
  duration: false,
  timestamp: true,
  stateTransformer: state => state,
  actionTransformer: action => action,
  errorTransformer: error => error,

  // 日志不同类别的颜色体系
  colors: {
    title: () => "inherit",
    prevState: () => "#9E9E9E",
    action: () => "#03A9F4",
    nextState: () => "#4CAF50",
    error: () => "#F20404"
  },
  diff: false,
  diffPredicate: undefined,

  // Deprecated options
  transformer: undefined
};
