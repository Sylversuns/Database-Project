function updateRewards(id){
    $.ajax({
        url: '/rewards/' + id,
        type: 'PUT',
        data: $('#update-rewards').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};
