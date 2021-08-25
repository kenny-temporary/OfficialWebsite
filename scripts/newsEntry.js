// ------------------------ 初始化数据 ----------------------
const {
	setData,
	resetData
} = renderTo(".news-container");

window.onload = function() {
	loadMore();
}

function loadMore(params = {}) {
	request().then(res => {
		const rewirted = res.map(res => {
			return {
				...res,
				date: new Date().toLocaleDateString() + Math.random()
			}
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
	})
}

function request() {
	return fetch("https://jsonplaceholder.typicode.com/users")
		.then(res => res.json())
}


// ------------------------ 分页事件 ----------------------
const pagination = new Pagination();
pagination.setMaxPageSize(10);



const previousFakeBtn = document.getElementById("previous-btn");
const nextFakeBtn = document.getElementById("next-btn");

function diasbleEleClick(target){
	target.classList.add("disable-click");
}

function removeDisableClick(target){
	target.classList.remove("disable-click");
}

previousFakeBtn.addEventListener('click', function() {
	pagination.previous();
});

nextFakeBtn.addEventListener('click', function() {
	pagination.next();
});

pagination.onPageSizeChange(function onchane(id) {
	debugger
	if(id <= 0){
		diasbleEleClick(previousFakeBtn);
		removeDisableClick(nextFakeBtn);
	}
	
	if(id > 1 && id < 10) {
		removeDisableClick(nextFakeBtn);
		removeDisableClick(previousFakeBtn);
	}

	if(id >= 10){
		diasbleEleClick(nextFakeBtn);
		removeDisableClick(previousFakeBtn);
	};

	return true;
});
