function direct_initiate(){
    sessionStorage.setItem("vis_perm",false)
    sessionStorage.setItem('state_num', 1);
}


function data_upload_check(){
    
    if (sessionStorage.getItem("vis_perm") == "true"){
        sessionStorage.setItem("vis_perm",false)
        window.location.href = 'visualization.html'
        
    }
    else{
        alert("Please upload your dataset in order to continue visualizing!")
    }

}

function state_num(){

    var state_numbers = document.getElementById("state_number").value;

    sessionStorage.setItem('state_num', state_numbers);

}
