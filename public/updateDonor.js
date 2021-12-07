function updateDonor(donor_id){
    $.ajax({
        url: '/donors/' + donor_id,
        type: 'PUT',
        data: $('#update-donor').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};