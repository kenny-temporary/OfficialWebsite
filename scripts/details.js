function getQuery() {
  const queryString = window.location.search;
  return queryStringToObject(queryString);
}

function getNewsDetails({ newsId = "", ...restParams }) {
  const option = {
    newsId,
    app_id: "tqyorkkyegeuvenk",
    app_secret: "UmkvYXdTbjQrWEE1a2JWMGFGaUltdz09",
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
  const container = document.getElementById('newsContent');
  container.innerHTML = data?.content;
}
