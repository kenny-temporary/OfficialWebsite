function getQuery() {
  const queryString = window.location.search;
  return queryStringToObject(queryString);
}

function getNewsDetails({ newsId = "", ...restParams }) {
  const option = {
    newsId,
    app_id: "qkfhjzihn8nklvpr",
    app_secret: "cjlCWUovOUNYL3BmL2wvVFgyWktRQT09",
    ...restParams,
  };

  const queryString = objectToQueryString(option);
  return request("/api/news/details?" + queryString);
}

const { newsId } = getQuery();

getNewsDetails({ newsId }).then((result) => {
  updateNewsContent(result?.data?.data, newsId);
});

function updateNewsContent(data, newsId) {
  const htmlString = parseHTML(data?.content)
    .data(formatedData(data?.images));
  const container = document.getElementById("newsContent");
  const newsTitle = document.getElementById("newsTitle");

  newsTitle.innerHTML = data?.title;
  container.innerHTML = htmlString;
}

function formatedData(data = []) {
  const result = data?.reduce((iterator, currrent) => {
    const key = currrent?.position?.replace(/\<\!--(.+?)\--\>/g, (...args) => args?.[1]);
    iterator[key] = genImageTemplate(currrent?.imgSrc);
    return iterator;
  }, {});
  return result;
}

function genImageTemplate(url){
  return `<div class="aspect-ratio-container-16-9">
    <img src="${url}" />
  </div>`
}

// <!--IMG#0-->
// parseHTML
function parseHTML(htmlString = "", options) {
  return {
    data(data) {
      return htmlString.replace(/\<\!--(.+?)\--\>/g, (...args) => {
        return args[1].split(".").reduce((data, currentValue) => {
          return data[currentValue.trim()];
        }, data);
      });
    },
  };
}
