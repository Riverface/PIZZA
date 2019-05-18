$(document).ready(function() {
  Init();


});

function Init(){
  var parlor = new Parlor();
  var user = new Cart();
  user.currpos=0;
  AddProps(parlor);
  HideBotnik();
  InitialPrint(parlor);
  AddHooks(parlor,user);
}
function AddProps(parl){

  parl.sizes = [new Size("small", 6.25),new Size("medium", 8.00),new Size("Large",10.00)];
  parl.toppings = [
    new Topping("Pepperoni", 1.00),
    new Topping("sausage", 1.00),
    new Topping("Dust", 0),
    new Topping("Ash", 0)
  ];
}

function AddHooks(parl,cart){
  $("#addbutton").click(function(){
    $("#subtotal").empty();
    peetz = new Pizza();
    $("#toppings").val().forEach(function(top){
      peetz.toppings.push(parl.toppings[top]);
    });
    peetz.size = parl.sizes[$("#sizes").val()];
    CheckBotnik(peetz);
    cart.pizzas.push(peetz);
    CartGen(cart);
  });

  $("#buybutton").click(function(){
    BuyPizza(cart);
  });
  $("#histfw").click(function(){
    MoveHist(1,cart.currpos,cart);
  });
  $("#histbk").click(function(){
    MoveHist(-1,cart.currpos,cart);
  });
}

function HideBotnik(){
  $("#ashdust").hide();
  $("#ashdustvideo").on('ended',function(){
    location.reload();
  });
}
function InitialPrint(parl){
  $("#sizes").append(parl.listsizes());
  $("#toppings").append(parl.ToppingWriter());
}
function CheckBotnik(pizz){
  iterate = 0;
  pizz.toppings.forEach(function(topper){

    if((topper.name === "Ash") || (topper.name === "Dust") ){

      iterate++;
      console.log(topper.name);
      console.log(iterate);
    }

    else{
      iterate--;
    }

    if(iterate == 2){
      $("#createpizza").hide();
      $("#buypizza").hide();
      $("#ashdust").show();
      $("#pizzasign").hide();
      $("#subtcon").hide();
      $("#ashdustvideo")[0].play();
    }
  });
}
function Cart(pizzas){
  this.pizzas = [];
  this.price = countsubtotal(this);
  this.history = []
  this.currpos;
}
function countsubtotal(shoppingcart){
  shoppingcart.pizzas.forEach(function(peetza){
    subtotal += peetza.price;
    return subtotal;
  });
}
function Parlor(){
  this.toppings = [];
  this.pizzas = [];
  this.sizes = [];
  this.subtotal = "";

}
function Size(name, price){
  this.name = name;
  this.price = price;
}

function Topping(name,price){
  this.name = name;
  this.price = price;
  this.amount;

}


function Pizza(size){
  this.toppings=[];
  this.size=size;
}

Parlor.prototype.ToppingWriter = function(){
  writer = "";

  for(var currtop = 0; this.toppings.length > currtop; currtop++){
    writer+="<option value='" + currtop + "'>" + this.toppings[currtop].name + "</option>";

  }
  return writer;
}
function CartGen(cart){
  $("#subtotal").empty();
  writer = null;

  writer = "<div class='propertyLabel'>Receipt</div>";
  writer += "<div class='property'>";
  pizziterate = 0;
  cart.pizzas.forEach(function(thispizza){
    writer += "<br><div id='pizza"+ pizziterate +"'>";
    writer += thispizza.size.name;
    if(thispizza.toppings.length == 0){

      writer += thispizza.size.price + " pizza";
    }
    if(thispizza.toppings.length > 0){
      writer+= "with:<br>";
    }

    thispizza.toppings.forEach(function(top){


      writer+= top.name;
      writer+= top.price.toFixed(2);
      writer+= "<br>";

    });
    writer+= "<br>"+thispizza.price();

    writer+= "</div>";


    console.log($("#pizza"+pizziterate));
    console.log(writer);
    $("#subtotal").html(writer);
    $("#subtotal").append("</div>");
    pizziterate++;

  });


  //AddCloseButton(pizziterate,cart);

  AddCloseButton(cart);
  return writer;
}

