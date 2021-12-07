function updateDonation(id){
    $.ajax({
        url: '/donations/' + id,
        type: 'PUT',
        data: $('#update-donation').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};