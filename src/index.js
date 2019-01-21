import printBuffer from "./core";
import { timer } from "./helpers";
import defaults from "./defaults";
/* eslint max-len: ["error", 110, { "ignoreComments": true }] */
/**
 * Creates logger with following options
 *
 * @namespace
 * @param {object} options - options for logger
 * @param {string | function | object} options.level - console[level]
 * @param {boolean} options.duration - print duration of each action?
 * @param {boolean} options.timestamp - print timestamp with each action?
 * @param {object} options.colors - custom colors
 * @param {object} options.logger - implementation of the `console` API
 * @param {boolean} options.logErrors - should errors in action execution be caught, logged, and re-thrown?
 * @param {boolean} options.collapsed - is group collapsed?
 * @param {boolean} options.predicate - condition which resolves logger behavior
 * @param {function} options.stateTransformer - transform state before print
 * @param {function} options.actionTransformer - transform action before print
 * @param {function} options.errorTransformer - transform error before print
 *
 * @returns {function} 返回logger中间件,在实际应用中logger中间件放在中间件链的最内层调用。因为如果是最外层则会包含Thunk、promise等过程
 */
function createLogger(options = {}) {
  // 外部配置与默认配置的合并
  const loggerOptions = Object.assign({}, defaults, options);

  const {
    logger,
    stateTransformer,
    errorTransformer,
    predicate,
    logErrors,
    diffPredicate
  } = loggerOptions;

  //如果没有定义logger组件，则表示logger无效，直接传递中间件链下一个
  if (typeof logger === "undefined") {
    return () => next => action => next(action);
  }

  // Detect if 'createLogger' was passed directly to 'applyMiddleware'.
  if (options.getState && options.dispatch) {
    // eslint-disable-next-line no-console
    console.error(`[redux-logger] redux-logger not installed. Make sure to pass logger instance as middleware:
// Logger with default options
import { logger } from 'redux-logger'
const store = createStore(
  reducer,
  applyMiddleware(logger)
)
// Or you can create your own logger with custom options http://bit.ly/redux-logger-options
import { createLogger } from 'redux-logger'
const logger = createLogger({
  // ...options
});
const store = createStore(
  reducer,
  applyMiddleware(logger)
)
`);

    return () => next => action => next(action);
  }

  const logBuffer = [];

  // 注意下面暴露的中间件形式，第一个参数({dispatch,getState})表示应用中action函数执行后返回另一个函数
  // next表示经过compose处理的一系列中间件的聚合，可以联想洋葱结构！action表示应用中actionCreate执行后的返回
  return ({ getState }) => next => action => {
    // Exit early if predicate function returns 'false'
    if (typeof predicate === "function" && !predicate(getState, action)) {
      return next(action);
    }

    const logEntry = {};

    logBuffer.push(logEntry);

    // 每一条日志信息，包含action触发时刻、原来的state对象，以及经过action触发后的state对象
    logEntry.started = timer.now();
    logEntry.startedTime = new Date();
    logEntry.prevState = stateTransformer(getState());
    logEntry.action = action;

    let returnedValue;
    if (logErrors) {
      try {
        returnedValue = next(action);
      } catch (e) {
        logEntry.error = errorTransformer(e);
      }
    } else {
      returnedValue = next(action);
    }

    logEntry.took = timer.now() - logEntry.started;
    logEntry.nextState = stateTransformer(getState());

    const diff =
      loggerOptions.diff && typeof diffPredicate === "function"
        ? diffPredicate(getState, action)
        : loggerOptions.diff;

    printBuffer(logBuffer, Object.assign({}, loggerOptions, { diff }));
    logBuffer.length = 0;

    if (logEntry.error) throw logEntry.error;
    return returnedValue;
  };
}

// eslint-disable-next-line consistent-return
// 下面通过默认导出，创建logger中间件
const defaultLogger = ({ dispatch, getState } = {}) => {
  if (typeof dispatch === "function" || typeof getState === "function") {
    return createLogger()({ dispatch, getState });
  }
  // eslint-disable-next-line no-console
  console.error(`
[redux-logger v3] BREAKING CHANGE
[redux-logger v3] Since 3.0.0 redux-logger exports by default logger with default settings.
[redux-logger v3] Change
[redux-logger v3] import createLogger from 'redux-logger'
[redux-logger v3] to
[redux-logger v3] import { createLogger } from 'redux-logger'
`);
};

export { defaults, createLogger, defaultLogger as logger };

export default defaultLogger;
