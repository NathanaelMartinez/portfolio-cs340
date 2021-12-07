function updateBank(donor_id){
    $.ajax({
        url: '/blood-banks/' + donor_id,
        type: 'PUT',
        data: $('#update-blood-bank').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};