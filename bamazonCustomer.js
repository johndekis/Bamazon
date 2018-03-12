var mysql = require('mysql');
var inquirer = require('inquirer');
var colors = require('colors');
var Table = require('cli-table-redemption');




var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "root",
    database: "bamazon"
  });
  
connection.connect(function(err) {
    if (err) throw err;
    connection.query('SELECT * FROM products', function(err, results) {
        if(err) throw err;
       
//         var table = `
// ID: |   Product:        |    Department:     | Price:        |   Quantity: 
// ----------------------------------------------------------------------------`;
//         var length = results.length
//         console.log(table);
//         for(var i=0; i<length; i++){
//         var id = results[i].id,
//         product = results[i].product_name,
//         department = results[i].department_name,
//         price = results[i].price,
//         quantity = results[i].stock_quantity;
//             console.log(
// `${id}  |  ${product}        |   ${department}    | $${price}          |   ${quantity} 
// -----------------------------------------------------------------------------`);
           
  
//         }
   

     });
    //callback for customer function
  });