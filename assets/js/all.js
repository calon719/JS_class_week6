"use strict";

var addTicketInputs = document.querySelectorAll('[data-prop="ticketInput"]');
var addTicketBtn = document.querySelector('#addTicketBtn');
var cardList = document.querySelector('.ticketList');
var searchAreaInput = document.querySelector('.searchRegion');
var searchResultNum = document.querySelector('.searchResultNum');
var ticketData;
addTicketBtn.addEventListener('click', checkInput);
searchAreaInput.addEventListener('change', areaFilter);
axios.get('https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json').then(function (response) {
  ticketData = response.data.data;
  renderData(ticketData);
})["catch"](function (error) {
  console.log(error);
});

function checkInput(e) {
  e.preventDefault();
  var checkStatus = true;
  addTicketInputs.forEach(function (item) {
    var inputSpan = document.querySelector("span[data-ticketInput=".concat(item.getAttribute('data-ticketInput'), "]"));
    var descriptionSpan = document.querySelector("span[data-ticketInput=\"descriptionNum\"]");

    if (item.getAttribute('data-ticketInput') == 'rate') {
      // 檢查 套票星級
      if (parseInt(item.value) > 10 || parseInt(item.value) < 1 || item.value === '') {
        inputSpan.setAttribute('class', 'text-danger');
        checkStatus = false;
      } else {
        inputSpan.setAttribute('class', 'hidden');
      }

      ;
    } else if (item.value === '') {
      // 檢查空值
      inputSpan.setAttribute('class', 'text-danger');
      checkStatus = false;
    } else if (item.getAttribute('data-ticketInput') === 'description') {
      inputSpan.setAttribute('class', 'hidden'); // 檢查字數

      if (item.value.length > 100) {
        descriptionSpan.setAttribute('class', 'text-danger');
        checkStatus = false;
      } else {
        descriptionSpan.setAttribute('class', 'hidden');
      }

      ;
    } else {
      inputSpan.setAttribute('class', 'hidden');
    }

    ;
  });
  addTicket(checkStatus);
}

; // 新增資料到 物件 data

function addTicket(checkStatus) {
  if (checkStatus) {
    var obj = {};
    addTicketInputs.forEach(function (item) {
      obj.id = ticketData.length;

      if (item.getAttribute('type') === 'number') {
        obj[item.getAttribute('data-ticketInput')] = parseInt(item.value);
      } else {
        obj[item.getAttribute('data-ticketInput')] = item.value;
      }

      ;
      item.value = '';
    });
    ticketData.push(obj);
    areaFilter(); // 更新畫面
  } else {
    return;
  }
}

; // 篩選資料
// 篩選後會顯示『搜尋資料為 ? 筆』

function areaFilter() {
  var inputValue = searchAreaInput.value;
  var searchResultData;

  if (inputValue === '' || inputValue === '全部') {
    searchResultData = ticketData;
  } else {
    searchResultData = ticketData.filter(function (item) {
      return item.area === inputValue;
    });
  }

  ;
  renderData(searchResultData);
}

; // 組裝字串、渲染畫面

function renderData(data) {
  var str = '';
  var resultNum = 0;
  data.forEach(function (item) {
    resultNum++;
    str += "\n      <li class=\"flex flex-col bg-white transform hover:scale-105 transition-all duration-700 ease-out rounded relative shadow\">\n        <div class=\"bg-secondary text-white text-xl rounded-r py-2 px-5 absolute -top-5 left-0\">".concat(item.area, "</div>\n        <div class=\"h-45 bg-no-repeat bg-cover bg-center rounded-t\"style=\"background-image: url('").concat(item.imgUrl, "');\"></div>\n        <div class=\"relative text-primary pt-5 pb-4 px-5 flex flex-grow flex-col justify-between\">\n          <div class=\"absolute bg-primary text-white w-10 text-center rounded-r py-1 -top-4 left-0\">").concat(item.rate, "</div>\n          <div>\n            <h2 class=\"font-bold text-2xl pb-1 mb-4 border-b-2\">").concat(item.name, "</h2>\n            <p class=\"text-gray-500 mb-8 break-words\">").concat(item.description, "</p>\n          </div>\n          <div class=\"flex justify-between items-center\">\n            <p><i class=\"fas fa-exclamation-circle\"></i><span class=\"font-medium\">\u5269\u4E0B\u6700\u5F8C ").concat(item.group, " \u7D44</span></p>\n            <p class=\"font-medium flex items-center\">TWD<span class=\"text-4xl ml-1\">$").concat(item.price, "</span></p>\n          </div>\n        </div>\n      </li>\n    ");
  });
  cardList.innerHTML = str;
  searchResultNum.textContent = resultNum;
}

;
//# sourceMappingURL=all.js.map
