function deleteCustomerRewards(cid, rid){
    $.ajax({
        url: '/customerrewards/cid/' + cid + '/rid/' + rid,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
