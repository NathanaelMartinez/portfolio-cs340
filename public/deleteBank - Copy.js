function updatePerson(id){
    $.ajax({
        url: '/donors/' + id,
        type: 'PUT',
        data: $('#update-donor').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};