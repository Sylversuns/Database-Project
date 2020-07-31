module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getCustomers(res, mysql, context, complete){
        mysql.pool.query("SELECT customer_id, CONCAT(firstname,' ',lastname) AS customername FROM customer ORDER BY customername", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.customers = results;
            complete();
        });
    }

    function getRewards(res, mysql, context, complete){
        mysql.pool.query("SELECT rewards_id, name FROM rewards ORDER BY rewards_id", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.rewards = results;
            complete();
        });
    }

    function getCustomerRewardsPrograms(res, mysql, context, complete){
        mysql.pool.query("SELECT customer.customer_id AS cid, rewards.rewards_id AS rid, CONCAT(firstname,' ',lastname) AS fullname, name FROM customer INNER JOIN customer_rewards ON customer.customer_id = customer_rewards.customer_id INNER JOIN rewards ON customer_rewards.rewards_id = rewards.rewards_id ORDER BY fullname, name", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.customerrewards = results;
            complete();
        });
    }

    function getCustomerRewards(res, mysql, context, cid, rid, complete){
        var sql = "SELECT customer.customer_id AS cid, rewards.rewards_id AS rid, CONCAT(firstname,' ',lastname) AS fullname, name FROM customer INNER JOIN customer_rewards ON customer.customer_id = customer_rewards.customer_id INNER JOIN rewards ON customer_rewards.rewards_id = rewards.rewards_id WHERE customer.customer_id = ? AND rewards.rewards_id = ?";
	var inserts = [cid, rid];
	sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.customerrewards = results[0];
            complete();
        });
    }

    /*Display all relationships. Requires web based javascript to delete with AJAX*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteCustomerRewards.js"];
        var mysql = req.app.get('mysql');
	getCustomers(res, mysql, context, complete);
	getRewards(res, mysql, context, complete);
	getCustomerRewardsPrograms(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('customerrewards', context);
            }
        }
    });

    /* Display one relationship for the specific purpose of updating it */

    router.get('/cid/:cid/rid/:rid', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["selectedcustomer.js", "selectedrewards.js", "updateCustomerRewards.js"];
        var mysql = req.app.get('mysql');
        getCustomers(res, mysql, context, complete);
        getRewards(res, mysql, context, complete);
        getCustomerRewards(res, mysql, context, req.params.cid, req.params.rid, complete);
	function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('update-customerrewards', context);
            }
        }
    });

    /* Adds a relationship, redirects to the customer rewards page after adding */

    router.post('/', function(req, res){
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO customer_rewards (customer_id,rewards_id) VALUES (?,?)";
        var inserts = [req.body.customer_id, req.body.rewards_id];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/customerrewards');
            }
        });
    });

    /* The URI that update data is sent to in order to update a relationship */

    router.put('/cid/:cid/rid/:rid', function(req, res){
        var mysql = req.app.get('mysql');
        console.log(req.params.cid)
        console.log(req.params.rid)
	console.log(req.body.customer_id)
	console.log(req.body.rewards_id)
        var sql = "UPDATE customer_rewards SET customer_id=?, rewards_id=? WHERE customer_id=? AND rewards_id=?";
        var inserts = [req.body.customer_id, req.body.rewards_id, req.params.cid, req.params.rid];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.status(200);
                res.end();
            }
        });
    });

    /* Route to delete a relationship, simply returns a 202 upon success. Ajax will handle this. */

    router.delete('/cid/:cid/rid/:rid', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM customer_rewards WHERE customer_id = ? AND rewards_id = ?";
        var inserts = [req.params.cid, req.params.rid];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.status(202).end();
            }
        })
    })

    return router;
}();
