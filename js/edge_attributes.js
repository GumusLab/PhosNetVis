/* function that checks source attributes and saves it into seesion storage*/
function edge_attribute() {
    var checkbox_edge_color = document.getElementById("edge_color").checked
    var checkbox_edge_weight = document.getElementById("edge_weight").checked 

    if (checkbox_edge_color == true) {
        sessionStorage.setItem('edge_color', true);
        document.getElementById("next_edge").style.display = "block";
        document.getElementById("edge_skip").checked = false;
    } 
    else {
        sessionStorage.setItem('edge_weight', false);
    }
    if(checkbox_edge_weight == true) {
        sessionStorage.setItem('edge_weight', true);
        document.getElementById("next_edge").style.display = "block";
        document.getElementById("edge_skip").checked = false;
    }
    else{
        sessionStorage.setItem('edge_weight', false);
    }   
    
    if(checkbox_edge_color == false && checkbox_edge_weight == false){
        document.getElementById("next_edge").style.display = "none";
    }
}

function edge_no_attribute() {
    var checkbox_skip = document.getElementById("edge_skip").checked

    if(checkbox_skip==true){
    sessionStorage.setItem('edge_color', false);
    sessionStorage.setItem('edge_weight', false);
    document.getElementById("edge_color").checked = false;
    document.getElementById("edge_weight").checked = false;
    document.getElementById("next_edge").style.display = "block";
    }
    else{
        document.getElementById("next_edge").style.display = "none";
    }


}

function next_edge_attribute() {    
    if (document.getElementById("edge_color").checked == false && document.getElementById("edge_weight").checked == false && document.getElementById("edge_skip").checked == false){
        alert("Please select from options in order to continue!")
    }
    else{
    location.href='states.html';}
}