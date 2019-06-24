var imageViewer = function() {
	var images = document.querySelectorAll(".ad-image-viewer");
	images.forEach(function(item,index){
		var hasCreated = item.data("adapter-image-viewer-hasCreated");
		if (hasCreated) {
			return;
		}
		item.data("adapter-image-viewer-hasCreated", true);
		var img = item;
		var target = img.getAttribute("data-target"); //图片组名
		var imgUrl = img.getAttribute("src"); //获取图片链接地址
		var groupImages = undefined;
		if (target) {
			//获取一组图片
			groupImages = document.body.querySelectorAll("[data-target='" + target + "']");
		}
		img.onclick = function(e) {
			var img_container = document.createElement('div'); //创建图片浏览器容器
			img_container.className = "ad-image-viewer-container"; //设置样式类
			img_container.style.height = window.innerHeight + "px"; //屏幕高度
			window.addEventListener('resize', function() {
				img_container.style.height = window.innerHeight + "px"; //屏幕高度
			})
			var newImage = document.createElement("img"); //创建新的图片
			newImage.setAttribute("src", imgUrl);
			newImage.className = "ad-img-response";
			img_container.appendChild(newImage);
			document.body.appendChild(img_container);
			if (target) {
				//左右按钮
				var btn_left = string2dom(
					"<div class='ad-image-viewer-btn' data-placement='left'><span class='fa fa-angle-left'></span></div>");
				var btn_right = string2dom(
					"<div class='ad-image-viewer-btn' data-placement='right'><span class='fa fa-angle-right'></span></div>");
				var topbar = string2dom("<div class='ad-image-bar'></div>");
				var leftbar = string2dom(
					"<div class='ad-image-bar-left'><span class='fa fa-angle-left'></span></div>");
				var centerbar = string2dom("<div class='ad-image-bar-center'><span></span> / " + groupImages.length +
					"</div>");
				topbar.appendChild(leftbar);
				topbar.appendChild(centerbar);
				img_container.appendChild(btn_left);
				img_container.appendChild(btn_right);
				img_container.appendChild(topbar);
				//点击返回按钮关闭浏览器
				leftbar.onclick = function(e) {
					document.body.removeChild(img_container);
				}
				var index = 0; //图片在组中的序列
				var length = groupImages.length; //总图片数
				for (var i = 0; i < groupImages.length; i++) {
					if (groupImages[i] == img) {
						index = i;
						children(centerbar)[0].innerText = index + 1;
					}
				}
				btn_left.onclick = function(e) {
					e.stopPropagation();
					//如果是第一张图片，则跳到最后一张
					if (index == 0) {
						index = length - 1; //最后一张的序列
					} else {
						index = index - 1;
					}
					newImage.setAttribute("src", groupImages[index].getAttribute("src"));
					children(centerbar)[0].innerText = index + 1;
				}
				btn_right.onclick = function(e) {
					e.stopPropagation();
					//如果是最后一张图片，则跳到第一张
					if (index == length - 1) {
						index = 0; //第一张的序列
					} else {
						index = index + 1;
					}
					newImage.setAttribute("src", groupImages[index].getAttribute("src"));
					children(centerbar)[0].innerText = index + 1;
				}
				//滑动
				var startX = 0;
				var endX = 0;
				var moveX = 0;
				img_container.ontouchstart = function(e) {
					if (e.target != img_container && e.target != newImage) {
						return;
					}
					e.preventDefault();
					startX = e.targetTouches[0].pageX;
				}
				img_container.ontouchend = function(e) {
					if (e.target != img_container && e.target != newImage) {
						return;
					}
					e.preventDefault();
					endX = e.changedTouches[0].pageX;
					moveX = endX - startX;
					if (moveX > 0) {
		
						if (index == 0) {
							index = length - 1; //最后一张的序列
						} else {
							index = index - 1;
						}
					} else if (moveX < 0) {
		
						if (index == length - 1) {
							index = 0; //第一张的序列
						} else {
							index = index + 1;
						}
					}
					newImage.setAttribute("src", groupImages[index].getAttribute("src"));
					children(centerbar)[0].innerText = index + 1;
				}
			} else {
				//如果不是一组图片浏览器，那么点击图片容器任何区域都会关闭
				img_container.onclick = function(e) {
					document.body.removeChild(img_container);
				}
			}
		}
	})
}


/**
 * Element原型原型添加data方法
 * 该方法绑定在元素对象身上，适用于与该方法相关的数据绑定
 */
Element.prototype.data = function(key, value) {
	var _this = this,
		_dataName = 'adapterUI', // 存储至DOM上的对象标记
		_data = {};
	// 未指定参数,返回全部
	if (typeof key === 'undefined' && typeof value === 'undefined') {
		return _this[_dataName];
	}
	// setter
	if (typeof(value) !== 'undefined') {
		_data = _this[_dataName] || {};
		_data[key] = value;
		_this[_dataName] = _data;
		return this;
	}
	// getter
	else {
		_data = _this[_dataName] || {};
		return _data[key];
	}
};

/**
 * 查找某个节点下指定类名/id/标签名的子元素
 */
function children(element, name) {
	var result = new Array(); //存放结果的数组
	var childNodes = element.children; //子元素数组
	//name参数不存在时，查找他的所有子元素
	if (name == "" || name == undefined || name == null || typeof(name) != "string") {
		for (var i = 0; i < childNodes.length; i++) {
			result.push(childNodes[i]);
		}
		return result;
	}
	var selectors = name.split(",");
	var result = new Array();
	selectors.forEach(function(selector) {
		var prefix = selector.substr(0, 1);
		switch (prefix) {
			case ".": //类名
				selector = selector.substr(1, selector.length - 1);
				for (var i = 0; i < childNodes.length; i++) {
					if (hasClass(childNodes[i], selector)) {
						result.push(childNodes[i]);
					}
				}
				break;
			case "#": //ID
				selector = selector.substr(1, selector.length - 1);
				for (var i = 0; i < childNodes.length; i++) {
					if (trim(childNodes[i].getAttribute("id"), false).indexOf(selector) > -1) {
						result.push(childNodes[i]);
					}
				}
				break;
			default: //可能根据标签名或者多选择器
				for (var i = 0; i < childNodes.length; i++) {
					if (childNodes[i].tagName.toUpperCase() == selector.toUpperCase()) {
						result.push(childNodes[i]);
					}
				}
				break;
		}
	});
	//删除重复的元素
	for (var i = 0; i < result.length; i++) {
		for (var j = i + 1; j < result.length; j++) {
			if (result[i] == result[j]) {
				result.splice(i, 1);
				break;
			}
		}
	}
	return result;
}


/**
 * string类型的dom元素转为dom节点
 */
function string2dom(str) {
	if (typeof(str) != "string") {
		throw new Error("参数不是字符串类型");
	}
	var parentEle = document.createElement("div");
	parentEle.innerHTML = str;
	return parentEle.children[0];
}


/**
 * 判断指定元素是否含有指定类名
 */
function hasClass(element, className) {
	var classList = element.classList;
	if (classList.contains(className)) {
		return true;
	} else {
		return false;
	}
}


/**
 * 去除字符串空格
 * is_global：为true时去除所有空格，否则只去除两边空格
 */
function trim(str, is_global) {
	if (typeof(str) != "string") {
		return "";
	}
	var result = str.replace(/(^\s+)|(\s+$)/g, "");
	if (is_global) {
		result = result.replace(/\s/g, "");
	}
	return result;
}
