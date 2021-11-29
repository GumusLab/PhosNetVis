/* function that checks source attributes and saves it into seesion storage*/
function source_attribute() {
    var checkbox_source_color = document.getElementById("source_color").checked
    var checkbox_source_size = document.getElementById("source_size").checked 

    if (checkbox_source_color == true) {
        sessionStorage.setItem('source_color', true);
        document.getElementById("next_source").style.display = "block";
        document.getElementById("source_skip").checked = false;
    } 
    else {
        sessionStorage.setItem('source_color', false);
    }
    if(checkbox_source_size == true) {
        sessionStorage.setItem('source_size', true);
        document.getElementById("next_source").style.display = "block";
        document.getElementById("source_skip").checked = false;
    }
    else{
        sessionStorage.setItem('source_size', false);
    }   
    
    if(checkbox_source_color == false && checkbox_source_size == false){
        document.getElementById("next_source").style.display = "none";
    }
}

function source_no_attribute() {
    var checkbox_skip = document.getElementById("source_skip").checked

    if(checkbox_skip==true){
    sessionStorage.setItem('source_color', false);
    sessionStorage.setItem('source_size', false);
    document.getElementById("source_color").checked = false;
    document.getElementById("source_size").checked = false;
    document.getElementById("next_source").style.display = "block";
    }
    else{
        document.getElementById("next_source").style.display = "none";
    }


}

function next_source_attribute() {    
    location.href='target_attributes_phos-tutorial.html';
}