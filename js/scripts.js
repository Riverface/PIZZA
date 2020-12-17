$(document).ready(function () {
  let vid = $("#ebselect")[0];
  let parlor = new Parlor();
  let user = new Cart();
  user.currpos = 0;
  AddProps(parlor);
  HideBotnik();
  InitialPrint(parlor);
  AddHooks(parlor, user, vid);

  $("#interface").click( function(e) {
    vid.play();
  });
  $("#histshell").hide();
  $("#subtcon").hide();
  AddRemote(vid);
});


//Add functionality to the volume control remote
function AddRemote(video) {
  $("#volup").click(function () {
    video.volume += 0.05;
  });
  $("#voldown").click(function () {
    video.volume -= 0.05;
  });
  $("#mute").click(function () {
    video.muted = !video.muted;
  });

  var storedVolume = 0;
  video.volume = 0.75;
}
//add properties
function AddProps(parlor) {
  parlor.sizes = [
    new Size("small", 6.25),
    new Size("medium", 8.0),
    new Size("Large", 10.0),
  ];
  //"Appetizing" toppings
  parlor.toppings = [
    new Topping("Pepperoni", 1.0),
    new Topping("Iodine", 0.0),
    new Topping("Beets", 2.0),
    new Topping("Nerds rope", 2.0),
    new Topping("creamed corn", 0.5),
    new Topping("Gravel", 0),
    new Topping("Anchovies", 2.0),
    new Topping("Dust", 0),
    new Topping("Ash", 0),
    new Topping("toenails", 5.0),
    new Topping("olives", 0.5),
    new Topping("Salami", 1.0),
    new Topping("Chicken", 1.0),
    new Topping("sausage", 1.0),
  ];
}

//Add hooks/listeners
function AddHooks(parlor, cart, vid) {
  $("#addbutton").click(function () {
    $("#subtotal").empty();
    let pizza = new Pizza();
    $("#toppings").val().forEach(function (top) { pizza.toppings.push(parlor.toppings[top]); });
    pizza.size = parlor.sizes[$("#sizes").val()];
    CheckBotnik(pizza, vid);
    cart.pizzas.push(pizza);
    $("#subtcon").show();
    $("#subtotal").html(CartGen(cart));
    AddCloseButtons(cart);
    LinkCloseButtons(cart);
  });

  $("#histmove").change(function () {
    MoveHist(cart, $("#histmove").val());
  });

  $("#buybutton").click(function () {
    BuyPizza(cart);
    MoveHist(cart, cart.history.length - 1);
    $("#histmove").val(cart.history.length - 1);
    $("#histshell").show();
  });
}
//Hide robotnik until the time comes and refresh when videos are over
function HideBotnik() {
  $("#ashdust").hide();
  $("#tomorrowill").hide();
  $("#ashdustvideo").on("ended", function () { location.reload(); });
  $("#tomorrowill").on("ended", function () { location.reload(); });
}
//print the sizes and toppings.
function InitialPrint(parlor) {
  $("#sizes").html(parlor.listsizes());
  $("#toppings").html(parlor.ToppingWriter());
}
//See if it's time for Robotnik to wake up and/or perform
function CheckBotnik(pizz, vid) {
  let iterate = 0;
  let pingasCounter = 0;
  //Does robotnik like your topping choice?
  pizz.toppings.forEach(function (topper) {
    if (
      topper.name === "Pepperoni" || topper.name == "Iodine" || topper.name == "Nerds rope" || topper.name == "Gravel" || topper.name == "Anchovies" || topper.name == "Salami") {
      pingasCounter++;
    }
    if (topper.name === "Ash" || topper.name === "Dust") {
      iterate++;
    } else {
      iterate--;
    }
    //check if Robotnik's gonna wake up
    if (iterate == 2) {
      $("#interface").hide();
      $(".jumbotron").hide();
      $("#createpizza").hide();
      $("#buypizza").hide();
      $("#ashdust").show();
      $("#pizzasign").hide();
      $("#subtcon").hide();
      $("#ashdustvideo")[0].play();
    }

    //Compare number of toppings
    //robotnik likes
    // to number that triggers his performance
    if (pingasCounter == 6) {
      $(".jumbotron").hide();
      $("#ashdust").hide();
      $("#interface").hide();
      $("#ashdustvideo").hide();
      $("#ashdustvideo")[0].pause();
      vid.pause();
      vid = $("#tomorrowill")[0];
      vid.play();
      $("#tomorrowill").show();
      $(document.body).css("background-image", "url(./media/dance.gif)");
    }
  });
}
//Cart object

