module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getRooms(res, mysql, context, complete){
	mysql.pool.query("SELECT room_id AS id FROM room ORDER BY room_id", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.rooms = results;
            complete();
        });
    }

    function getCustomers(res, mysql, context, complete){
        mysql.pool.query("SELECT customer_id AS id, firstname,lastname,ccnumber,roomnumber FROM customer", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.customers = results;
            complete();
        });
    }

    function getCustomer(res, mysql, context, id, complete){
        var sql = "SELECT customer_id AS id, firstname,lastname,ccnumber,roomnumber FROM customer WHERE customer_id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.customers = results[0];
            complete();
        });
    }

    /*Display all people. Requires web based javascript to delete users with AJAX*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteCustomer.js"];
        var mysql = req.app.get('mysql');
	getCustomers(res, mysql, context, complete);
	getRooms(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('customer', context);
            }
        }
    });

    /* Display one person for the specific purpose of updating people */

    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["selectedroom.js", "updateCustomer.js"];
        var mysql = req.app.get('mysql');
        getCustomer(res, mysql, context, req.params.id, complete);
        getRooms(res, mysql, context, complete);
	function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('update-customer', context);
            }

        }
    });

    /* Adds a person, redirects to the people page after adding */

    router.post('/', function(req, res){
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO customer (firstname,lastname,ccnumber,roomnumber) VALUES (?,?,?,?)";
        var inserts = [req.body.firstname, req.body.lastname, req.body.ccnumber, req.body.roomnumber];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/customer');
            }
        });
    });

    /* The URI that update data is sent to in order to update a person */

    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        console.log(req.body)
        console.log(req.params.id)
        var sql = "UPDATE customer SET firstname=?, lastname=?,ccnumber=?,roomnumber=? WHERE customer_id=?";
        var inserts = [req.body.firstname, req.body.lastname, req.body.ccnumber, req.body.roomnumber, req.params.id];
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

    /* Route to delete a person, simply returns a 202 upon success. Ajax will handle this. */

    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM customer WHERE customer_id = ?";
        var inserts = [req.params.id];
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
