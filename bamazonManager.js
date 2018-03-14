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

//FUNCTIONS=======================================================
//FUNCTION menu options
  //products for sale ===> tabulate fuction XXX
  //low iventory (<5). XXX
  //add to inventory your app should display a prompt that will let the manager "add more" of any item currently in the store.
  //add new product
  function start(){
    
    connection.connect(function(err) {
       if (err) throw err;
       console.log(`
   =================================================================================================== 
                      Welcome to BAMAZON Management Portal
   ===================================================================================================     
       `.red);
     
      mgmtOptions();
    
    
    });
  }
  
//FUNCTION  to guide manager through processes =======================================================  
function mgmtOptions(){
    inquirer.prompt([
        {
            name: "tasks",
            type: "list",
            message: "Greetings Mr. Manager, please choose a task",
            choices: ["View Products For Sale","View Low Inventory Items","Add to Inventory","Add New Product"]
        }
    ]).then(answer => {
        console.log(answer.tasks)
        switch(answer.tasks) {
            case "View Products For Sale":
                tabulate();
                break;
            case "View Low Inventory Items":
                viewLowStock();//code block
                break;
            case "Add to Inventory":
                reStock();
                break;
            case "Add New Product":
                addProduct();
                break;
            
        }
    })
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
    `);
   });
} 

function viewLowStock(){
    connection.query('SELECT * FROM products WHERE stock_quantity < 5', function(err, results){
        if(err) throw err;
        var lowTable = new Table({
            head: ['ID','PRODUCT', 'DEPT', 'PRICE', 'STOCK']
            , colWidths: [5, 20, 10, 15, 10]
        });
        var resLength = results.length;
         
        for(var i=0; i< resLength; i++){
          
          lowTable.push([results[i].id, results[i].product_name, results[i].department_name, results[i].price, results[i].stock_quantity]);
       
         }
     console.log(`
    
     ${lowTable.toString()}
    
     `);
    });
}

function reStock(){
    var productArray = [];
    //pusher(productArray);
    connection.query('SELECT * FROM products', function(err, results){
        for(var i = 0; i<results.length; i++){
            //var productArray = [];
            productArray.push(results[i].product_name);
            //console.log(productArray);
           
        }
    //console.log(productArray);
    inquirer.prompt([
        {
            name: "product",
            type: "list",
            choices: productArray,                    
            message: "Which item would you like to restock?"
        },
        {
            name:"amount",
            type:"list",
            choices: ['10','100','500','1000'],
            message: "What quantity of product shall we amass through thievery and murder?"
        }
    ]).then(answers => {
        connection.query("SELECT * from products WHERE product_name=?",[answers.product],function(err,results){
            var current = parseInt(results[0].stock_quantity);

            var updated = current + parseInt(answers.amount);
            console.log(updated);
            connection.query('UPDATE products SET stock_quantity=? WHERE product_name=?', [updated, answers.product]);
            console.log(`
        Drones pillaging, please wait...

        Treasury Restocked! Our ${answers.product} supply has grown to by ${answers.amount}! Glory to Bamazon.
        `.rainbow);    
        });
        
        //console.log(answers); //answers.product
        
        });
    });
}

function addProduct(){
    inquirer.prompt([
        {
    name: "newThing",
    type: "input",
    message: "What is the name of the new product?"
        },
        {
    name: "dept",
    type: "list",
    message: "Which department?",
    choices: ["Magical", "Weapons"]
        },
        {
    name: "price",
    type: "input",
    message: "The unit price?"
        },
        {
    name: "amount",
    type: "input",
    message: "The initial stock quantity?"
        }
    ]).then(answers => {
        
        connection.query('INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?);', [answers.newThing, answers.dept, answers.price, answers.amount]);
        console.log(`${answers.newThing} added to the ${answers.dept} Department! `.rainbow);
    });
}

start();