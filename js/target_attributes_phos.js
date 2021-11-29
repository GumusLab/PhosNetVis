function target_phos() {
    var radio_checked_yes = document.getElementById("target_radio_yes").checked
    var radio_checked_no = document.getElementById("target_radio_no").checked 

    if (radio_checked_yes == true) {
        sessionStorage.setItem('target_phos', true);
        document.getElementById("next_target_phos").style.display = "block";
    } 
    else if(radio_checked_no == true) {
        sessionStorage.setItem('target_phos', false);
        document.getElementById("next_target_phos").style.display = "block";
      }
}

function next_target_phos() {
    var radio_checked_yes = document.getElementById("target_radio_yes").checked
    var radio_checked_no = document.getElementById("target_radio_no").checked 

    if(radio_checked_yes == false && radio_checked_no == false){
        alert("Please select one of the options in order to continue!")
    }
    else if (radio_checked_yes == true) {
        location.href='target_attributes_phos_size.html';
    } 
    else if(radio_checked_no == true) {
        location.href='target_attributes_sc.html';
      }
}