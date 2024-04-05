// Convert JSON data to CSV format
function convertToCSV(jsonData) {
    const header = Object.keys(jsonData[0]);
    const csv = jsonData.map(row => header.map(fieldName => JSON.stringify(row[fieldName])).join(','));
    csv.unshift(header.join(','));
    return csv.join('\n');
}


function runKEA() {

    // document.getElementById('spinner-container').style.display = 'block';
    $('#loader-class').css('display', 'flex');

    // const fileInput = document.getElementById('hidden-file-upload');
    
    const fileInput = document.getElementById('hidden-file-upload');

    const file = fileInput.files[0]; // Get the selected file

    if (file) {
        // Define the URL of your Plumber API endpoint
        const apiUrl = 'https://rstudio-connect.hpc.mssm.edu/content/bb0ba84e-68fd-4fd4-a48d-ece2e0089c48/runEnrichment'
      
        // Read the contents of the file
        const reader = new FileReader();
        reader.onload = function(event) {
            const fileContent = event.target.result;
            
            // Parse CSV data using PapaParse
            Papa.parse(fileContent, {
                header: true,
                complete: function(results) {
                    const jsonData = JSON.stringify(results.data); // CSV data parsed as JSON array of objects

                    var inputpValue = parseFloat($('#input_pvalue').val());
                    var outputpValue = parseFloat($('#output_pvalue').val());
                    var minsize = parseFloat($('#minSize').val());
                    var maxsize = parseFloat($('#maxSize').val());
                    var eps = parseFloat($('#eps').val());
                    var selectedValue = $("input[name='nameaccession']:checked").val();


                    const inputData = {
                        input_pvalue: inputpValue,
                        minSize: minsize,
                        maxSize: maxsize,
                        eps: eps,
                        output_pvalue: outputpValue,
                        nameaccession: selectedValue
                    };

                    console.log('&&&&&&&& input data is #########',inputData)
                    
                    // Send a POST request to the API endpoint
                    fetch(apiUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            file: jsonData,
                            input_data: inputData
                        })                    
                    })
                    .then(response => {
                        if (response.ok) {
                            // If the response is successful, parse the JSON data
                            return response.json();
                        } else {
                            // If there's an error, throw an error
                            throw new Error('Failed to fetch data from the API.');
                        }
                    })
                    .then(data => {
                        // Process the data returned from the API
                        console.log(data);
                        const csvData = convertToCSV(data);
                        // Store the CSV data in session storage
                        sessionStorage.setItem('csvData', csvData);

                        // You can perform further actions here, such as updating the UI
                        // When everything is complete, show the modal
                        // var myModalElement = document.getElementById('exampleModalCenter');
                        // var myModal = bootstrap.Modal.getInstance(myModalElement) || new bootstrap.Modal(myModalElement);
                        // myModal.show();
                        
                            // Show the modal after your function completes
                        $('#loader-class').css('display', 'none');

                        $('#exampleModal').modal('show');
                        document.getElementById('donloadButton').style.display = 'block';
                        document.getElementById('visualizeButton').style.display = 'block';
                    })
                    .catch(error => {
                        // Handle any errors that occurred during the fetch
                        console.error(error);
                    });
                }
            });
        };
        
        // Read the file as text
        reader.readAsText(file);
    } else {
        console.log('********** file input is as follows **************** ',fileInput)

        console.error('No file selected.');
    }
    // Hide the spinner
    // document.getElementById('spinner-container').style.display = 'none';


    // var myModalElement = document.getElementById('exampleModalCenter');
    // myModalElement.showModal();


}
