'use strict';
var ecommerceApp = angular.module('ecommerceApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute'
  ]).config([
    '$routeProvider',
    function ($routeProvider) {
      $routeProvider.when('/home', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      }).when('/store', {
        templateUrl: 'views/store.html',
        controller: 'MainCtrl'
      }).when('/product/:productid', {
        templateUrl: 'views/product.html',
        controller: 'MainCtrl'
      }).when('/cart', {
        templateUrl: 'views/shoppingCart.html',
        controller: 'MainCtrl'
      }).when('/checkout', {
        templateUrl: 'views/checkout.html',
        controller: 'MainCtrl'
      }).when('/invoice/:orderID', {
        templateUrl: 'views/invoice.html',
        controller: 'MainCtrl'
      }).otherwise({ redirectTo: '/home' });
    }
  ]);
ecommerceApp.factory('DataService', function () {
  var myStore = new store();
  var master = {};
  // create shopping cart
  var myCart = new shoppingCart('AngularStore');
  // enable PayPal checkout
  // note: the second parameter identifies the merchant; in order to use the
  // shopping cart with PayPal, you have to create a merchant account with
  // PayPal. You can do that here:
  // https://www.paypal.com/webapps/mpp/merchant
  myCart.addCheckoutParameters('PayPal', 'paypaluser@youremail.com');
  // enable Google Wallet checkout
  // note: the second parameter identifies the merchant; in order to use the
  // shopping cart with Google Wallet, you have to create a merchant account with
  // Google. You can do that here:
  // https://developers.google.com/commerce/wallet/digital/training/getting-started/merchant-setup
  myCart.addCheckoutParameters('Google', 'xxxxxxx', {
    ship_method_name_1: 'UPS Next Day Air',
    ship_method_price_1: '20.00',
    ship_method_currency_1: 'USD',
    ship_method_name_2: 'UPS Ground',
    ship_method_price_2: '15.00',
    ship_method_currency_2: 'USD'
  });
  // enable Stripe checkout
  // note: the second parameter identifies your publishable key; in order to use the
  // shopping cart with Stripe, you have to create a merchant account with
  // Stripe. You can do that here:
  // https://manage.stripe.com/register
  myCart.addCheckoutParameters('Stripe', 'pk_test_xxxx', { chargeurl: 'https://localhost:1234/processStripe.aspx' });
  // return data object with store and cart
  return {
    store: myStore,
    cart: myCart,
    master: master
  };
});
ecommerceApp.filter('makeRange', function () {
  return function (input) {
    var lowBound, highBound;
    switch (input.length) {
    case 1:
      lowBound = 0;
      highBound = parseInt(input[0]) - 1;
      break;
    case 2:
      lowBound = parseInt(input[0]);
      highBound = parseInt(input[1]);
      break;
    default:
      return input;
    }
    var result = [];
    for (var i = lowBound; i <= highBound; i++)
      result.push(i);
    return result;
  };
});
'use strict';
angular.module('ecommerceApp').controller('MainCtrl', [
  '$scope',
  '$routeParams',
  'DataService',
  function ($scope, $routeParams, DataService) {
    $scope.store = DataService.store;
    $scope.cart = DataService.cart;
    if ($routeParams.productid != null) {
      $scope.product = $scope.store.getProduct($routeParams.productid);
    }
    $scope.master = DataService.master;
    $scope.update = function (user) {
      DataService.master = angular.copy(user);
      window.location.href = '#/invoice/1';
    };
    $scope.reset = function () {
      $scope.user = angular.copy(DataService.master);
    };
    $scope.reset();
    $scope.isUnchanged = function (user) {
      return angular.equals(user, $scope.master);
    };
    $scope.randomID = function () {
      return Math.floor(Math.random() * 10000);
    };
    $scope.resetShop = function () {
      DataService.cart.clearItems();
      window.location.href = '#/home';
    };
  }
]);
/**
 * Created by koustuv on 28/3/14.
 */
