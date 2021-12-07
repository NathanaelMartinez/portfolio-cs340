function updateRequest(id){
    $.ajax({
        url: '/requests/' + id,
        type: 'PUT',
        data: $('#update-request').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};