function Cart(pizzas) {
  this.pizzas = [];
  this.price = countSubtotal(this);
  this.history = [];
  this.currpos;
}
//Count the subtotal and return on #subtotal
function countSubtotal(cart) {
  cart.pizzas.forEach(function (pizza) {
    subtotal += pizza.price;
    return subtotal;
  });
}
//The pizza parlor
function Parlor() {
  this.toppings = [];
  this.pizzas = [];
  this.sizes = [];
  this.subtotal = "";
}
//Sizes of pizzas
function Size(name, price) {
  this.name = name;
  this.price = price;
}
//Toppings that go on pizzas
function Topping(name, price) {
  this.name = name;
  this.price = price;
  this.amount;
}

//Pizza object
function Pizza(size) {
  this.toppings = [];
  this.size = size;
}

//Writes toppings onto the page
Parlor.prototype.ToppingWriter = function () {
  let writer = "";
  //loop through all of the toppings in the parlor, spit them out into the <select>
  for (var topping = 0; this.toppings.length > topping; topping++) { writer += "<option value='" + topping + "'>" + this.toppings[topping].name + "</option>"; } return writer;
};

//Generate the subtotal and effectively create a "cart"
function CartGen(cart) {
  $("#subtotal").empty();
  writer = "<div class='propertyLabel'>Receipt</div>" + "<div class='property'>";
  pizzaIterate = 0;
  cart.pizzas.forEach(function (pizza) {
    writer += "<br><div id='pizza" + pizzaIterate + "'>" + pizza.size.name;
    if (pizza.toppings.length == 0) { writer += " cheese pizza "; }
    if (pizza.toppings.length > 0) { writer += "<br>with:<br>"; }
    pizza.toppings.forEach(function (top) { writer += top.name + top.price.toFixed(2) + "<br>"; });
    writer += "<br>" + pizza.price() + "</div>";
    pizzaIterate++;
  });
  writer += "</div>";
  $("#subtotal").html(writer);
  //Add the close button
  return writer;
}

//Lists the sizes applicable to pizzas on the page.
Parlor.prototype.listsizes = function () {
  let writer = "";
  //Loop through the sizes, print to <select>
  for (var currsize = 0; this.sizes.length > currsize; currsize++) {
    writer += "<option value='" + currsize + "'>" + this.sizes[currsize].name + "</option>";
  }
  return writer;
};

function AddCloseButtons(cart) {
  for (var pizzaIterate = 0; pizzaIterate < cart.pizzas.length; pizzaIterate++) { $('#pizza' + pizzaIterate).append("<input type='button' value='x' id='closepizza" + pizzaIterate + "'> </input><hr>") }
}

function LinkCloseButtons(cart) {
  for (pizzaIterate = 0; pizzaIterate < cart.pizzas.length; pizzaIterate++) {
    $("#closepizza" + pizzaIterate).click(function () {
      cart.pizzas.splice(pizzaIterate - 1, 1);
      TotalPrint(cart);
    });
  }
}

Pizza.prototype.price = function () {
  theprice = this.size.price;
  this.toppings.forEach(function (topping) {
    theprice += topping.price;
  });
  return theprice;
};
Cart.prototype.total = function () {
  //count up total pizza prices
  totalprice = 0;
  this.pizzas.forEach(function (pizza) { totalprice += pizza.price(); });
};

function BuyPizza(cart) {
  if (cart.pizzas != []) {
    cart.history.push(CartGen(cart));
    TotalPrint(cart);
    $("#histmove").html();
    historyEntry = "";
    for (var iterator = 0; iterator < cart.history.length; iterator++) {historyEntry += "<option name='" + iterator + "' value='" + iterator + "'>" + iterator + "</option>";}
    $("#histmove").html(historyEntry);
  }
  $("#subtcon").hide();
}

function TotalPrint(cart) {
  //print the total for the order before it's sent
  $("#subtotal").empty();
  let writer = "<div class='propertyLabel'>Receipt</div>" + "<div class='property'>";
  iterator = 0;
  if(cart.pizzas.length > 0) {

    cart.pizzas.forEach(function (thispizza) {
      writer += "<br><div id='pizza" + iterator + "'>" + thispizza.size.name;
      if (thispizza.toppings.length == 0) writer += thispizza.size.price + " pizza";
      if (thispizza.toppings.length > 0) writer += "with:<br>";
      thispizza.toppings.forEach(function (top) {writer += top.name + top.price.toFixed(2) + "<br>";});
      writer += "<br>" + thispizza.price() + "</div>";
      iterator++;
    });
    writer += "</div>";
    $("#subtotal").html(writer);
  }
  else{
    $("#subtotal").hide
  }

  //Add a close button


  for (historyCursor = 0; historyCursor < cart.history.length - 1; historyCursor++) {
    writer += "<div id='history" + historyCursor + "'>" + cart.history[historyCursor] + "</div>";
  }
  $("#history").html(writer);

}

//this happens when you change which order is selected
function MoveHist(cart, target) {
  var historyIterator = 0; //history iterator
  for (historyIterator = 0; historyIterator < cart.history.length; historyIterator++) {
    $("#history" + historyIterator).hide();
  }
  $("#history" + target).show();
}


