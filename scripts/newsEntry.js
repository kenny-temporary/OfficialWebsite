/**
 * @author lishiwen@fanxiapp.com
 * @createTime 2021年09月02日
 * @description 此文件作为新闻页面中所有用户操作的入口，包括自动绑定、分页等
 * @note 原生 javascript 实现（未使用module）
 */

const { setData, resetData } = renderTo(".news-container");

const paginationWarpper = document.getElementById("pagination-warpper");
const previousFakeBtn = document.getElementById("previous-btn");
const nextFakeBtn = document.getElementById("next-btn");

updatepaginationWarpperDisplay("none");

/**
 * 初始化新闻页数据
 */
window.onload = function () {
  loadMore({
    page: 1,
    type: updateUIType.Init,
  });
};

/**
 * -------------------------------------------------------
 *
 * NOTE：将数据处理为内部模板或自定义模板所需要的数据
 *
 * -------------------------------------------------------
 *
 * 1. 预设模板
 * 在内部为新闻的渲染提供了一个默认的模板预设, 此处的数据源将会在渲染的
 * 时候替换内部 {{ fieldName }} 中的部分,
 * 详情可以查看 scripts-news.js 文件的 defaultTemplate
 *
 * 2. 自定义模板
 * 你也可以为每一项单独指定一个 template 字段，他的值为 HtmlString;
 * 当你的数据是需要在运行时替换的地方使用 {{ fieldName }} 格式，我将
 * 会在内部帮助你自动的去渲染为真实的数据
 *
 * 3. 如果上面的描述比较抽象，你可以试着想象一下vue的template
 */
function formatTemplateData(originalData) {
  return originalData?.map((item) => {
    return {
      ...item,
      date: item?.postTime,
      title: item?.title,
      id: item?.newsId,
    };
  });
}

function updatepaginationWarpperDisplay(value) {
  paginationWarpper.setAttribute("style", `display: ${value}`);
}

// 怎样去更新UI?
function updateUIWhenDataChanges(data, updateType) {
  const classNames = "col-md-6 d-flex justify-content-between news-card";

  switch (updateType) {
    case updateUIType.Reset:
      resetData(data, { classnames: classNames });
      return;

    case updateUIType.Init:
      setData(data, { classnames: classNames });
      updatepaginationWarpperDisplay("block");
      diasbleEleClick(previousFakeBtn); // 禁用上一步
      handleHilight(1); // 高亮第一步
      return;

    default:
      setData(data, { classnames: classNames });
      return;
  }
}

function loadMore(params = {}) {
  request({ page: params?.pageSize || 1 }).then((res) => {
    const formatedData = formatTemplateData(res?.data);
    updateUIWhenDataChanges(formatedData, params?.type);
  });
}

/**
 * -------------------------------------------------------
 * 
 * XXX：新闻List数据请求接口（使用通用的请求方法来代替）
 * 
 * -------------------------------------------------------

 * @param { Object } options 新闻list接口参数
 * @returns requestResponsePromise
 * 
 * 数据请求不应该放在这里，最开始为了更快的完成数据对接先放到这里实现了
 * 
 */
function request(options) {
  return fetch(
    `https://www.mxnzp.com/api/news/list?typeId=509&page=${options.page}&app_id=qkfhjzihn8nklvpr&app_secret=cjlCWUovOUNYL3BmL2wvVFgyWktRQT09`
  ).then((res) => {
    return res.json();
  });
}




// ------------------------ 分页事件 ----------------------
const pagination = new Pagination();
pagination.setMaxPageSize(3);

// 高亮选中选项
function handleHilight(id) {
  document.querySelectorAll("[data-id]").forEach((item) => {
    const customIdString = item?.getAttribute("data-id");
    const stringIdToNumber = Number(customIdString);

    if (stringIdToNumber === id) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
}


/**
* -------------------------------------------------------
 *
 * NOTE：为上/下一页和每一项都增加事件绑定
 *
 * -------------------------------------------------------
 * 
 * from 131 -> 152
 */
function registerListener(attributeOrSelector, eventName, handler) {
  document.querySelectorAll(attributeOrSelector).forEach((paginationItem) => {
    paginationItem?.addEventListener(eventName, handler, false);
  });
}
previousFakeBtn.addEventListener("click", () => pagination.previous());
nextFakeBtn.addEventListener("click", () => pagination.next());

registerListener("[data-id]", "click", function handler(event) {
  const customIdString = event?.target?.dataset?.id;
  pagination.goTo(Number(customIdString));
  handleHilight(Number(customIdString));
});


function diasbleEleClick(target) {
  target.classList.add("disable-click");
}
function removeDisableClick(target) {
  target.classList.remove("disable-click");
}

/**
 * 当内部的页面发生变化时候会触发此回调
 */
pagination.onPageSizeChange(function onchane(id, maxSize) {
  if (id <= 1) {
    diasbleEleClick(previousFakeBtn);
    removeDisableClick(nextFakeBtn);
  }

  if (id >= maxSize) {
    diasbleEleClick(nextFakeBtn);
    removeDisableClick(previousFakeBtn);
  }

  handleHilight(id);
  return true;
});

// 点击每一项
function handleViewDetails(newsId) {
  window.location.href = `./details.html?newsId=${newsId}`;
}
