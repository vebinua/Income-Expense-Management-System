const ENV = 'staging';

if (ENV == 'staging') {

  var config = {
    "baseUrl": "http://www.testing.local/iems/Income-Expense-Management-System/",
    "routeBase": "iems/Income-Expense-Management-System/"
  }
} else {

  var config = {
    "baseUrl": "https://dev.edwardbinua.com/cell5/",
    "routeBase": "cell5/"
  }

}