function session_validate() {

    var validation_variable = sessionStorage.getItem("valid_session")

    if(validation_variable != 'true'){
    window.location.replace("index.html");
    }
}