module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getRewardsPrograms(res, mysql, context, complete){
        mysql.pool.query("SELECT rewards_id AS id, name,discount FROM rewards", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.rewards = results;
            complete();
        });
    }

    function getRewards(res, mysql, context, id, complete){
        var sql = "SELECT rewards_id AS id, name,discount FROM rewards WHERE rewards_id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.rewards = results[0];
            complete();
        });
    }

    /*Display all rewards programs. Requires web based javascript to delete programs with AJAX*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteRewards.js"];
        var mysql = req.app.get('mysql');
	getRewardsPrograms(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('rewards', context);
            }
        }
    });

    /* Display one rewards program for the specific purpose of updating it */

    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updateRewards.js"];
        var mysql = req.app.get('mysql');
        getRewards(res, mysql, context, req.params.id, complete);
	function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('update-rewards', context);
            }

        }
    });

    /* Adds a rewards program, redirects to the same page after adding */

    router.post('/', function(req, res){
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO rewards (name,discount) VALUES (?,?)";
        var inserts = [req.body.name, req.body.discount];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/rewards');
            }
        });
    });

    /* The URI that update data is sent to in order to update a program */

    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        console.log(req.body)
        console.log(req.params.id)
        var sql = "UPDATE rewards SET name=?, discount=? WHERE rewards_id=?";
        var inserts = [req.body.name, req.body.discount, req.params.id];
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

    /* Route to delete a rewards program, simply returns a 202 upon success. Ajax will handle this. */

    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM rewards WHERE rewards_id = ?";
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
