function updateHospital(donor_id){
    $.ajax({
        url: '/hospitals/' + donor_id,
        type: 'PUT',
        data: $('#update-hospital').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};