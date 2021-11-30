function deleteRequest(id){
    $.ajax({
        url: '/requests/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};