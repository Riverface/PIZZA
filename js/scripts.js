$(document).ready(function () {
  Init();
});

//initialize all components
function Init() {
  var parlor = new Parlor();
  var user = new Cart();
  var vid = $("#ebselect")[0];
  user.currpos = 0;
  AddProps(parlor);
  HideBotnik();
  InitialPrint(parlor);
  AddHooks(parlor, user, vid);
  $("#histshell").hide();
  $("#subtcon").hide();
  AddRemote(vid);
}

//Add functionality to the volume control remote
function AddRemote(vid) {
  $("#volup").click(function () {
    vid.volume += 0.05;
  });
  $("#voldown").click(function () {
    vid.volume -= 0.05;
  });
  $("#mute").click(function () {
    vid.muted = !vid.muted;
  });

  var storedVolume = 0;
  vid.volume = 0.75;
}
//add properties
function AddProps(parl) {
  parl.sizes = [
    new Size("small", 6.25),
    new Size("medium", 8.0),
    new Size("Large", 10.0),
  ];
  //"Appetizing" toppings
  parl.toppings = [
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
function AddHooks(parl, cart, vid) {
  $("#addbutton").click(function () {
    $("#subtotal").empty();
    peetz = new Pizza();
    $("#toppings")
      .val()
      .forEach(function (top) {
        peetz.toppings.push(parl.toppings[top]);
      });

    peetz.size = parl.sizes[$("#sizes").val()];
    CheckBotnik(peetz, vid);
    cart.pizzas.push(peetz);
    CartGen(cart);
    $("#subtcon").show();
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
  $("#ashdustvideo").on("ended", function () {
    location.reload();
  });
  $("#tomorrowill").on("ended", function () {
    location.reload();
  });
}
//print the sizes and toppings.
function InitialPrint(parl) {
  $("#sizes").append(parl.listsizes());
  $("#toppings").append(parl.ToppingWriter());
}
//See if it's time for Robotnik to wake up and/or perform
function CheckBotnik(pizz, vid) {
  iterate = 0;
  pingas = 0;
  //Does robotnik like your topping choice?
  pizz.toppings.forEach(function (topper) {
    if (
      topper.name === "Pepperoni" ||
      topper.name == "Iodine" ||
      topper.name == "Nerds rope" ||
      topper.name == "Gravel" ||
      topper.name == "Anchovies" ||
      topper.name == "Salami"
    ) {
      pingas++;
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
    if (pingas == 6) {
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
  this.price = countsubtotal(this);
  this.history = [];
  this.currpos;
}
//Count the subtotal and return on #subtotal
function countsubtotal(shoppingcart) {
  shoppingcart.pizzas.forEach(function (peetza) {
    subtotal += peetza.price;
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
  writer = "";
  //loop through all of the toppings in the parlor, spit them out into the <select>
  for (var currtop = 0; this.toppings.length > currtop; currtop++) {
    writer +=
      "<option value='" +
      currtop +
      "'>" +
      this.toppings[currtop].name +
      "</option>";
  }
  return writer;
};

//Generate the subtotal and effectively create a "cart"
function CartGen(cart) {
  $("#subtotal").empty();
  writer = null;

  writer = "<div class='propertyLabel'>Receipt</div>";
  writer += "<div class='property'>";
  pizziterate = 0;
  cart.pizzas.forEach(function (thispizza) {
    writer += "<br><div id='pizza" + pizziterate + " '>";
    writer += thispizza.size.name;
    if (thispizza.toppings.length == 0) {
      writer += " cheese pizza ";
    }
    if (thispizza.toppings.length > 0) {
      writer += "<br>with:<br>";
    }
    thispizza.toppings.forEach(function (top) {
      writer += top.name;
      writer += top.price.toFixed(2);
      writer += "<br>";
    });
    writer += "<br>" + thispizza.price();
    writer += "</div>";
    $("#subtotal").html(writer);
    $("#subtotal").append("</div>");
    pizziterate++;
  });
  //Add the close button
  AddCloseButton(cart);
  return writer;
}

//Lists the sizes applicable to pizzas on the page.
Parlor.prototype.listsizes = function () {
  sizewriter = "";
  //Loop through the sizes, print to <select>
  for (var currsize = 0; this.sizes.length > currsize; currsize++) {
    sizewriter += "<option value='";
    sizewriter += currsize;
    sizewriter += "'>";
    sizewriter += this.sizes[currsize].name;
    sizewriter += "</option>";
  }
  return sizewriter;
};

function AddCloseButton(cart) {
  //use a second writer
  //to make absolute sure these functions won't overload
  //no matter what is added
  secondwriter = "";

  for (var pizziterate = 0; pizziterate < cart.pizzas.length; pizziterate++) {
    secondwriter +=
      "<input type='button' value='x' id='closepizza" +
      pizziterate +
      "'> </input><hr>";
    $("#pizza" + pizziterate).append(secondwriter);
    secondwriter = "";
  }

  secondwriter = "";
  for (pizziterate = 0; pizziterate < cart.pizzas.length; pizziterate++) {
    $("#closepizza" + pizziterate).click(function () {
      cart.pizzas.splice(pizziterate - 1, 1);
      CartGen(cart);
    });
  }
}

Pizza.prototype.price = function () {
  theprice = this.size.price;
  this.toppings.forEach(function (topp) {
    theprice += topp.price;
  });
  return theprice;
};
Cart.prototype.total = function () {
  //count up total pizza prices
  totalprice = 0;
  this.pizzas.forEach(function (thepizza) {
    totalprice += thepizza.price();
  });
};

function BuyPizza(cart) {
  if (cart.pizzas != []) {
    cart.history.push(CartGen(cart));

    TotalPrint(cart);
    $("#histmove").html();
    histwriter = "";
    for (
      var writeiterate = 0;
      writeiterate < cart.history.length;
      writeiterate++
    ) {
      histwriter +=
        "<option name='" +
        "' value='" +
        writeiterate +
        "'>" +
        writeiterate +
        "</option>";
    }
    $("#histmove").html(histwriter);
  }
  $("#subtcon").hide();
}

function TotalPrint(cart) {
  //print the total for the order before it's sent
  $("#subtotal").empty();
  writer = null;
  writer = "<div class='propertyLabel'>Receipt</div>";
  writer += "<div class='property'>";
  pizziterate = 0;
  cart.pizzas.forEach(function (thispizza) {
    writer += "<br><div id='pizza" + pizziterate + "'>";
    writer += thispizza.size.name;
    if (thispizza.toppings.length == 0) {
      writer += thispizza.size.price + " pizza";
    }
    if (thispizza.toppings.length > 0) {
      writer += "with:<br>";
    }

    thispizza.toppings.forEach(function (top) {
      writer += top.name;
      writer += top.price.toFixed(2);
      writer += "<br>";
    });
    writer += "<br>" + thispizza.price();

    writer += "</div>";

    $("#subtotal").html(writer);
    $("#subtotal").append("</div>");
    pizziterate++;
  });

  //Add a close button
  AddCloseButton(cart);

  //MAKE ABSOLUTELY CERTAIN NO OVERLOADING HAPPENS WITH ---THIRD--- WRITER
  thirdwriter = "";

  for (currhist = 0; currhist < cart.history.length; currhist++) {
    thirdwriter += "<div id='history" + currhist + "'>";
    thirdwriter += cart.history[currhist];
    thirdwriter += "</div></div>";
  }

  $("#history").html(thirdwriter);
  $("#subtotal").html("");
  cart.pizzas = [];
}

//this happens when you change which order is selected
function MoveHist(cart, target) {
  var hysterectomy = 0; //history iterator
  for (hysterectomy = 0; hysterectomy < cart.history.length; hysterectomy++) {
    $("#history" + hysterectomy).hide();
  }
  $("#history" + target).show();
}

function ReceiptGen(cart) {
  $("#receipts").empty();
  writer = null;
  writer = "<div class='propertyLabel'>Receipt</div>";
  writer += "<div class='property'>";
  pizziterate = 0;
  cart.pizzas.forEach(function (thispizza) {
    writer += thispizza.size.name;
    if (thispizza.toppings.length == 0) {
      writer += thispizza.size.price + " pizza";
    }
    if (thispizza.toppings.length > 0) {
      writer += "with:<br>";
    }

    thispizza.toppings.forEach(function (top) {
      writer += top.name;
      writer += top.price.toFixed(2);
      writer += "<br>";
    });
    writer += "<br>" + thispizza.price();
    writer += "</div>";
    $("#subtotal").html(writer);
    $("#subtotal").append("</div>");
    pizziterate++;
  });

  //AddCloseButton(pizziterate,cart);
  return writer;
}
