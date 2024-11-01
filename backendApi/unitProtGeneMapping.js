function isProteinID(id) {
    // Check if the ID matches the UniProt protein ID format
    // const uniprotPattern = /^[A-NR-Z][0-9][A-Z0-9]{3}[0-9]$/;      // e.g., P12345, Q8N158
    // const uniprotIsoformPattern = /^[OPQ][0-9][A-Z0-9]{3}[0-9]-\d+$/; // For isoforms like P12345-2
    // const swissProtPattern = /^[A-Z0-9]{5}$/;                      // e.g., 1ABC5 for Swiss-Prot
    const regex = new RegExp('^(?:[OPQ][0-9][A-Z0-9]{3}[0-9]|[A-NR-Z][0-9][A-Z][A-Z0-9]{2}[0-9])$');

    return regex.test(id);
}

function checkIDType(ids) {
    // Check a list of IDs; if all are protein IDs, return 'protein', otherwise assume 'gene'
    const allAreProteins = ids.every(id => isProteinID(id));
    return allAreProteins ? 'protein' : 'gene';
}

async function getGeneIDs(proteinIds) {
    const url = 'https://rest.uniprot.org/idmapping/run';
    const batchSize = 25; // UniProt API limit for batch size
    let allGeneMappings = []; // To collect all mappings

    // Function to handle each batch request
    async function fetchBatch(batch) {
        const data = new URLSearchParams({
            from: 'UniProtKB_AC-ID',
            to: 'Gene_Name',
            ids: batch.join(',')
        });

        // Start the ID mapping job
        const response = await fetch(url, {
            method: 'POST',
            body: data
        });
        const jobInfo = await response.json();
        const jobId = jobInfo.jobId;

        // Polling for job completion
        let jobStatus, results;
        do {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
            const statusResponse = await fetch(`https://rest.uniprot.org/idmapping/status/${jobId}`);
            jobStatus = await statusResponse.json();

            // Check if `results` are already available in the job status response
            if (jobStatus.results) {
                results = jobStatus.results;
                break;
            }
        } while (jobStatus.status !== 'FINISHED');

        // If results not available directly in job status response, fetch results separately
        if (!results) {
            const resultResponse = await fetch(`https://rest.uniprot.org/idmapping/uniprotkb/results/${jobId}`);
            const resultData = await resultResponse.json();
            results = resultData.results;
        }

        // Format and add to main collection
        const geneMappings = results.map(item => ({
            proteinID: item.from,
            geneID: item.to
        }));
        allGeneMappings = allGeneMappings.concat(geneMappings);
    }

    // Loop over the `proteinIds` array in batches of 25
    for (let i = 0; i < proteinIds.length; i += batchSize) {
        const batch = proteinIds.slice(i, i + batchSize);
        await fetchBatch(batch); // Fetch each batch
    }
    return allGeneMappings;
}

// Example usage
// const proteinIds = ['P12345', 'Q8N158', 'A0A024R161', /* add more IDs here */];
// getGeneIDs(proteinIds);
