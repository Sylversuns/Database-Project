function updateRoom(id){
    $.ajax({
        url: '/room/' + id,
        type: 'PUT',
        data: $('#update-room').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};
