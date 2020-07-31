function deleteManager(id){
    $.ajax({
        url: '/manager/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
