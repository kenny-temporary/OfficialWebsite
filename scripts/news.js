const defaultTemplate = `
            <div class="row mb-lg-4 mt-lg-4 mb-md-2 mt-md-2" onclick="handleViewDetails('{{id}}',event)">
              <div class="col-lg-5 col-md-12">
                <img data-sizes="auto" data-src="./images/02.png" class="img-fluid safe-image lazyload" />
              </div>
              <div class="col-lg-7 col-md-12 my-3">
                <div class="lead" style="font-weight: bold;">
                {{title}} 見出しや副見出し
                </div>
            	<div class="text-black-50 my-2 small">
            		发布日期: {{date}} 
					作者: {{source}}
            	</div>
                <p>見出しや副見出し、表示見出しなどで装飾することで、font sizeを変更できます。詳しい方法を解説しますので、一緒に見ていきましょう。</p>
              </div>
            </div>
          `;

function generateNewsDocumentFragment(
    dataList = [],
    options = {
        classnames: "",
        style: ""
    }
) {
    const fragment = document.createDocumentFragment();
	fragment.innerHTML = ""
    dataList.forEach((data) => {
        const newsItemNode = generateNewsItemNode(data, options);
        fragment.appendChild(generateNewsItemNode(data, options));
    });
    return fragment;
}

function generateNewsItemNode(newsItem = {}, options = {}) {
    const li = document.createElement("li");
    if (options.classnames) {
        injecteClassname(options.classnames, li);
    }
    li.style = options.style;
    li.innerHTML = newsItemTemplate(newsItem);
    return li;
}

function newsItemTemplate(data = {}) {
    const sourceTemplate = data.tempalte || defaultTemplate;
    return parseHTML(sourceTemplate).data(data);
}

function parseHTML(htmlString = "", options) {
    return {
        data(data) {
            return htmlString.replace(/\{\{(.+?)\}\}/g, (...args) => {
                return args[1].split(".").reduce((data, currentValue) => {
                    return data[currentValue.trim()];
                }, data);
            });
        },
    };
}

function injecteClassname(classnames, target) {
    let classList = "";

    if (!classnames) {
        return "";
    }

    if (Array.isArray(classnames)) {
        classnames.forEach((classname) => (classList += ` ${classname}`));
    }

    if (typeof classnames === "string") {
        classList += ` ${classnames}`;
    }

    target.classList = classList.trim();
}

function appendChildToContainer(HTMLConllection, target) {
    target.appendChild(HTMLConllection);
}

function renderTo(container) {
    if (!container) {
        throw new Error("No container");
    }

    const targrtContainer = document.querySelector(container);

    return {
        setData(data = [], options = {}) {
			options.type = "additional";
            const newsFragment = generateNewsDocumentFragment(data, options);
            appendChildToContainer(newsFragment, targrtContainer);
        },

		resetData(data = [], options = {}){
			options.type = "reset";
			const newsFragment = generateNewsDocumentFragment(data, options);
			targrtContainer.innerHTML = '';
			targrtContainer.appendChild(newsFragment);
		}
    }
}