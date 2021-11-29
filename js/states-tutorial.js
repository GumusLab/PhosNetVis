function states() {
    var radio_checked_yes = document.getElementById("states_yes").checked
    var radio_checked_no = document.getElementById("states_no").checked 
    var state_numbers = document.getElementById("state_number").value;
    if (radio_checked_yes == true) {
        sessionStorage.setItem('states', true);
        sessionStorage.setItem('state_num', state_numbers);
        document.getElementById("text1").style.display = "block";
        document.getElementById("text2").style.display = "block";
        document.getElementById("state_number").style.display = "block";
        document.getElementById("next_state").style.display = "block";

    } 
    else if(radio_checked_no == true) {
        sessionStorage.setItem('states', false);
        document.getElementById("text1").style.display = "none";
        document.getElementById("text2").style.display = "none";
        document.getElementById("state_number").style.display = "none";
        document.getElementById("next_state").style.display = "block";
      }
    
}

function state_num(){

    var state_numbers = document.getElementById("state_number").value;

    sessionStorage.setItem('state_num', state_numbers);

}
function next_states() {
    location.href='upload-tutorial.html';
}