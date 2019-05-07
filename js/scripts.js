$(document).ready(function() {
  init();
  $("#ashdust").hide();
  $("#ashdustvideo").on('ended',function(){
    location.reload();
  });
});

function init(){
  var parlor = new Parlor();
  var user = new Cart();
  parlor.sizes = [new Size("small", 6.25),new Size("medium", 8.00),new Size("Large",10.00)];
  pepperoni = new Topping("Pepperoni", 1.00);
  sausage = new Topping("sausage", 1.00);
  console.log(parlor.sizes);
  parlor.toppings.push( new Topping("Dust", 0));
  parlor.toppings.push( new Topping("Ash", 0));
  parlor.toppings.push(sausage);
  parlor.toppings.push(pepperoni);
  $("#sizes").append(parlor.listsizes());
  $("#toppings").append(parlor.ToppingWriter());
  console.log(parlor);

  console.log(user);
  $("#addbutton").click(function(){
    $("#subtotal").empty();
    peetz = new Pizza();
    $("#toppings").val().forEach(function(top){
      peetz.toppings.push(parlor.toppings[top]);
    });

    console.log(parlor.sizes[$("#sizes").val()]);
    peetz.size = parlor.sizes[$("#sizes").val()];
    console.log(peetz);
    console.log($("#sizes").val());
    console.log(peetz.size);
    CheckBotnik(peetz);
    user.pizzas.push(peetz);

    ReceiptGen(user);

    console.log(parlor);
  });
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
      $("#subtotal").hide();
      $("#buypizza").hide();
      $("#ashdust").show();
      $("#pizzasign").hide();
      $("#ashdustvideo")[0].play();
    }
  });
}


function Cart(pizzas){
  this.pizzas = [];
  this.price = countsubtotal(this);
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
  console.log(this.toppings);
  for(var currtop = 0; this.toppings.length > currtop; currtop++){
    writer+="<option value='" + currtop + "'>" + this.toppings[currtop].name + "</option>";
    console.log(this.toppings[currtop]);
  }
  return writer;
}
function ReceiptGen(cart){
  $("#subtotal").empty();
  writer = null;
  console.log(writer);
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

      console.log(top);
      writer+= top.name;
      writer+= top.price.toFixed(2);
      writer+= "<br>";

    });
    writer+= "<br>"+thispizza.price();
    //writer += pizza.price();
    //writer+= "</div>";
    writer += "<input type='button' value='x' id='closepizza"+ pizziterate+"'> </input><hr>";

    console.log($("#pizza"+pizziterate));
    console.log(writer);
    $("#subtotal").html(writer);

    pizziterate++;
    });


    //AddCloseButton(pizziterate,cart);
  writer = "</div>";
  $("#subtotal").append(writer);

  for(pizziterate=0;pizziterate<cart.pizzas.length;pizziterate++){

  $("#closepizza"+pizziterate).click(function(){
    console.log(pizziterate + "Removed");
    cart.pizzas.splice(pizziterate-1,1);

    ReceiptGen(cart);
    console.log(cart);
  });


}


}

Parlor.prototype.listsizes = function(){
  sizewriter = "";

  for(var currsize = 0; this.sizes.length > currsize; currsize++){



    sizewriter += "<option value='";
    sizewriter += currsize;
    sizewriter += "'>";
    sizewriter += this.sizes[currsize].name;
    sizewriter += "</option>";
    console.log(sizewriter);
  }
  return sizewriter;
}
function AddCloseButton(idofpizza,cart){



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
