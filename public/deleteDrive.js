function deleteDrive(id){
    $.ajax({
        url: '/blood-drives/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};