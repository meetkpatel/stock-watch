/* exported data */
var data = {
  view: 'home-view',
  watchlistEntries: [],
  portfolioEntries: [],
  currentStock: null
};
var previousData = localStorage.getItem('ajax-project');
if (previousData !== null) {
  data = JSON.parse(previousData);
}

function beforeunloadFunction(event) {
  var jsonEntries = JSON.stringify(data);
  localStorage.setItem('ajax-project', jsonEntries);
}

window.addEventListener('beforeunload', beforeunloadFunction);
