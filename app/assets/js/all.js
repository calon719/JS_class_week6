const addTicketInputs = document.querySelectorAll('[data-prop="ticketInput"]');
const addTicketBtn = document.querySelector('#addTicketBtn');
const cardList = document.querySelector('.ticketList');
const searchAreaInput = document.querySelector('.searchRegion');
const searchResultNum = document.querySelector('.searchResultNum');

let ticketData;

addTicketBtn.addEventListener('click', checkInput);
searchAreaInput.addEventListener('change', areaFilter);

axios.get('https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json').then(function (response) {
  ticketData = response.data.data;
  renderData(ticketData);
}).catch(function (error) {
  console.log(error);
});

function checkInput(e) {
  e.preventDefault();
  let checkStatus = true;

  addTicketInputs.forEach(function (item) {
    let inputSpan = document.querySelector(`span[data-ticketInput=${item.getAttribute('data-ticketInput')}]`);
    let descriptionSpan = document.querySelector(`span[data-ticketInput="descriptionNum"]`);
    if (item.getAttribute('data-ticketInput') == 'rate') {
      // 檢查 套票星級
      if (parseInt(item.value) > 10 || parseInt(item.value) < 1 || item.value === '') {
        inputSpan.setAttribute('class', 'text-danger');
        checkStatus = false;
      } else {
        inputSpan.setAttribute('class', 'hidden');
      };
    } else if (item.value === '') {
      // 檢查空值
      inputSpan.setAttribute('class', 'text-danger');
      checkStatus = false;
    } else if (item.getAttribute('data-ticketInput') === 'description') {
      inputSpan.setAttribute('class', 'hidden');
      // 檢查字數
      if (item.value.length > 100) {
        descriptionSpan.setAttribute('class', 'text-danger')
        checkStatus = false;
      } else {
        descriptionSpan.setAttribute('class', 'hidden');
      };
    } else {
      inputSpan.setAttribute('class', 'hidden');
    };
  });

  addTicket(checkStatus);
};

// 新增資料到 物件 data
function addTicket(checkStatus) {
  if (checkStatus) {
    let obj = {};

    addTicketInputs.forEach(function (item) {
      obj.id = ticketData.length;
      if (item.getAttribute('type') === 'number') {
        obj[item.getAttribute('data-ticketInput')] = parseInt(item.value);
      } else {
        obj[item.getAttribute('data-ticketInput')] = item.value;
      };
      item.value = '';
    });
    ticketData.push(obj);
    areaFilter(); // 更新畫面
  } else {
    return;
  }
};

// 篩選資料
// 篩選後會顯示『搜尋資料為 ? 筆』
function areaFilter() {
  let inputValue = searchAreaInput.value;
  let searchResultData;

  if (inputValue === '' || inputValue === '全部') {
    searchResultData = ticketData;
  } else {
    searchResultData = ticketData.filter(function (item) {
      return item.area === inputValue;
    });
  };
  renderData(searchResultData);
};

// 組裝字串、渲染畫面
function renderData(data) {
  let str = '';
  let resultNum = 0;
  data.forEach(function (item) {
    resultNum++;
    str += `
      <li class="flex flex-col bg-white transform hover:scale-105 transition-all duration-700 ease-out rounded relative shadow">
        <div class="bg-secondary text-white text-xl rounded-r py-2 px-5 absolute -top-5 left-0">${item.area}</div>
        <div class="h-45 bg-no-repeat bg-cover bg-center rounded-t"style="background-image: url('${item.imgUrl}');"></div>
        <div class="relative text-primary pt-5 pb-4 px-5 flex flex-grow flex-col justify-between">
          <div class="absolute bg-primary text-white w-10 text-center rounded-r py-1 -top-4 left-0">${item.rate}</div>
          <div>
            <h2 class="font-bold text-2xl pb-1 mb-4 border-b-2">${item.name}</h2>
            <p class="text-gray-500 mb-8 break-words">${item.description}</p>
          </div>
          <div class="flex justify-between items-center">
            <p><i class="fas fa-exclamation-circle"></i><span class="font-medium">剩下最後 ${item.group} 組</span></p>
            <p class="font-medium flex items-center">TWD<span class="text-4xl ml-1">$${item.price}</span></p>
          </div>
        </div>
      </li>
    `;
  });
  cardList.innerHTML = str;
  searchResultNum.textContent = resultNum;
};
