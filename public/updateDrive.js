function updateDrive(id){
    $.ajax({
        url: '/blood-drives/' + id,
        type: 'PUT',
        data: $('#update-blood-drive').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};
