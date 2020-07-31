function updateCustomerRewards(cid, rid){
    $.ajax({
        url: '/customerrewards/cid/' + cid + '/rid/' + rid,
        type: 'PUT',
        data: $('#update-customerrewards').serialize(),
        success: function(result){
            window.location.replace("../../../");
        }
    })
};
