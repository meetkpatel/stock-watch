/* global _ */
/* global Plotly */
var $seachBar = document.querySelector('#searchBar');
var $seachBtn = document.querySelector('#seachBtn');
var $tbody = document.querySelector('tbody');
var $stockName = '';
var $stockCurrentPrice = '';
var $stockCurrentPrice2 = '';
var $todayHigh = '';
var $todayLow = '';
var $todayOpen = '';
var $PreviosClose = '';
var $displayStockContent = document.querySelector('.displayStockContent');
var $displayTable = document.querySelector('.displayTable');
var $displayWatchListTable = document.querySelector('.displayWatchListTable');
var $displayPortfolioTable = document.querySelector('.displayPortfolioTable');
var $stockHistory = document.querySelector('.stockHistory');
var $crossCancelHistory = document.querySelector('.cross-cancel-history');

var $watchlistNavBtn = document.querySelector('.watchlistNavBtn');
var $portfolioNavBtn = document.querySelector('.portfolioNavBtn');
var $homeBtn = document.querySelector('.homeBtn');
var $searchSeaction = document.querySelector('.searchSeaction');
var $cancelationPage = document.querySelector('.cancelationPage');
var $stockAlreadyAlert = document.querySelector('.stockAlreadyAlert');
var $deleteBtnConfirm = document.querySelector('.deleteBtnConfirm');
var $cancelBtnModal = document.querySelector('.cancelBtnModal');
var $closeAlertBtnModal = document.querySelector('.closeAlertBtnModal');
var $container = document.querySelector('.main-container');

var $H3PortfolioInvested = document.querySelector('.H3PortfolioInvested');
var $H3PortfolioCurrent = document.querySelector('.H3PortfolioCurrent');
var $H3PLStatement = document.querySelector('.H3PLStatement');

var searchListSymbol = [];
var searchListName = [];
var stockHigh = [];
var stockLow = [];
var stockOpen = [];
var stockClose = [];
var stockDateTime = [];
var portfolioCurrentStock = '';
var domPortfolioViewQtyInput = '';
var domPortfolioViewQtyPriceInput = '';
var $portfolioAddBtn = '';
var totalInvestment = 0;
var totalValue = 0;

$seachBtn.addEventListener('click', seachStock);
$displayTable.addEventListener('click', displayTableClick);
$displayWatchListTable.addEventListener('click', displayWatchListTableClick);
$displayPortfolioTable.addEventListener('click', displayPortfolioTableClick);
$crossCancelHistory.addEventListener('click', crossCancelHistoryClick);

function crossCancelHistoryClick() {
  $stockHistory.className = 'stockHistory hidden';

}

$watchlistNavBtn.addEventListener('click', watchlistNavBtnClick);
$portfolioNavBtn.addEventListener('click', portfolioNavBtnClick);

$homeBtn.addEventListener('click', homeBtnClick);
$deleteBtnConfirm.addEventListener('click', deleteBtnConfirmClick);
$cancelBtnModal.addEventListener('click', cancelBtnModalClick);
$closeAlertBtnModal.addEventListener('click', closeAlertBtnModalClick);

function deleteBtnClick() {
  $cancelationPage.className = 'cancelationPage';
}

function cancelBtnModalClick() {
  $cancelationPage.className = 'cancelationPage hidden';
}
function deleteBtnConfirmClick() {
  if (data.view === 'watchlist-stock-view') {
    $cancelationPage.className = 'cancelationPage hidden';
    data.watchlistEntries.splice(data.watchlistEntries.indexOf(data.currentStock), 1);
    data.currentStock = null;
    switchView('watchlist-view');
  } else {
    for (var i = 0; i < data.portfolioEntries.length; i++) {
      $cancelationPage.className = 'cancelationPage hidden';
      if (data.portfolioEntries[i].stockName === data.currentStock) {
        data.portfolioEntries.splice(i, 1);
        data.currentStock = null;
        switchView('portfoliolist-view');
      }
    }
  }
}
function closeAlertBtnModalClick() {
  $stockAlreadyAlert.className = 'stockAlreadyAlert hidden';
}

