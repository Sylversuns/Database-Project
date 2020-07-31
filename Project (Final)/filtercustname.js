module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getCustomers(res, mysql, context, complete){
        mysql.pool.query("SELECT customer_id AS id, firstname,lastname, ccnumber, roomnumber FROM customer", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.customers = results;
            complete();
        });
    }

    function getCustomer(res, mysql, context, lastname, complete){
        var sql = "SELECT customer_id AS id, firstname,lastname,ccnumber,roomnumber FROM customer WHERE lastname = ?";
        var inserts = [lastname];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.customer = results;
            complete();
        });
    }

    /*Search box*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
	console.log(req.query.lastname);
	console.log("Blahblah");
        var mysql = req.app.get('mysql');
	if (req.query.lastname != undefined)
	{
		getCustomer(res, mysql, context, req.query.lastname, complete);
        	function complete(){
                callbackCount++
                if(callbackCount >= 1){
                        res.render('showresults', context);
                }
        }
	}
	else
	{
        	getCustomers(res, mysql, context, complete);
        	function complete(){
            	callbackCount++;
            	if(callbackCount >= 1){
                	res.render('filtercustname', context);
            	}
        }
	}
    });

    return router;
}();