Parlor.prototype.listsizes = function(){
  sizewriter = "";

  for(var currsize = 0; this.sizes.length > currsize; currsize++){



    sizewriter += "<option value='";
    sizewriter += currsize;
    sizewriter += "'>";
    sizewriter += this.sizes[currsize].name;
    sizewriter += "</option>";

  }
  return sizewriter;
}

function AddCloseButton(cart){
  secondwriter = "";

  for(var pizziterate=0;pizziterate < cart.pizzas.length;pizziterate++){
        secondwriter += "<input type='button' value='x' id='closepizza"+ (pizziterate) +"'> </input><hr>";
        console.log(secondwriter);
            console.log(pizziterate);
            $("#pizza"+pizziterate).append(secondwriter);
            secondwriter="";
  }

  secondwriter = "";
  for(pizziterate=0;pizziterate < cart.pizzas.length;pizziterate++){
            $("#closepizza"+pizziterate).click(function() {
              CartGen(cart);
              cart.pizzas.splice(pizziterate-1,1);
            });
  }
}

Pizza.prototype.price = function(){
  theprice = this.size.price;
  this.toppings.forEach(function(topp){
    theprice += topp.price;
  });
  return theprice;
}
Cart.prototype.total = function(){
  totalprice = 0;
  this.pizzas.forEach(function(thepizza){
    totalprice+=thepizza.price();
  });
}
Pizza.prototype.size = function(){
}
function BuyPizza(cart){
  cart.history.push(CartGen(cart));
  console.log(cart.history);
  TotalPrint(cart);
}

function TotalPrint(cart){
  $("#subtotal").empty();
  writer = null;

  writer = "<div class='propertyLabel'>Receipt</div>";
  writer += "<div class='property'>";
  pizziterate = 0;
  cart.pizzas.forEach(function(thispizza){
    writer += "<br><div id='pizza"+ pizziterate +"'>";
    writer += thispizza.size.name;
    if(thispizza.toppings.length == 0){

      writer += thispizza.size.price + " pizza";
    }
    if(thispizza.toppings.length > 0){
      writer+= "with:<br>";
    }

    thispizza.toppings.forEach(function(top){


      writer+= top.name;
      writer+= top.price.toFixed(2);
      writer+= "<br>";

    });
    writer+= "<br>"+thispizza.price();

    writer+= "</div>";


    console.log($("#pizza"+pizziterate));
    console.log(writer);
    $("#subtotal").html(writer);
    $("#subtotal").append("</div>");
    pizziterate++;

  });


  //AddCloseButton(pizziterate,cart);

  AddCloseButton(cart);
  return writer;
  thirdwriter = "";


  cart.history.forEach(function(histentry){
    thirdwriter  += "<div id='history"+ cart.currpos+"'>";

    thirdwriter += histentry;
    thirdwriter  +="</div>";
  });

  $("#history").html(thirdwriter);
  $("#subtotal").html("");
  cart.order = [];
  $("#history"+ cart.currpos).hide();
  if(currpos == 0){
    $("#history"+ cart.currpos).show();
  }
  cart.currpos++;
}

function MoveHist(dir,currpos,cart){
console.log(currpos);
if(cart.history.length == 1){
currpos = 0;
}
if(currpos >  0){
if(currpos<cart.history.length){
$("#history"+currpos).hide();
$("#history"+currpos).show();
currpos+=dir;
}
}
else{

  $("#history"+currpos).show();
}



}
ReceiptGen(cart){

  $("#receipts").empty();
  writer = null;

  writer = "<div class='propertyLabel'>Receipt</div>";
  writer += "<div class='property'>";
  pizziterate = 0;
  cart.pizzas.forEach(function(thispizza){

    writer += thispizza.size.name;
    if(thispizza.toppings.length == 0){

      writer += thispizza.size.price + " pizza";
    }
    if(thispizza.toppings.length > 0){
      writer+= "with:<br>";
    }

    thispizza.toppings.forEach(function(top){


      writer+= top.name;
      writer+= top.price.toFixed(2);
      writer+= "<br>";

    });
    writer+= "<br>"+thispizza.price();

    writer+= "</div>";


    console.log($("#pizza"+pizziterate));
    console.log(writer);
    $("#subtotal").html(writer);
    $("#subtotal").append("</div>");
    pizziterate++;

  });


  //AddCloseButton(pizziterate,cart);
  return writer;
}
