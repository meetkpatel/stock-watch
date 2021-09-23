/* global _ */
/* global Plotly */
var $seachBar = document.querySelector('#searchBar');
var $seachBtn = document.querySelector('#seachBtn');
var $tbody = document.querySelector('tbody');
var $stockName = document.querySelector('.stock-name');
// var stockSymbol = '';
var $stockCurrentPrice = document.querySelector('#stock-current-price');
var $stockCurrentPrice2 = document.querySelector('#stock-current-price-2');
var $todayHigh = document.querySelector('.today-high');
var $todayLow = document.querySelector('.today-low');
var $todayOpen = document.querySelector('.today-open');
var $PreviosClose = document.querySelector('.previos-close');
var $displayTable = document.querySelector('.displayTable');
var $displayWatchListTable = document.querySelector('.displayWatchListTable');
var $view = document.querySelectorAll('.view');
var $close = document.querySelector('#close');
var $watchlistNavBtn = document.querySelector('.watchlistNavBtn');
var $homeBtn = document.querySelector('.homeBtn');
var $searchSeaction = document.querySelector('.searchSeaction');
var $watchListBtn = document.querySelector('#watchListBtn');
var $deleteBtn = document.querySelector('#deleteBtn');

var searchListSymbol = [];
var searchListName = [];
var stockHigh = [];
var stockLow = [];
var stockOpen = [];
var stockClose = [];
var stockDateTime = [];
$seachBtn.addEventListener('click', seachStock);
$displayTable.addEventListener('click', displayTableClick);
$displayWatchListTable.addEventListener('click', displayWatchListTableClick);
$close.addEventListener('click', closeSpecificStock);
$watchlistNavBtn.addEventListener('click', watchlistNavBtnClick);
$homeBtn.addEventListener('click', homeBtnClick);
$watchListBtn.addEventListener('click', watchListBtn);

function displayWatchListTableClick(event) {
  if (event.target.getAttribute('watchlist-symbol') === null) {
    return;
  }
  data.currentStock = event.target.getAttribute('watchlist-symbol');
  switchView('stock-view');
}

function watchListBtn(event) {
  if (data.watchlistEntries.indexOf(data.currentStock) === -1) {
    data.watchlistEntries.push(data.currentStock);
  }
  generateWatchlist();
  switchView('watchlist-view');
}

function watchlistNavBtnClick(event) {
  data.currentStock = null;
  data.isPortfolio = false;
  data.isWatchlist = true;
  // generateWatchlist();
  switchView('watchlist-view');
}
function homeBtnClick(event) {
  data.currentStock = null;
  data.isPortfolio = false;
  data.isWatchlist = false;
  switchView('home-view');
}

function closeSpecificStock() {
  $seachBar.value = '';
  switchView('home-view');
}
function seachStock(event) {
  seachStockAPI($seachBar.value);
  switchView('search-view');
}
function generateWatchlist() {
  var $trNodes = document.querySelectorAll('tr');
  for (var j = 0; j < $trNodes.length; j++) {
    $trNodes[j].remove();
  }
  for (var i = 0; i < data.watchlistEntries.length; i++) {
    watchListgenerate(data.watchlistEntries[i]);
  }
}

function watchListgenerate(stockfetch) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://cloud.iexapis.com/stable/stock/' + stockfetch + '/quote?token=sk_d5ca9aca3c0c446b93e9d5013e8d4a95');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    var $watchListTr = document.createElement('tr');
    var $watchListTdName = document.createElement('td');
    var $watchListTdPrice = document.createElement('td');
    var $watchListDiv = document.createElement('div');
    var $watchListH4Name = document.createElement('h4');
    var $watchListH4Price = document.createElement('h4');
    var $watchListH4Change = document.createElement('h4');

    $watchListTdName.setAttribute('class', 'watchlistNameTd');
    $watchListTdPrice.setAttribute('class', 'watchlistPriceTd');
    $watchListDiv.setAttribute('class', 'textCenter');
    $watchListH4Name.setAttribute('watchlist-symbol', stockfetch);

    $watchListTr.appendChild($watchListTdName);
    $watchListTdName.appendChild($watchListH4Name);
    $watchListTr.appendChild($watchListTdPrice);
    $watchListTdPrice.appendChild($watchListDiv);
    $watchListDiv.appendChild($watchListH4Price);
    $watchListDiv.appendChild($watchListH4Change);

    $watchListH4Name.textContent = xhr.response.companyName;
    $watchListH4Price.textContent = xhr.response.latestPrice;
    $watchListH4Change.textContent = xhr.response.change + ' (' + (parseFloat(xhr.response.changePercent) * 100).toFixed(2) + '%)';
    var change = '' + xhr.response.change;
    if (change[0] === '-') {
      $watchListH4Price.setAttribute('class', 'stock-price-red');
      $watchListH4Change.setAttribute('class', 'stock-price-red');
    } else {
      $watchListH4Price.setAttribute('class', 'stock-price-green');
      $watchListH4Change.setAttribute('class', 'stock-price-green');
    }
    $displayWatchListTable.append($watchListTr);
  });
  xhr.send();
}
function displayTableClick(event) {
  if (!event.target.matches('I')) {
    return;
  }
  data.currentStock = event.target.getAttribute('stock-symbol');
  // getSpecificStockAPI(event.target.getAttribute('stock-symbol'));
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
  // stockSymbol = specificStock;
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://cloud.iexapis.com/stable/stock/' + specificStock + '/quote?token=sk_d5ca9aca3c0c446b93e9d5013e8d4a95');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    $stockName.textContent = xhr.response.companyName;
    $PreviosClose.textContent = xhr.response.previousClose;
    var change = '' + xhr.response.change;
    $stockCurrentPrice.textContent = xhr.response.latestPrice;
    $stockCurrentPrice2.textContent = xhr.response.change + ' (' + (parseFloat(xhr.response.changePercent) * 100).toFixed(2) + '%)';
    if (change[0] === '-') {
      $stockCurrentPrice.setAttribute('class', 'display-flex stock-price-red');
      $stockCurrentPrice2.setAttribute('class', 'stock-price-red');
    } else {
      $stockCurrentPrice.setAttribute('class', 'display-flex stock-price-green');
      $stockCurrentPrice2.setAttribute('class', 'stock-price-green');
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
    var data1 = [
      {
        x: stockDateTime,
        y: stockClose,
        type: 'scatter'
      }
    ];
    var layout = {
      title: $stockName.textContent,
      font: { size: 14 },
      padding: 0
    };
    Plotly.newPlot('graphPlot', data1, layout, { responsive: true });
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
  if (data.view === 'home-view' || data.view === 'search-view' || data.view === 'stock-view') {
    $searchSeaction.className = 'searchSeaction';
  } else {
    $searchSeaction.className = 'searchSeaction hidden';
  }
  if (data.currentStock !== null && data.isPortfolio === false && data.isPortfolio === false) {
    $deleteBtn.className = 'hidden';
    $watchListBtn.className = 'show';
    getSpecificStockAPI(data.currentStock);
  }
  if (data.view === 'watchlist-view' && data.isWatchlist === true) {
    generateWatchlist();
  }
  if (data.view === 'stock-view' && data.isWatchlist === true) {
    $deleteBtn.className = 'show';
    $watchListBtn.className = 'hidden';
    generateWatchlist();
  }
}
switchView(data.view);
