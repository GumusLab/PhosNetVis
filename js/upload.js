function datatype(){
    sessionStorage.setItem("vis_perm",false)
    var i1 = sessionStorage.getItem("source_color")
    var i2 = sessionStorage.getItem("source_size")
    var i3 = sessionStorage.getItem("target_phos")
    var i4 = sessionStorage.getItem("phos_color")
    var i5 = sessionStorage.getItem("phos_size")
    var i6 = sessionStorage.getItem("target_color")
    var i7 = sessionStorage.getItem("target_size")
    var i8 = sessionStorage.getItem("edge_color")
    var i9 = sessionStorage.getItem("edge_weight")

    if(i3=="true"){
        document.getElementById("pt_table").style.display = "table";
        if(i1!="true"){
            Array.from(document.getElementsByClassName("p2")).forEach(
                function(element, index, array) {
                    element.style.display = "none"
                }
            );
        }
        if(i2 != "true"){
            Array.from(document.getElementsByClassName("p3")).forEach(
                function(element, index, array) {
                    element.style.display = "none"
                }
            );
        }
        if(i4!="true"){
            Array.from(document.getElementsByClassName("p6")).forEach(
                function(element, index, array) {
                    element.style.display = "none"
                }
            );
        }
        if(i5!="true"){
            Array.from(document.getElementsByClassName("p7")).forEach(
                function(element, index, array) {
                    element.style.display = "none"
                }
            );
        }
        if(i8!="true"){
            Array.from(document.getElementsByClassName("p8")).forEach(
                function(element, index, array) {
                    element.style.display = "none"
                }
            );
        }
        if(i9!="true"){
            Array.from(document.getElementsByClassName("p9")).forEach(
                function(element, index, array) {
                    element.style.display = "none"
                }
            );
        }



    }
    else{
        document.getElementById("npt_table").style.display = "table";
        if(i1!="true"){
            Array.from(document.getElementsByClassName("np2")).forEach(
                function(element, index, array) {
                    element.style.display = "none"
                }
            );
        }
        if(i2!="true"){
            Array.from(document.getElementsByClassName("np3")).forEach(
                function(element, index, array) {
                    element.style.display = "none"
                }
            );
        }
        if(i6!="true"){
            Array.from(document.getElementsByClassName("np5")).forEach(
                function(element, index, array) {
                    element.style.display = "none"
                }
            );
        }
        if(i7!="true"){
            Array.from(document.getElementsByClassName("np6")).forEach(
                function(element, index, array) {
                    element.style.display = "none"
                }
            );
        }
        if(i8!="true"){
            Array.from(document.getElementsByClassName("np7")).forEach(
                function(element, index, array) {
                    element.style.display = "none"
                }
            );
        }
        if(i9!="true"){
            Array.from(document.getElementsByClassName("np8")).forEach(
                function(element, index, array) {
                    element.style.display = "none"
                }
            );
        }

    }

}
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