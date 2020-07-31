module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getLocations(res, mysql, context, complete){
	mysql.pool.query("SELECT location_id, name FROM location ORDER BY name", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.locations = results;
            complete();
        });
    }

    function getManagers(res, mysql, context, complete){
	mysql.pool.query("SELECT manager_id, CONCAT(firstname,' ',lastname) AS managername FROM manager ORDER BY manager_id", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.managers = results;
            complete();
        });
    }

    function getRooms(res, mysql, context, complete){
        mysql.pool.query("SELECT room_id AS id, style, floor, name as locationname, CONCAT(firstname,' ', lastname) as managername, location.location_id, manager.manager_id FROM room INNER JOIN location ON room.roomlocation = location.location_id INNER JOIN manager ON room.roommanager = manager.manager_id ORDER BY room_id", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.rooms = results;
            complete();
        });
    }

    function getRoom(res, mysql, context, id, complete){
        var sql = "SELECT room_id, style,floor,name as locationname, CONCAT(firstname,' ', lastname) as managername, location.location_id, manager_id FROM room INNER JOIN location ON room.roomlocation = location.location_id INNER JOIN manager ON room.roommanager = manager.manager_id WHERE room_id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.rooms = results[0];
            complete();
        });
    }

    /*Display all rooms. Requires web based javascript to delete with AJAX*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteRoom.js"];
        var mysql = req.app.get('mysql');
	getLocations(res, mysql, context, complete);
	getRooms(res, mysql, context, complete);
	getManagers(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('room', context);
            }
        }
    });

    /* Display one room for the specific purpose of updating it */

    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["selectedlocation.js", "updateRoom.js"];
        var mysql = req.app.get('mysql');
        getLocations(res, mysql, context, complete);
        getRoom(res, mysql, context, req.params.id, complete);
	getManagers(res, mysql, context, complete);
	function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('update-room', context);
            }

        }
    });

    /* Adds a room, redirects to the room page after adding */

    router.post('/', function(req, res){
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO room (style,floor,roomlocation,roommanager) VALUES (?,?,?,?)";
        var inserts = [req.body.style, req.body.floor, req.body.roomlocation, req.body.roommanager];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/room');
            }
        });
    });

    /* The URI that update data is sent to in order to update a room */

    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        console.log(req.body)
        console.log(req.params.id)
        var sql = "UPDATE room SET style=?, floor=?,roomlocation=?,roommanager=? WHERE room_id=?";
        var inserts = [req.body.style, req.body.floor, req.body.location_id, req.body.manager_id, req.params.id];
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

    /* Route to delete a room, simply returns a 202 upon success. Ajax will handle this. */

    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM room WHERE room_id = ?";
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
