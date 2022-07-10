/* function that checks target attributes and saves it into seesion storage*/
function target_attributes_sc() {
    var checkbox_target_color = document.getElementById("target_color").checked
    var checkbox_target_size = document.getElementById("target_size").checked 

    if (checkbox_target_color == true) {
        sessionStorage.setItem('target_color', true);
        document.getElementById("next_target_sc").style.display = "block";
        document.getElementById("target_attr_skip").checked = false;
    } 
    else {
        sessionStorage.setItem('target_color', false);
    }
    if(checkbox_target_size == true) {
        sessionStorage.setItem('target_size', true);
        document.getElementById("next_target_sc").style.display = "block";
        document.getElementById("target_attr_skip").checked = false;
    }
    else{
        sessionStorage.setItem('target_size', false);
    }   
    
    if(checkbox_target_color == false && checkbox_target_size == false){
        document.getElementById("next_target_sc").style.display = "none";
    }
}

function source_no_attribute() {
    var checkbox_skip = document.getElementById("target_attr_skip").checked

    if(checkbox_skip==true){
    sessionStorage.setItem('target_color', false);
    sessionStorage.setItem('target_size', false);
    document.getElementById("target_color").checked = false;
    document.getElementById("target_size").checked = false;
    document.getElementById("next_target_sc").style.display = "block";
    }
    else{
        document.getElementById("next_target_sc").style.display = "none";
    }

}

function next_source_attribute() {    
    if(document.getElementById("target_color").checked == false && document.getElementById("target_size").checked == false && document.getElementById("target_attr_skip").checked == false){
        alert("Please select from options in order to continue!")
    }
    else{
    location.href='edge_attributes.html';}
}