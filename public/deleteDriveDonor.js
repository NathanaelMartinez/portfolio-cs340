function deleteDriveDonor(donor_id, drive_id){
    //console.log(drive_id);
    $.ajax({
        url: '/blood-drive-donors/' + donor_id,
        type: 'DELETE',
        success: function(result){
            //debugger;
            window.history.pushState("","",'/blood-drives?drive_id=' + drive_id +'#blood-drive-donors');
            window.location.reload();
        }
    })
};