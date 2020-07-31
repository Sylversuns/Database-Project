module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getLocations(res, mysql, context, complete){
        mysql.pool.query("SELECT location_id AS id, name,city FROM location", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.locations = results;
            complete();
        });
    }

    function getLocation(res, mysql, context, id, complete){
        var sql = "SELECT location_id AS id, name,city FROM location WHERE location_id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.locations = results[0];
            complete();
        });
    }

    /*Display all locations. Requires web based javascript to delete locations with AJAX*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteLocation.js"];
        var mysql = req.app.get('mysql');
	getLocations(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('location', context);
            }
        }
    });

    /* Display one location for the specific purpose of updating it */

    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updateLocation.js"];
        var mysql = req.app.get('mysql');
        getLocation(res, mysql, context, req.params.id, complete);
	function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('update-location', context);
            }

        }
    });

    /* Adds a location, redirects to the same page after adding */

    router.post('/', function(req, res){
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO location (name,city) VALUES (?,?)";
        var inserts = [req.body.name, req.body.city];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/location');
            }
        });
    });

    /* The URI that update data is sent to in order to update a program */

    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        console.log(req.body)
        console.log(req.params.id)
        var sql = "UPDATE location SET name=?, city=? WHERE location_id=?";
        var inserts = [req.body.name, req.body.city, req.params.id];
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

    /* Route to delete a location, simply returns a 202 upon success. Ajax will handle this. */

    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM location WHERE location_id = ?";
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
