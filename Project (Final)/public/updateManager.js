function updateManager(id){
    $.ajax({
        url: '/manager/' + id,
        type: 'PUT',
        data: $('#update-manager').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};
