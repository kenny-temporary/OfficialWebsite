const setpNumber = 1;

const StatusEnum = {
  Success: "success",
  Failed: "failed",
  Unkown: "unkown",
};

const updateUIType = {
  Reset: "reset",
  Additional: "additional",
};

class Pagination {
  pageSize = 1;
  maxSize = null;
  changeCallback = () => true;

  constructor(startPageSize = 1) {
    this.pageSize = startPageSize;
  }

  setMaxPageSize(maxSize) {
    if (!maxSize) {
      throw new Error("我们需要知道你的最大支持的分页是多少");
    }
    this.maxSize = maxSize;
  }

  getPageSize() {
    return this.pageSize;
  }

  _setPageSize(pageSize) {
    const isContinue = this.changeCallback(pageSize, this.maxSize);
    if (!isContinue) {
      return;
    }
    this.pageSize = pageSize;
  }

  next(callback = (status) => {}) {
    const nextPageSize = this.getPageSize() + setpNumber;
    if (nextPageSize > this.maxSize) {
      callback(new Message(StatusEnum.Failed, "已经到达最大边界了", ""));
      return "";
    }

    this._setPageSize(nextPageSize);
    this.updateUI();
  }

  previous(callback = (status) => {}) {
    const previousPageSize = this.getPageSize() - setpNumber;
    if (previousPageSize < 1) {
      callback(new Message(StatusEnum.Failed, "已经到达最小边界了", ""));
      return "";
    }

    this._setPageSize(previousPageSize);
    this.updateUI();
  }

  goTo(pageSize) {
    if (pageSize < 1 || pageSize > this.maxSize) {
      throw new Error("不再允许的范围内");
    }
    this._setPageSize(pageSize);
    this.updateUI();
  }

  updateUI() {
    const pageSize = this.getPageSize();
    // 来自news.js
    loadMore({ pageSize, random: Math.random(), type: updateUIType.Reset });
  }

  onPageSizeChange(onchangeCallback = () => {}) {
    this.changeCallback = onchangeCallback;
  }
}

class Message {
  constructor(status, message, reason, ...args) {
    this.status = status;
    this.message = message;
    this.reason = reason;
    this.extra = args;
  }
}
