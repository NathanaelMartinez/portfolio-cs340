function deleteDriveDonor(id){
    $.ajax({
        url: '/blood-drive-donors/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.replace(/blood-drives/);
        }
    })
};