function portfolioAddBtnClick(event) {
  event.preventDefault();
  if (data.view !== 'portfolio-edit-stock-view') {
    for (var i = 0; i < data.portfolioEntries.length; i++) {
      if (data.portfolioEntries[i].stockName === data.currentStock) {
        $stockAlreadyAlert.className = 'stockAlreadyAlert';
        return;
      }
    }
    totalInvestment = 0;
    totalValue = 0;
    var tempObj = {};
    tempObj.stockName = data.currentStock;
    tempObj.stockQty = $portfolioAddBtn.elements.domPortfolioViewQtyInput.value;
    tempObj.stockPrice = $portfolioAddBtn.elements.domPortfolioViewQtyPriceInput.value;
    data.portfolioEntries.push(tempObj);
  } else {
    for (var j = 0; j < data.portfolioEntries.length; j++) {
      if (data.portfolioEntries[j].stockName === data.currentStock) {
        totalInvestment = 0;
        totalValue = 0;
        data.portfolioEntries[j].stockQty = $portfolioAddBtn.elements.domPortfolioViewQtyInput.value;
        data.portfolioEntries[j].stockPrice = $portfolioAddBtn.elements.domPortfolioViewQtyPriceInput.value;
      }
    }
  }
  switchView('portfoliolist-view');
}
function displayWatchListTableClick(event) {
  if (event.target.getAttribute('watchlist-symbol') === null) {
    return;
  }
  totalInvestment = 0;
  totalValue = 0;
  data.currentStock = event.target.getAttribute('watchlist-symbol');
  switchView('watchlist-stock-view');
}
function displayPortfolioTableClick(event) {
  if (event.target.getAttribute('stock-symbol') === null) {
    return;
  }
  totalInvestment = 0;
  totalValue = 0;
  data.currentStock = event.target.getAttribute('stock-symbol');
  switchView('portfolio-edit-stock-view');
}

function watchListBtnClick(event) {
  if (data.watchlistEntries.indexOf(data.currentStock) === -1) {
    data.watchlistEntries.push(data.currentStock);
  }
  switchView('watchlist-view');
}
function portfolioBtnClick(event) {
  for (var i = 0; i < data.portfolioEntries.length; i++) {
    if (data.portfolioEntries[i].stockName === data.currentStock) {
      $stockAlreadyAlert.className = 'stockAlreadyAlert';
      return;
    }
  }
  switchView('portfolio-stock-view');
}

function watchlistNavBtnClick(event) {
  $seachBar.value = '';
  totalInvestment = 0;
  totalValue = 0;
  data.currentStock = null;
  switchView('watchlist-view');
}

function portfolioNavBtnClick(event) {
  $seachBar.value = '';
  totalInvestment = 0;
  totalValue = 0;
  data.currentStock = null;
  switchView('portfoliolist-view');
}

