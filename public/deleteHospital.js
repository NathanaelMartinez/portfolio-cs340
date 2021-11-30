function deleteHospital(id){
    $.ajax({
        url: '/hospitals/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};