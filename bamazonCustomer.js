//     Dependency variables 
var mysql = require('mysql');
var inquirer = require('inquirer');
var colors = require('colors');
var Table = require('cli-table');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon"
  });


// FUNCTION to initialize connection, welcome, and run the other processes  ==========================
function start(){

  connection.connect(function(err) {
     if (err) throw err;
     console.log(`
 =================================================================================================== 
                   Welcome to BAMAZON: Magic Items and Weapon Depot!
 ===================================================================================================     
     `.red);
    
    tabulate();
    customerOptions();
  
  });
}

// FUNCTION that generates table on start and after updates ==========================================
function tabulate(){
  connection.query('SELECT * FROM products', function(err, results) {
    if(err) throw err;
    var table = new Table({
        head: ['ID','PRODUCT', 'DEPT', 'PRICE', 'STOCK']
        , colWidths: [5, 20, 10, 15, 10]
    });
    var resLength = results.length;
     
    for(var i=0; i< resLength; i++){
      
      table.push([results[i].id, results[i].product_name, results[i].department_name, results[i].price, results[i].stock_quantity]);
   
     }
 console.log(`

${table.toString()}

 `.blue);
 });

}  

//FUNCTION  to guide customer through purchase =======================================================
function customerOptions(){
  
    inquirer.prompt([
      {
        name: "idChoice",
        type: "input",
        message: "Which item(ID) would you like to purchase?".green
      },
      {
        name: "quantity",
        type: "input",
        message: "How many would you like?".green
      },
      {
        name: 'confirmation',
        type: 'confirm',
        message: 'Are you sure?'.green
        
      }
      
    ]).then(answers => {
      var choice = answers.idChoice;
      var num = answers.quantity;
  if(answers.confirmation){
    connection.query("SELECT * FROM products WHERE id =?", [choice], function(err, results){
      if(err) throw err;
                
      console.log(`
  You have selected to purchase ${num}  of our ${results[0].product_name}s for $${results[0].price}.00 each.`.green);
                
      if(parseInt(num)>parseInt(results[0].stock_quantity)){
                  console.log(`
  So sorry, we do not have enough ${results[0].product_name}s to comeplete your order!
                  `.red);
                  
 //   falls through to  line 116;
                  
                  
    } else {
        console.log(`
  You are in luck! We have plenty ${results[0].product_name}s in stock. Your order will be teleported to your
    current location upon the success of your payment.`.green);
                
        connection.query("UPDATE products SET stock_quantity=? WHERE id=?", [(results[0].stock_quantity-num), choice], function(err,results){
        if(err) throw err;
          connection.query("SELECT * FROM products WHERE id =?", [choice], function(err, results){
          console.log(`
            
      ...Processing

    $${parseInt(num)*parseInt(results[0].price)}.00 has been absorbed from your personal bank account into the Bamazon Treasury. 
        Thank you for your obedience. Make more purchases soon.`.rainbow);
          
          });
        });  //UPDATE query end
      }
      });// SELECT query using answers 
                
      setTimeout(reStart, 2000); // runs after UPDATE has completed 
  } else {
      console.log(`
      
            Bamazon: Magical Items and Weapons Depot

  `.rainbow);
  setTimeout(reStart, 2000);
      }   
       
    
  });
}

// FUNCTION to restart the process  ===================================================================
function reStart() {
  inquirer.prompt([
    {
      name: "restart",
      type: "confirm",
      message: "Continue shopping?"
    }
  ]).then(answers => {
    if(answers.restart){
    console.log(`
      Wow, great choice!
      `.rainbow);
      
      tabulate();
      customerOptions();
    
    } else {
      console.log(`
      
      Thank you for choosing Bamazon. Have a great day!`.rainbow);
    }
  });
}

start(); 