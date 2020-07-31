module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getManagers(res, mysql, context, complete){
        mysql.pool.query("SELECT manager_id AS id, firstname,lastname FROM manager", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.managers = results;
            complete();
        });
    }

    function getManager(res, mysql, context, id, complete){
        var sql = "SELECT manager_id AS id, firstname,lastname FROM manager WHERE manager_id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.managers = results[0];
            complete();
        });
    }

    /*Display all people. Requires web based javascript to delete users with AJAX*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteManager.js"];
        var mysql = req.app.get('mysql');
	getManagers(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('manager', context);
            }
        }
    });

    /* Display one person for the specific purpose of updating people */

    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updateManager.js"];
        var mysql = req.app.get('mysql');
        getManager(res, mysql, context, req.params.id, complete);
	function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('update-manager', context);
            }

        }
    });

    /* Adds a person, redirects to the people page after adding */

    router.post('/', function(req, res){
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO manager (firstname,lastname) VALUES (?,?)";
        var inserts = [req.body.firstname, req.body.lastname];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/manager');
            }
        });
    });

    /* The URI that update data is sent to in order to update a person */

    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        console.log(req.body)
        console.log(req.params.id)
        var sql = "UPDATE manager SET firstname=?, lastname=? WHERE manager_id=?";
        var inserts = [req.body.firstname, req.body.lastname, req.params.id];
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
        var sql = "DELETE FROM manager WHERE manager_id = ?";
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
