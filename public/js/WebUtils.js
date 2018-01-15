(function (exports) {
	exports.getRequest = function (url) {
		return this.makeRequest('GET', url);
	};

	exports.makeRequest = function (method, url) {
		return new Promise(async function(resolve, reject) {
			let xhr = new XMLHttpRequest();
			xhr.open(method, url);
			
			xhr.onload = function () {
				if (this.status >= 200 & this.status < 300) {
					resolve(xhr.response);
				}
				else {
					reject({
						status: this.status,
						statusText: xhr.statusText,
					});
				}
			};

			xhr.onerror = function() {
				reject({
					status: this.status,
					statusText: xhr.statusText,
				});
			};

			xhr.send();
		});
	}

	exports.cloneTemplate = function(name) {
		let clone = document.querySelector('.template.' + name).cloneNode(true);
		clone.classList.remove('template');

		return clone;
	}

	exports.hideElement = function(element) {
		element.style.display = 'none';
	}

	exports.showElement = function(element, state) {
		element.style.display = state;
	}

	exports.removeAllChildren = function(element) {
		while (element.firstChild) {
			element.removeChild(element.firstChild);
		}
	}

	exports.padNumber = function(number, size) {
		let s = number + "";
		while (s.length < size) {
			s = "0" + s;
		}

		return s;
	}

	exports.stripHtml = function(html) {
		html = html.replace(/onerror/ig, 'safeonerror')
		let tempElement = document.createElement("div");
		tempElement.innerHTML = html;
		return tempElement.textContent;
	}
})(this.webUtils = {});
