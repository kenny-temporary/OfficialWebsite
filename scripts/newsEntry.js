// ------------------------ 初始化数据 ----------------------
const { setData, resetData } = renderTo(".news-container");

window.onload = function () {
  loadMore({ page: 1 });
};

function loadMore(params = {}) {
  request({ page: params?.pageSize || 1 }).then((res) => {
	  console.log(res?.data);
    const rewirted = res?.data?.map((item) => {
      return {
        ...item,
        date: item?.postTime,
		title: item?.title,
		id: item?.newsId,
      };
    });

    if (params.type === updateUIType.Reset) {
      resetData(rewirted, {
        classnames: "col-md-6 d-flex justify-content-between news-card",
      });
      return;
    }

    setData(rewirted, {
      classnames: "col-md-6 d-flex justify-content-between news-card",
    });
  });
}

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

const previousFakeBtn = document.getElementById("previous-btn");
const nextFakeBtn = document.getElementById("next-btn");

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

// 注册监听事件
function registerListener(attributeOrSelector, eventName, handler) {
  document.querySelectorAll(attributeOrSelector).forEach((paginationItem) => {
    paginationItem?.addEventListener(eventName, handler, false);
  });
}
function diasbleEleClick(target) {
  target.classList.add("disable-click");
}
function removeDisableClick(target) {
  target.classList.remove("disable-click");
}

previousFakeBtn.addEventListener("click", function () {
  pagination.previous();
});
nextFakeBtn.addEventListener("click", function () {
  pagination.next();
});

// NOTE: 为每一项增加点击事件监听
registerListener("[data-id]", "click", function handler(event) {
  const customIdString = event?.target?.dataset?.id;
  pagination.goTo(Number(customIdString));
  handleHilight(Number(customIdString));
});

// 默认禁用上一项 和 高亮第一项
diasbleEleClick(previousFakeBtn);
handleHilight(1);

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