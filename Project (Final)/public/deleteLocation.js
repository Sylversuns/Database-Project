function deleteLocation(id){
    $.ajax({
        url: '/location/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
