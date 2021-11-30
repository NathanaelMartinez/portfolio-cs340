function deleteBank(id){
    $.ajax({
        url: '/blood-banks/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};