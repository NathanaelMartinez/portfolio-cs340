function deleteDonor(id){
    $.ajax({
        url: '/donors/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};