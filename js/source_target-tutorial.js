function directed_graph() {
    var radio_checked_yes = document.getElementById("directed_yes").checked
    var radio_checked_no = document.getElementById("directed_no").checked 

    if (radio_checked_yes == true) {
        sessionStorage.setItem('directed', true);
        document.getElementById("next_button_directed").style.display = "block";
        //document.getElementById("next_button_directed").disabled = false;
    } 
    else if(radio_checked_no == true) {
        sessionStorage.setItem('directed', false);
        document.getElementById("next_button_directed").style.display = "block";
        //document.getElementById("next_button_directed").disabled = false;
      }
    
}

function next_directed() {
    location.href='source_attributes-tutorial.html';
}