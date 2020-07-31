function deleteRoom(id){
    $.ajax({
        url: '/room/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
