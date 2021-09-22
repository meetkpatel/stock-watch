/* global _ */
var $seachBar = document.querySelector('#searchBar');
var $seachBtn = document.querySelector('#seachBtn');
var $tbody = document.querySelector('tbody');
var $stockName = document.querySelector('.stock-name');
var $stockCurrentPrice = document.querySelector('#stock-current-price');
var $stockCurrentPriceSpan = document.querySelector('#stock-current-price-span');
var $todayHigh = document.querySelector('.today-high');
var $todayLow = document.querySelector('.today-low');
var $todayOpen = document.querySelector('.today-open');
var $PreviosClose = document.querySelector('.previos-close');
var $displayTable = document.querySelector('.displayTable');
var $view = document.querySelectorAll('.view');
var $close = document.querySelector('#close');
var searchListSymbol = [];
var searchListName = [];
var stockHigh = [];
var stockLow = [];
var stockOpen = [];
var stockClose = [];
var stockDateTime = [];
$seachBtn.addEventListener('click', seachStock);
$displayTable.addEventListener('click', displayTableClick);
$close.addEventListener('click', closeSpecificStock);

function closeSpecificStock() {
  $seachBar.value = '';
  switchView('home-view');
}
function seachStock(event) {
  seachStockAPI($seachBar.value);
  switchView('search-view');
}

function displayTableClick(event) {
  if (!event.target.matches('I')) {
    return;
  }

  getSpecificStockAPI(event.target.getAttribute('stock-symbol'));
  switchView('stock-view');
}

function seachStockAPI(keyword) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=' + keyword + '&apikey=0GXU3KBC6YFBOGIB');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    for (var i in xhr.response.bestMatches) {
      searchListSymbol.push(xhr.response.bestMatches[i]['1. symbol']);
      searchListName.push(xhr.response.bestMatches[i]['2. name']);
    }
    showList();
  });
  xhr.send();
}

function showList() {
  var $trNodes = document.querySelectorAll('tr');
  for (var j = 0; j < $trNodes.length; j++) {
    $trNodes[j].remove();
  }
  for (var i = 0; i < searchListName.length; i++) {
    var $tr = document.createElement('tr');
    var $tdName = document.createElement('td');
    var $tdView = document.createElement('td');
    var $i = document.createElement('i');
    $tdName.setAttribute('class', 'width-90');
    $tdView.setAttribute('class', 'width-10');
    $i.setAttribute('class', 'fa fa-eye');
    $i.setAttribute('stock-symbol', searchListSymbol[i]);
    $tr.appendChild($tdName);
    $tr.appendChild($tdView);
    $tdView.appendChild($i);
    $tdName.innerText = searchListName[i] + ' - ' + searchListSymbol[i];
    $tbody.appendChild($tr);
  }

  searchListName = [];
  searchListSymbol = [];
}

function getSpecificStockAPI(specificStock) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://cloud.iexapis.com/stable/stock/' + specificStock + '/quote?token=sk_d5ca9aca3c0c446b93e9d5013e8d4a95');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    var $spanH3 = document.createElement('h3');
    $stockName.textContent = xhr.response.companyName;
    $PreviosClose.textContent = xhr.response.previousClose;
    var change = '' + xhr.response.change;
    $stockCurrentPrice.textContent = xhr.response.latestPrice;
    $spanH3.textContent = xhr.response.change + ' (' + (parseFloat(xhr.response.changePercent) * 100).toFixed(2) + '%)';
    // console.log($spanH3)
    $stockCurrentPriceSpan.appendChild($spanH3);
    $stockCurrentPrice.appendChild($stockCurrentPriceSpan);
    if (change[0] === '-') {
      $stockCurrentPrice.setAttribute('class', 'display-flex stock-price-red');
      $spanH3.setAttribute('class', 'stock-price-red');
    } else {
      $stockCurrentPrice.setAttribute('class', 'display-flex stock-price-green');
      $spanH3.setAttribute('class', 'stock-price-green');

    }
    getOpenCloseHigh(specificStock);
  });
  xhr.send();
}

function getOpenCloseHigh(specificStock) {
  stockDateTime = [];
  stockHigh = [];
  stockLow = [];
  stockOpen = [];
  stockClose = [];
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://cloud.iexapis.com/stable/stock/' + specificStock + '/intraday-prices?token=sk_d5ca9aca3c0c446b93e9d5013e8d4a95');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    for (var i = 0; i < xhr.response.length; i++) {
      stockDateTime.push(xhr.response[i].date + ' ' + xhr.response[i].minute);
      stockHigh.push(xhr.response[i].high);
      stockLow.push(xhr.response[i].low);
      stockOpen.push(xhr.response[i].open);
      stockClose.push(xhr.response[i].close);
    }
    $todayHigh.textContent = _.max(stockHigh);
    $todayLow.textContent = _.min(stockLow);
    $todayOpen.textContent = stockOpen[0];
  });
  xhr.send();
}
function switchView(view) {
  data.view = view;
  for (var i = 0; i < $view.length; i++) {
    if ($view[i].getAttribute('data-view') === view) {
      $view[i].className = 'view';
    } else {
      $view[i].className = 'view hidden';
    }
  }
}
switchView(data.view);