function shoppingCart(cartName) {
  this.cartName = cartName;
  this.clearCart = false;
  this.checkoutParameters = {};
  this.items = [];
  // load items from local storage when initializing
  this.loadItems();
  // save items to local storage when unloading
  var self = this;
  $(window).unload(function () {
    if (self.clearCart) {
      self.clearItems();
    }
    self.saveItems();
    self.clearCart = false;
  });
}
// load items from local storage
shoppingCart.prototype.loadItems = function () {
  var items = localStorage != null ? localStorage[this.cartName + '_items'] : null;
  if (items != null && JSON != null) {
    try {
      var items = JSON.parse(items);
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.id != null && item.name != null && item.price != null && item.quantity != null) {
          item = new cartItem(item.id, item.name, item.price, item.quantity, item.image);
          this.items.push(item);
        }
      }
    } catch (err) {
    }
  }
};
// save items to local storage
shoppingCart.prototype.saveItems = function () {
  if (localStorage != null && JSON != null) {
    localStorage[this.cartName + '_items'] = JSON.stringify(this.items);
  }
};
// adds an item to the cart
shoppingCart.prototype.addItem = function (id, name, price, quantity, image) {
  quantity = this.toNumber(quantity);
  if (quantity != 0) {
    // update quantity for existing item
    var found = false;
    for (var i = 0; i < this.items.length && !found; i++) {
      var item = this.items[i];
      if (item.id == id) {
        found = true;
        item.quantity = this.toNumber(item.quantity + quantity);
        if (item.quantity <= 0) {
          this.items.splice(i, 1);
        }
      }
    }
    // new item, add now
    if (!found) {
      var item = new cartItem(id, name, price, quantity, image);
      this.items.push(item);
    }
    // save changes
    this.saveItems();
  }
};
// get the total price for all items currently in the cart
shoppingCart.prototype.getTotalPrice = function (id) {
  var total = 0;
  for (var i = 0; i < this.items.length; i++) {
    var item = this.items[i];
    if (id == null || item.id == id) {
      total += this.toNumber(item.quantity * item.price);
    }
  }
  return total;
};
// get the total price for all items currently in the cart
shoppingCart.prototype.getTotalCount = function (id) {
  var count = 0;
  for (var i = 0; i < this.items.length; i++) {
    var item = this.items[i];
    if (id == null || item.id == id) {
      count += this.toNumber(item.quantity);
    }
  }
  return count;
};
// clear the cart
shoppingCart.prototype.clearItems = function () {
  this.items = [];
  this.saveItems();
};
// define checkout parameters
shoppingCart.prototype.addCheckoutParameters = function (serviceName, merchantID, options) {
  // check parameters
  if (serviceName != 'PayPal' && serviceName != 'Google' && serviceName != 'Stripe') {
    throw 'serviceName must be \'PayPal\' or \'Google\' or \'Stripe\'.';
  }
  if (merchantID == null) {
    throw 'A merchantID is required in order to checkout.';
  }
  // save parameters
  this.checkoutParameters[serviceName] = new checkoutParameters(serviceName, merchantID, options);
};
// check out
shoppingCart.prototype.checkout = function (serviceName, clearCart) {
  // select serviceName if we have to
  if (serviceName == null) {
    var p = this.checkoutParameters[Object.keys(this.checkoutParameters)[0]];
    serviceName = p.serviceName;
  }
  // sanity
  if (serviceName == null) {
    throw 'Use the \'addCheckoutParameters\' method to define at least one checkout service.';
  }
  // go to work
  var parms = this.checkoutParameters[serviceName];
  if (parms == null) {
    throw 'Cannot get checkout parameters for \'' + serviceName + '\'.';
  }
  switch (parms.serviceName) {
  case 'PayPal':
    this.checkoutPayPal(parms, clearCart);
    break;
  case 'Google':
    this.checkoutGoogle(parms, clearCart);
    break;
  case 'Stripe':
    this.checkoutStripe(parms, clearCart);
    break;
  default:
    throw 'Unknown checkout service: ' + parms.serviceName;
  }
};
// check out using PayPal
// for details see:
// www.paypal.com/cgi-bin/webscr?cmd=p/pdn/howto_checkout-outside
shoppingCart.prototype.checkoutPayPal = function (parms, clearCart) {
  // global data
  var data = {
      cmd: '_cart',
      business: parms.merchantID,
      upload: '1',
      rm: '2',
      charset: 'utf-8'
    };
  // item data
  for (var i = 0; i < this.items.length; i++) {
    var item = this.items[i];
    var ctr = i + 1;
    data['item_number_' + ctr] = item.id;
    data['item_name_' + ctr] = item.name;
    data['quantity_' + ctr] = item.quantity;
    data['amount_' + ctr] = item.price.toFixed(2);
  }
  // build form
  var form = $('<form/></form>');
  form.attr('action', 'https://www.paypal.com/cgi-bin/webscr');
  form.attr('method', 'POST');
  form.attr('style', 'display:none;');
  this.addFormFields(form, data);
  this.addFormFields(form, parms.options);
  $('body').append(form);
  // submit form
  this.clearCart = clearCart == null || clearCart;
  form.submit();
  form.remove();
};
// check out using Google Wallet
// for details see:
// developers.google.com/checkout/developer/Google_Checkout_Custom_Cart_How_To_HTML
// developers.google.com/checkout/developer/interactive_demo
shoppingCart.prototype.checkoutGoogle = function (parms, clearCart) {
  // global data
  var data = {};
  // item data
  for (var i = 0; i < this.items.length; i++) {
    var item = this.items[i];
    var ctr = i + 1;
    data['item_name_' + ctr] = item.id;
    data['item_description_' + ctr] = item.name;
    data['item_price_' + ctr] = item.price.toFixed(2);
    data['item_quantity_' + ctr] = item.quantity;
    data['item_merchant_id_' + ctr] = parms.merchantID;
  }
  // build form
  var form = $('<form/></form>');
  // NOTE: in production projects, use the checkout.google url below;
  // for debugging/testing, use the sandbox.google url instead.
  //form.attr("action", "https://checkout.google.com/api/checkout/v2/merchantCheckoutForm/Merchant/" + parms.merchantID);
  form.attr('action', 'https://sandbox.google.com/checkout/api/checkout/v2/checkoutForm/Merchant/' + parms.merchantID);
  form.attr('method', 'POST');
  form.attr('style', 'display:none;');
  this.addFormFields(form, data);
  this.addFormFields(form, parms.options);
  $('body').append(form);
  // submit form
  this.clearCart = clearCart == null || clearCart;
  form.submit();
  form.remove();
};
// check out using Stripe
// for details see:
// https://stripe.com/docs/checkout
shoppingCart.prototype.checkoutStripe = function (parms, clearCart) {
  // global data
  var data = {};
  // item data
  for (var i = 0; i < this.items.length; i++) {
    var item = this.items[i];
    var ctr = i + 1;
    data['item_name_' + ctr] = item.id;
    data['item_description_' + ctr] = item.name;
    data['item_price_' + ctr] = item.price.toFixed(2);
    data['item_quantity_' + ctr] = item.quantity;
  }
  // build form
  var form = $('.form-stripe');
  form.empty();
  // NOTE: in production projects, you have to handle the post with a few simple calls to the Stripe API.
  // See https://stripe.com/docs/checkout
  // You'll get a POST to the address below w/ a stripeToken.
  // First, you have to initialize the Stripe API w/ your public/private keys.
  // You then call Customer.create() w/ the stripeToken and your email address.
  // Then you call Charge.create() w/ the customer ID from the previous call and your charge amount.
  form.attr('action', parms.options['chargeurl']);
  form.attr('method', 'POST');
  form.attr('style', 'display:none;');
  this.addFormFields(form, data);
  this.addFormFields(form, parms.options);
  $('body').append(form);
  // ajaxify form
  form.ajaxForm({
    success: function () {
      $.unblockUI();
      alert('Thanks for your order!');
    },
    error: function (result) {
      $.unblockUI();
      alert('Error submitting order: ' + result.statusText);
    }
  });
  var token = function (res) {
    var $input = $('<input type=hidden name=stripeToken />').val(res.id);
    // show processing message and block UI until form is submitted and returns
    $.blockUI({ message: 'Processing order...' });
    // submit form
    form.append($input).submit();
    this.clearCart = clearCart == null || clearCart;
    form.submit();
  };
  StripeCheckout.open({
    key: parms.merchantID,
    address: false,
    amount: this.getTotalPrice() * 100,
    currency: 'usd',
    name: 'Purchase',
    description: 'Description',
    panelLabel: 'Checkout',
    token: token
  });
};
// utility methods
shoppingCart.prototype.addFormFields = function (form, data) {
  if (data != null) {
    $.each(data, function (name, value) {
      if (value != null) {
        var input = $('<input></input>').attr('type', 'hidden').attr('name', name).val(value);
        form.append(input);
      }
    });
  }
};
shoppingCart.prototype.toNumber = function (value) {
  value = value * 1;
  return isNaN(value) ? 0 : value;
};
//----------------------------------------------------------------
// checkout parameters (one per supported payment service)
//
function checkoutParameters(serviceName, merchantID, options) {
  this.serviceName = serviceName;
  this.merchantID = merchantID;
  this.options = options;
}
//----------------------------------------------------------------
// items in the cart
//
function cartItem(id, name, price, quantity, image) {
  this.id = id;
  this.name = name;
  this.price = price * 1;
  this.quantity = quantity * 1;
  this.image = image;
}
function store() {
  this.products = [
    new product(1, 'Dell Vostro 2520', 31990, 'https://img1a.flixcart.com//image/computer/9/j/s/dell-vostro-notebook-125x125-imadhjwhzkxagjat.jpeg', 'http://img5a.flixcart.com/image/computer/9/j/s/dell-vostro-notebook-400x400-imadhjwhvhgt5hys.jpeg', 4, [
      'Core i3 (3rd Gen)',
      '500 GB HDD',
      '4 GB DDR3 RAM',
      'Ubuntu'
    ]),
    new product(2, 'Apple MacBook Air', 674900, 'http://img5a.flixcart.com/image/computer/h/7/e/apple-macbook-air-notebook-125x125-imadnat64rts2aj9.jpeg', 'http://img5a.flixcart.com/image/computer/h/7/e/apple-macbook-air-notebook-400x400-imadnat64rts2aj9.jpeg', 5, [
      'Core i5 (4th Gen)',
      '128 GB SSD',
      '4 GB DDR3 RAM',
      'Mac OS X Mountain Lion'
    ]),
    new product(4, 'HP Pavillion 15', 38000, 'http://img6a.flixcart.com/image/computer/n/d/g/hp-pavilion-notebook-125x125-imadp2b4uudbyaj7.jpeg', 'http://img6a.flixcart.com/image/computer/n/d/g/hp-pavilion-notebook-400x400-imadp2b4uudbyaj7.jpeg', 4, [
      'APU Quad Core A10',
      '1 TB HDD',
      '8 GB DDR3 RAM',
      'Free DOS'
    ]),
    new product(5, 'Dell Inspiron 15', 33590, 'http://img6a.flixcart.com/image/computer/b/g/r/dell-inspiron-notebook-125x125-imadhz455huhguxg.jpeg', 'http://img6a.flixcart.com/image/computer/b/g/r/dell-inspiron-notebook-400x400-imadhz455huhguxg.jpeg', 5, [
      'Core i3 (3rd Gen)',
      '500 GB HDD',
      '4 GB DDR3 RAM',
      'Windows 8'
    ]),
    new product(6, 'Acer Aspire V5-123', 22990, 'http://img5a.flixcart.com/image/computer/u/b/b/acer-aspire-v5-123-netbook-125x125-imadqsgqwnyse4es.jpeg', 'http://img6a.flixcart.com/image/computer/g/w/e/acer-aspire-v5-netbook-v5-123-400x400-imadtrg496xhzhmv.jpeg', 4, [
      'APU Dual Core',
      '500 GB HDD',
      '4 GB DDR3 RAM',
      'Windows 8'
    ]),
    new product(7, 'HP Envy 15', 62400, 'http://img6a.flixcart.com/image/computer/s/g/h/hp-envy-notebook-15-j110tx-125x125-imadsecyrgy3y4gz.jpeg', 'http://img6a.flixcart.com/image/computer/s/g/h/hp-envy-notebook-15-j110tx-400x400-imadsecyrgy3y4gz.jpeg', 3, [
      'Core i5 (4th Gen)',
      '8 GB DDR3 RAM',
      '1 TB HDD',
      'Windows 8.1'
    ]),
    new product(8, 'Lenovo Ideapad Y510', 65490, 'http://img5a.flixcart.com/image/computer/e/4/6/lenovo-ideapad-notebook-125x125-imadz5yutejhc68z.jpeg', 'http://img5a.flixcart.com/image/computer/e/4/6/lenovo-ideapad-notebook-400x400-imadz5yutejhc68z.jpeg', 5, [
      'Core i7 (4th Gen)',
      '8 GB DDR3 RAM',
      '1 TB HDD',
      'Windows 8'
    ]),
    new product(10, 'Lenovo Essentials G500', 38790, 'http://img6a.flixcart.com/image/computer/j/a/z/lenovo-essential-notebook-g500-59-370339-125x125-imadnzz3jnywaxhe.jpeg', 'http://img6a.flixcart.com/image/computer/j/a/z/lenovo-essential-notebook-g500-59-370339-400x400-imadnzz3jnywaxhe.jpeg', 5, [
      'Core i5 (3rd Gen)',
      '4 GB DDR3 RAM',
      '500 GB HDD',
      'Free DOS'
    ])
  ];
  store.prototype.getProduct = function (id) {
    for (var i = 0; i < this.products.length; i++) {
      if (this.products[i].id == id)
        return this.products[i];
    }
    return null;
  };
}
/**
 * Created by koustuv on 28/3/14.
 */
function product(id, name, price, image, imageLarge, rating, features) {
  this.id = id;
  this.name = name;
  this.price = price;
  this.image = image;
  this.imageLarge = imageLarge;
  this.rating = rating;
  this.features = features;
}