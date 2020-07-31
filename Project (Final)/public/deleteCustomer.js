function deleteCustomer(id){
    $.ajax({
        url: '/customer/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};

function deleteCustomerRewards(cid, rid){
  $.ajax({
      url: '/customer_rewards/cid/' + cid + '/rewards/' + rid,
      type: 'DELETE',
      success: function(result){
          if(result.responseText != undefined){
            alert(result.responseText)
          }
          else {
            window.location.reload(true)
          } 
      }
  })
};