function homeBtnClick(event) {
  $seachBar.value = '';
  data.currentStock = null;
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

function generatePortfoliolist() {
  var $trNodes = document.querySelectorAll('tr');
  for (var j = 0; j < $trNodes.length; j++) {
    $trNodes[j].remove();
  }
  for (var i = 0; i < data.portfolioEntries.length; i++) {
    portfolioCurrentStock = data.portfolioEntries[i].stockName;
    getLatestPrice(portfolioCurrentStock);
  }
}

function getLatestPrice(specificStock) {

  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://cloud.iexapis.com/stable/stock/' + specificStock + '/quote?token=sk_d5ca9aca3c0c446b93e9d5013e8d4a95');
  xhr.responseType = 'json';
  xhr.addEventListener('load', generateDomPortfoliolist);
  xhr.send();
}

function generateDomPortfoliolist(event) {

  var portfolioCurrentName = event.target.response.companyName;
  var portfolioCurrentPrice = event.target.response.latestPrice;
  var portfolioCurrentSymbol = event.target.response.symbol;
  for (var i = 0; i < data.portfolioEntries.length; i++) {
    if (data.portfolioEntries[i].stockName === portfolioCurrentSymbol) {
      var portfolioCurrentStockQty = data.portfolioEntries[i].stockQty;
      var portfolioCurrentStockPrice = data.portfolioEntries[i].stockPrice;
    }
  }
  var portfolioCurrentValue = (portfolioCurrentPrice * portfolioCurrentStockQty).toFixed(2);
  var portfolioInvestedValue = (portfolioCurrentStockPrice * portfolioCurrentStockQty).toFixed(2);
  var portfolioPriceDiffrence = (portfolioCurrentValue - portfolioInvestedValue).toFixed(2);
  var portfolioPercent = ((portfolioPriceDiffrence / portfolioInvestedValue) * 100);

  totalInvestment += parseFloat(portfolioInvestedValue);
  totalValue += parseFloat(portfolioCurrentValue);
  $H3PortfolioInvested.textContent = totalInvestment.toFixed(2);
  $H3PortfolioCurrent.textContent = totalValue.toFixed(2);
  var $H3Diffrence = (totalValue - totalInvestment).toFixed(2);
  var $H3Percent = (($H3Diffrence / totalInvestment) * 100).toFixed(2);
  var overAllStockColor = '';
  var portfolioH3NegPos = '';
  if ($H3Diffrence[0] === '-') {
    overAllStockColor = 'portfolio-price-red';
    portfolioH3NegPos = '';
  } else {
    overAllStockColor = 'portfolio-price-green';
    portfolioH3NegPos = '+';
  }
  $H3PLStatement.textContent = portfolioH3NegPos + $H3Diffrence + ' (' + portfolioH3NegPos + $H3Percent + '%)';
  $H3PLStatement.setAttribute('class', 'H3PLStatement ' + overAllStockColor);

  var currentStockColor = '';
  var currentStockNegPos = '';
  if (portfolioPriceDiffrence[0] === '-') {
    currentStockColor = 'stock-price-red';
    currentStockNegPos = '';
  } else {
    currentStockColor = 'stock-price-green';
    currentStockNegPos = '+';
  }
  var $tr = document.createElement('tr');

  var $tdStockDetails = document.createElement('td');
  $tdStockDetails.setAttribute('class', 'portfolioStockDetailTd');
  $tr.appendChild($tdStockDetails);

  var $h6Qty = document.createElement('h6');
  $h6Qty.setAttribute('class', 'h6Qty');
  $h6Qty.textContent = 'Qty: ' + portfolioCurrentStockQty;
  $tdStockDetails.appendChild($h6Qty);

  var $h5Name = document.createElement('h5');
  $h5Name.setAttribute('class', 'h5Name');
  $h5Name.setAttribute('stock-symbol', portfolioCurrentSymbol);

  $h5Name.textContent = portfolioCurrentName;
  $tdStockDetails.appendChild($h5Name);

  var $h6Invested = document.createElement('h6');
  $h6Invested.setAttribute('class', 'h6Invested');
  $h6Invested.textContent = 'Buying Price: ' + portfolioCurrentStockPrice;
  $tdStockDetails.appendChild($h6Invested);
  var $tdStockPrice = document.createElement('td');
  $tdStockPrice.setAttribute('class', 'portfolioStockPriceTd');
  $tr.appendChild($tdStockPrice);

  var $h6Percent = document.createElement('h6');
  $h6Percent.setAttribute('class', 'h6Percent ' + currentStockColor);
  $h6Percent.textContent = currentStockNegPos + portfolioPriceDiffrence + ' (' + portfolioPercent.toFixed(2) + '%)';
  $tdStockPrice.appendChild($h6Percent);

  var $h5CurrentPrice = document.createElement('h5');
  $h5CurrentPrice.setAttribute('class', 'h5CurrentPrice');
  $h5CurrentPrice.textContent = portfolioCurrentPrice;
  $tdStockPrice.appendChild($h5CurrentPrice);

  var $h6TotalCurrentPrice = document.createElement('h6');
  $h6TotalCurrentPrice.setAttribute('class', 'h6TotalCurrentPrice ' + currentStockColor);
  $h6TotalCurrentPrice.textContent = (portfolioCurrentPrice * portfolioCurrentStockQty).toFixed(2);
  $tdStockPrice.appendChild($h6TotalCurrentPrice);

  $displayPortfolioTable.appendChild($tr);
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
function generateDomTree(specificStock, stockView) {
  $displayStockContent.remove();

  $displayStockContent = document.createElement('div');
  $displayStockContent.setAttribute('class', 'displayStockContent');
  $container.appendChild($displayStockContent);

  var domViewDiv = document.createElement('div');
  domViewDiv.setAttribute('class', 'view');
  domViewDiv.setAttribute('data-view', stockView);
  $displayStockContent.appendChild(domViewDiv);
  /// ////////////////ROW STOCK NAME/////////////////////////
  var domViewRowStockName = document.createElement('div');
  domViewRowStockName.setAttribute('class', 'row');
  domViewDiv.appendChild(domViewRowStockName);

  var domViewRowStockNameFullCol = document.createElement('div');
  domViewRowStockNameFullCol.setAttribute('class', 'column-full align-content-space-between');
  domViewRowStockName.appendChild(domViewRowStockNameFullCol);

  var domViewRowStockNameH2 = document.createElement('h2');
  domViewRowStockNameH2.setAttribute('class', 'stock-name');
  domViewRowStockNameFullCol.appendChild(domViewRowStockNameH2);
  var domViewRowStockNameI = document.createElement('i');
  domViewRowStockNameI.setAttribute('id', 'close');
  domViewRowStockNameI.setAttribute('class', 'fa fa-times margin-right');
  domViewRowStockNameFullCol.appendChild(domViewRowStockNameI);
  /// ////////////////ROW STOCK PRICE///////////////////////////
  var domViewRowStockPrice = document.createElement('div');
  domViewRowStockPrice.setAttribute('class', 'row');
  domViewDiv.appendChild(domViewRowStockPrice);

  var domViewRowStockPriceFullCol = document.createElement('div');
  domViewRowStockPriceFullCol.setAttribute('class', 'column-full display-flex');
  domViewRowStockPrice.appendChild(domViewRowStockPriceFullCol);

  var domViewRowStockPrice1H3 = document.createElement('h3');
  var domViewRowStockPrice2H3 = document.createElement('h3');
  domViewRowStockPrice1H3.setAttribute('id', 'stock-current-price');
  domViewRowStockPrice2H3.setAttribute('id', 'stock-current-price-2');
  domViewRowStockPriceFullCol.appendChild(domViewRowStockPrice1H3);
  domViewRowStockPriceFullCol.appendChild(domViewRowStockPrice2H3);
  /// //////////////////Graph Row/////////////////////
  var domViewGraphDiv = document.createElement('div');
  domViewGraphDiv.setAttribute('class', 'row');
  domViewDiv.appendChild(domViewGraphDiv);

  var domViewGraphDivFullCol = document.createElement('div');
  domViewGraphDivFullCol.setAttribute('class', 'column-half padding-bottom');
  domViewGraphDiv.appendChild(domViewGraphDivFullCol);

  var domViewGraphPlotDiv = document.createElement('div');
  domViewGraphPlotDiv.setAttribute('id', 'graphPlot');
  domViewGraphPlotDiv.setAttribute('class', 'width: 100%; height: 380px;');
  domViewGraphDivFullCol.appendChild(domViewGraphPlotDiv);
  /// ////////////////Stock Deatils//////////////////
  var domViewStockDeatailDiv = document.createElement('div');
  domViewStockDeatailDiv.setAttribute('class', 'column-half padding-top');
  domViewGraphDiv.appendChild(domViewStockDeatailDiv);
  /// //////////////STOCK HIGH//////////////////////
  var domViewStockDeatailHighDiv = document.createElement('div');
  domViewStockDeatailHighDiv.setAttribute('class', 'align-content-space-between h3-margin-top-bottom');
  domViewStockDeatailDiv.appendChild(domViewStockDeatailHighDiv);

  var domViewStockDeatailHighH3Lable = document.createElement('h3');
  var domViewStockDeatailHighH3Value = document.createElement('h3');
  domViewStockDeatailHighH3Lable.textContent = 'Today\'s High';
  domViewStockDeatailHighH3Value.setAttribute('class', 'today-high');
  domViewStockDeatailHighDiv.appendChild(domViewStockDeatailHighH3Lable);
  domViewStockDeatailHighDiv.appendChild(domViewStockDeatailHighH3Value);
  /// /////////////STOCK LOW////////////////////
  var domViewStockDeatailLowDiv = document.createElement('div');
  domViewStockDeatailLowDiv.setAttribute('class', 'align-content-space-between h3-margin-top-bottom');
  domViewStockDeatailDiv.appendChild(domViewStockDeatailLowDiv);

  var domViewStockDeatailLowH3Lable = document.createElement('h3');
  var domViewStockDeatailLowH3Value = document.createElement('h3');
  domViewStockDeatailLowH3Lable.textContent = 'Today\'s Low';
  domViewStockDeatailLowH3Value.setAttribute('class', 'today-low');
  domViewStockDeatailLowDiv.appendChild(domViewStockDeatailLowH3Lable);
  domViewStockDeatailLowDiv.appendChild(domViewStockDeatailLowH3Value);
  /// /////////////STOCK Open////////////////////
  var domViewStockDeatailOpenDiv = document.createElement('div');
  domViewStockDeatailOpenDiv.setAttribute('class', 'align-content-space-between h3-margin-top-bottom');
  domViewStockDeatailDiv.appendChild(domViewStockDeatailOpenDiv);

  var domViewStockDeatailOpenH3Lable = document.createElement('h3');
  var domViewStockDeatailOpenH3Value = document.createElement('h3');
  domViewStockDeatailOpenH3Lable.textContent = 'Today\'s Open';
  domViewStockDeatailOpenH3Value.setAttribute('class', 'today-open');
  domViewStockDeatailOpenDiv.appendChild(domViewStockDeatailOpenH3Lable);
  domViewStockDeatailOpenDiv.appendChild(domViewStockDeatailOpenH3Value);
  /// /////////////STOCK Close////////////////////
  var domViewStockDeatailCloseDiv = document.createElement('div');
  domViewStockDeatailCloseDiv.setAttribute('class', 'align-content-space-between h3-margin-top-bottom');
  domViewStockDeatailDiv.appendChild(domViewStockDeatailCloseDiv);

  var domViewStockDeatailCloseH3Lable = document.createElement('h3');
  var domViewStockDeatailCloseH3Value = document.createElement('h3');
  domViewStockDeatailCloseH3Lable.textContent = 'Previous Close';
  domViewStockDeatailCloseH3Value.setAttribute('class', 'previos-close');
  domViewStockDeatailCloseDiv.appendChild(domViewStockDeatailCloseH3Lable);
  domViewStockDeatailCloseDiv.appendChild(domViewStockDeatailCloseH3Value);
  /// /////////////STOCK History////////////////////
  if (stockView === 'stock-view') {
    /// //////////WatchList Btn Div///////////////////
    var domViewWatchlistDiv = document.createElement('div');
    domViewWatchlistDiv.setAttribute('class', 'align-content-center width-100 button-space');
    domViewStockDeatailDiv.appendChild(domViewWatchlistDiv);

    var domViewWatchlistBtn = document.createElement('button');
    domViewWatchlistBtn.setAttribute('id', 'watchListBtn');
    domViewWatchlistBtn.textContent = 'Add to Watchlist';
    domViewWatchlistDiv.appendChild(domViewWatchlistBtn);
    /// ////////////Portfolio Btn Div//////////////////////
    var domViewPortfolioDiv = document.createElement('div');
    domViewPortfolioDiv.setAttribute('class', 'align-content-center width-100 button-space');
    domViewStockDeatailDiv.appendChild(domViewPortfolioDiv);

    var domViewPortfolioBtn = document.createElement('button');
    domViewPortfolioBtn.setAttribute('id', 'portfolioBtn');
    domViewPortfolioBtn.textContent = 'Add to Portfolio';
    domViewPortfolioDiv.appendChild(domViewPortfolioBtn);
    /// /action////
    var $watchListBtn = document.querySelector('#watchListBtn');
    $watchListBtn.addEventListener('click', watchListBtnClick);
    var $portfolioBtn = document.querySelector('#portfolioBtn');
    $portfolioBtn.addEventListener('click', portfolioBtnClick);
  } else if (stockView === 'watchlist-stock-view') {
    /// ////////////Portfolio Btn Div//////////////////////
    var domWatchlistViewPortfolioDiv = document.createElement('div');
    domWatchlistViewPortfolioDiv.setAttribute('class', 'align-content-center width-100 button-space');
    domViewStockDeatailDiv.appendChild(domWatchlistViewPortfolioDiv);

    var domWatchlistViewPortfolioBtn = document.createElement('button');
    domWatchlistViewPortfolioBtn.setAttribute('id', 'portfolioBtn');
    domWatchlistViewPortfolioBtn.textContent = 'Add to Portfolio';
    domWatchlistViewPortfolioDiv.appendChild(domWatchlistViewPortfolioBtn);

    var domViewDeleteDiv = document.createElement('div');
    domViewDeleteDiv.setAttribute('class', 'align-content-center width-100 button-space');
    domViewStockDeatailDiv.appendChild(domViewDeleteDiv);

    var domViewWatchDeleteBtn = document.createElement('button');
    domViewWatchDeleteBtn.setAttribute('id', 'deleteBtn');
    domViewWatchDeleteBtn.textContent = 'Delete';
    domViewDeleteDiv.appendChild(domViewWatchDeleteBtn);
    /// /action////
    var $watchlistportfolioBtn = document.querySelector('#portfolioBtn');
    $watchlistportfolioBtn.addEventListener('click', portfolioBtnClick);
    var $deleteBtn = document.querySelector('#deleteBtn');
    $deleteBtn.addEventListener('click', deleteBtnClick);

  } else if (stockView === 'portfolio-stock-view') {
    /// ////////////Portfolio Btn Div//////////////////////

    var domPortfolioForm = document.createElement('form');
    domPortfolioForm.setAttribute('id', 'portfolioForm');
    domViewStockDeatailDiv.appendChild(domPortfolioForm);

    var domPortfolioViewStockQtyDiv = document.createElement('div');
    domPortfolioViewStockQtyDiv.setAttribute('class', 'align-content-center width-100 button-space');
    domPortfolioForm.appendChild(domPortfolioViewStockQtyDiv);

    domPortfolioViewQtyInput = document.createElement('input');
    domPortfolioViewQtyInput.setAttribute('type', 'text');
    domPortfolioViewQtyInput.setAttribute('id', 'portfolioStockQty');
    domPortfolioViewQtyInput.setAttribute('name', 'domPortfolioViewQtyInput');
    domPortfolioViewQtyInput.setAttribute('class', 'portfolio-input-width');
    domPortfolioViewQtyInput.setAttribute('placeholder', 'Add number of stocks');
    domPortfolioViewStockQtyDiv.appendChild(domPortfolioViewQtyInput);
    var domPortfolioViewStockQtyPriceDiv = document.createElement('div');
    domPortfolioViewStockQtyPriceDiv.setAttribute('class', 'align-content-center width-100 button-space');
    domPortfolioForm.appendChild(domPortfolioViewStockQtyPriceDiv);

    domPortfolioViewQtyPriceInput = document.createElement('input');
    domPortfolioViewQtyPriceInput.setAttribute('type', 'text');
    domPortfolioViewQtyPriceInput.setAttribute('id', 'portfolioStockQty');
    domPortfolioViewQtyPriceInput.setAttribute('name', 'domPortfolioViewQtyPriceInput');
    domPortfolioViewQtyPriceInput.setAttribute('class', 'portfolio-input-width');
    domPortfolioViewQtyPriceInput.setAttribute('placeholder', 'Add buying price of stock');
    domPortfolioViewStockQtyPriceDiv.appendChild(domPortfolioViewQtyPriceInput);

    var domPortfolioViewPortfolioDiv = document.createElement('div');
    domPortfolioViewPortfolioDiv.setAttribute('class', 'align-content-center width-100 button-space');
    domPortfolioForm.appendChild(domPortfolioViewPortfolioDiv);

    var domPortfolioViewPortfolioBtn = document.createElement('button');
    domPortfolioViewPortfolioBtn.setAttribute('id', 'portfolioBtn');
    domPortfolioViewPortfolioBtn.setAttribute('type', 'submit');
    domPortfolioViewPortfolioBtn.textContent = 'Add to Portfolio';
    domPortfolioViewPortfolioDiv.appendChild(domPortfolioViewPortfolioBtn);

    /// ////action////
    $portfolioAddBtn = document.querySelector('#portfolioForm');
    $portfolioAddBtn.addEventListener('submit', portfolioAddBtnClick);
  } else if (stockView === 'portfolio-edit-stock-view') {
    /// ////////////Portfolio Btn Div//////////////////////

    var domEditPortfolioForm = document.createElement('form');
    domEditPortfolioForm.setAttribute('id', 'portfolioForm');
    domViewStockDeatailDiv.appendChild(domEditPortfolioForm);

    var domEditPortfolioViewStockQtyDiv = document.createElement('div');
    domEditPortfolioViewStockQtyDiv.setAttribute('class', 'align-content-center width-100 button-space');
    domEditPortfolioForm.appendChild(domEditPortfolioViewStockQtyDiv);

    domPortfolioViewQtyInput = document.createElement('input');
    domPortfolioViewQtyInput.setAttribute('type', 'text');
    domPortfolioViewQtyInput.setAttribute('id', 'portfolioStockQty');
    domPortfolioViewQtyInput.setAttribute('name', 'domPortfolioViewQtyInput');
    domPortfolioViewQtyInput.setAttribute('class', 'portfolio-input-width');
    domEditPortfolioViewStockQtyDiv.appendChild(domPortfolioViewQtyInput);
    var domEditPortfolioViewStockQtyPriceDiv = document.createElement('div');
    domEditPortfolioViewStockQtyPriceDiv.setAttribute('class', 'align-content-center width-100 button-space');
    domEditPortfolioForm.appendChild(domEditPortfolioViewStockQtyPriceDiv);

    domPortfolioViewQtyPriceInput = document.createElement('input');
    domPortfolioViewQtyPriceInput.setAttribute('type', 'text');
    domPortfolioViewQtyPriceInput.setAttribute('id', 'portfolioStockQtyPrice');
    domPortfolioViewQtyPriceInput.setAttribute('name', 'domPortfolioViewQtyPriceInput');
    domPortfolioViewQtyPriceInput.setAttribute('class', 'portfolio-input-width');
    domEditPortfolioViewStockQtyPriceDiv.appendChild(domPortfolioViewQtyPriceInput);

    var domEditPortfolioViewPortfolioDiv = document.createElement('div');
    domEditPortfolioViewPortfolioDiv.setAttribute('class', 'align-content-center width-100 button-space');
    domEditPortfolioForm.appendChild(domEditPortfolioViewPortfolioDiv);

    var domEditPortfolioViewPortfolioBtn = document.createElement('button');
    domEditPortfolioViewPortfolioBtn.setAttribute('id', 'portfolioBtn');
    domEditPortfolioViewPortfolioBtn.setAttribute('type', 'submit');
    domEditPortfolioViewPortfolioBtn.textContent = 'Add to Portfolio';
    domEditPortfolioViewPortfolioDiv.appendChild(domEditPortfolioViewPortfolioBtn);

    var domEditPortfolioViewDeleteDiv = document.createElement('div');
    domEditPortfolioViewDeleteDiv.setAttribute('class', 'align-content-center width-100 button-space');
    domViewStockDeatailDiv.appendChild(domEditPortfolioViewDeleteDiv);

    var domEditPortfolioViewWatchDeleteBtn = document.createElement('button');
    domEditPortfolioViewWatchDeleteBtn.setAttribute('id', 'deleteBtn');
    domEditPortfolioViewWatchDeleteBtn.textContent = 'Delete';
    domEditPortfolioViewDeleteDiv.appendChild(domEditPortfolioViewWatchDeleteBtn);
    /// ////action////
    $portfolioAddBtn = document.querySelector('#portfolioForm');
    $portfolioAddBtn.addEventListener('submit', portfolioAddBtnClick);
    var $editPortfoliodeleteBtn = document.querySelector('#deleteBtn');
    $editPortfoliodeleteBtn.addEventListener('click', deleteBtnClick);

    var $getPortfolioStockQty = document.querySelector('#portfolioStockQty');
    var $getportfolioStockQtyPrice = document.querySelector('#portfolioStockQtyPrice');
    for (var i = 0; i < data.portfolioEntries.length; i++) {
      if (data.portfolioEntries[i].stockName === data.currentStock) {
        var fetchedStockQty = data.portfolioEntries[i].stockQty;
        var fetchedStockPrice = data.portfolioEntries[i].stockPrice;
      }
    }
    $getPortfolioStockQty.value = parseInt(fetchedStockQty);
    $getportfolioStockQtyPrice.value = parseFloat(fetchedStockPrice);

  }
  var domViewHistoryDiv = document.createElement('div');
  domViewHistoryDiv.setAttribute('class', 'align-content-center width-100 button-space');
  domViewStockDeatailDiv.appendChild(domViewHistoryDiv);

  var domViewHistoryBtn = document.createElement('button');
  domViewHistoryBtn.setAttribute('id', 'viewHistoryBtn');
  domViewHistoryBtn.textContent = 'View History';
  domViewHistoryDiv.appendChild(domViewHistoryBtn);

  var $viewHistoryBtn = document.querySelector('#viewHistoryBtn');
  $viewHistoryBtn.addEventListener('click', getStockNamePriceHistory);
  var $close = document.querySelector('#close');
  $close.addEventListener('click', closeSpecificStock);
  $container.appendChild($displayStockContent);
  getStockNamePrice(specificStock);
}

function getStockNamePrice(specificStock) {
  var xhr = new XMLHttpRequest();
  $stockName = document.querySelector('.stock-name');
  $stockCurrentPrice = document.querySelector('#stock-current-price');
  $stockCurrentPrice2 = document.querySelector('#stock-current-price-2');
  $todayHigh = document.querySelector('.today-high');
  $todayLow = document.querySelector('.today-low');
  $todayOpen = document.querySelector('.today-open');
  $PreviosClose = document.querySelector('.previos-close');
  xhr.open('GET', 'https://cloud.iexapis.com/stable/stock/' + specificStock + '/quote?token=sk_d5ca9aca3c0c446b93e9d5013e8d4a95');
  xhr.responseType = 'json';
  xhr.addEventListener('load', getStockNamePriceData);
  xhr.send();
}

function getStockNamePriceData(event) {
  $stockName.textContent = event.target.response.companyName;
  $PreviosClose.textContent = event.target.response.previousClose;
  var change = '' + event.target.response.change;
  $stockCurrentPrice.textContent = event.target.response.latestPrice;
  $stockCurrentPrice2.textContent = event.target.response.change + ' (' + (parseFloat(event.target.response.changePercent) * 100).toFixed(2) + '%)';
  if (change[0] === '-') {
    $stockCurrentPrice.setAttribute('class', 'display-flex stock-price-red');
    $stockCurrentPrice2.setAttribute('class', 'stock-price-red');
  } else {
    $stockCurrentPrice.setAttribute('class', 'display-flex stock-price-green');
    $stockCurrentPrice2.setAttribute('class', 'stock-price-green');
  }
  getOpenCloseHigh();
}

function getOpenCloseHigh() {
  stockDateTime = [];
  stockHigh = [];
  stockLow = [];
  stockOpen = [];
  stockClose = [];
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://cloud.iexapis.com/stable/stock/' + data.currentStock + '/intraday-prices?token=sk_d5ca9aca3c0c446b93e9d5013e8d4a95');
  xhr.responseType = 'json';
  xhr.addEventListener('load', getOpenCloseHighData);
  xhr.send();
}
function getOpenCloseHighData(event) {
  for (var i = 0; i < event.target.response.length; i++) {
    stockDateTime.push(event.target.response[i].date + ' ' + event.target.response[i].minute);
    stockHigh.push(event.target.response[i].high);
    stockLow.push(event.target.response[i].low);
    stockOpen.push(event.target.response[i].open);
    stockClose.push(event.target.response[i].close);
  }
  generateGraph();
}

function generateGraph() {
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
}

function switchView(view) {
  var $view = document.querySelectorAll('.view');
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
  if ((data.view === 'stock-view' || data.view === 'watchlist-stock-view' || data.view === 'portfolio-stock-view' || data.view === 'portfolio-edit-stock-view') && data.currentStock !== null) {
    generateDomTree(data.currentStock, data.view);
  }
  if (data.view === 'watchlist-view') {
    generateWatchlist();
  }
  if (data.view === 'portfoliolist-view') {
    generatePortfoliolist();
  }
}
switchView(data.view);

var stockHistoryPrice = [];
var stockHistoryDate = [];

function getStockNamePriceHistory() {
  $stockHistory.className = 'stockHistory';
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=' + data.currentStock + '&apikey=0GXU3KBC6YFBOGIB');

  xhr.responseType = 'json';
  xhr.addEventListener('load', getStockNamePriceDataHistory);
  xhr.send();
}

function getStockNamePriceDataHistory(event) {
  stockHistoryPrice = [];
  stockHistoryDate = [];

  for (var i in event.target.response['Monthly Time Series']) {
    stockHistoryPrice.push(event.target.response['Monthly Time Series'][i]['4. close']);
    stockHistoryDate.push(i);
  }
  _.reverse(stockHistoryPrice);
  _.reverse(stockHistoryDate);
  generateGraphHistory();
}

function generateGraphHistory() {
  var $getStockName = document.querySelector('.stock-name');

  var data1 = [
    {
      x: stockHistoryDate,
      y: stockHistoryPrice,
      type: 'scatter'
    }
  ];
  var layout = {
    title: $getStockName.textContent,
    font: { size: 16 },
    padding: 0
  };
  Plotly.newPlot('graphHistoryDiv', data1, layout, { responsive: true });
}
