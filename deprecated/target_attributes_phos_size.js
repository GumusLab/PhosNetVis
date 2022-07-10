/* function that checks target attributes and saves it into session storage */
function target_phos_size() {
    var checkbox_target_phos_color = document.getElementById("phos_color").checked
    var checkbox_target_phos_size = document.getElementById("phos_size").checked 

    if (checkbox_target_phos_color == true) {
        sessionStorage.setItem('phos_color', true);
        document.getElementById("next_phos_size").style.display = "block";
        document.getElementById("phos_size_skip").checked = false;
    } 
    else {
        sessionStorage.setItem('phos_color', false);
    }
    if (checkbox_target_phos_size == true) {
        sessionStorage.setItem('phos_size', true);
        document.getElementById("next_phos_size").style.display = "block";
        document.getElementById("phos_size_skip").checked = false;
    } 
    else {
        sessionStorage.setItem('phos_size', false);
    }

    if(checkbox_target_phos_color == false && checkbox_target_phos_size == false){
        document.getElementById("next_phos_size").style.display = "none";
    }
}

function target_phos_no_size() {
    var checkbox_skip = document.getElementById("phos_size_skip").checked

    if(checkbox_skip==true){
    sessionStorage.setItem('phos_size', false);
    sessionStorage.setItem('phos_color', false);
    document.getElementById("phos_size").checked = false;
    document.getElementById("phos_color").checked = false;
    document.getElementById("next_phos_size").style.display = "block";
    }
    else{
        document.getElementById("next_phos_size").style.display = "none";
    }


}

function next_target_phos_size() {
    if(document.getElementById("phos_color").checked == false && document.getElementById("phos_size").checked  == false && document.getElementById("phos_size_skip").checked == false){
        alert("Please select from options in order to continue!")
    }
    else{
    location.href='edge_attributes.html';}
}