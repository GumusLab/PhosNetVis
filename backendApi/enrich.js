function enrich(options) {
    if (typeof options.list === 'undefined') {
        alert('No genes defined.');
        return;
    }

    // const exampleList = ['PHF14', 'RBM3', 'MSL1', 'PHF21A', 'ARL10', 'INSR', 'JADE2', 'P2RX7',
    // 'LINC00662', 'CCDC101', 'PPM1B', 'KANSL1L', 'CRYZL1', 'ANAPC16', 'TMCC1',
    // 'CDH8', 'RBM11', 'CNPY2', 'HSPA1L', 'CUL2', 'PLBD2', 'LARP7', 'TECPR2', 
    // 'ZNF302', 'CUX1', 'MOB2', 'CYTH2', 'SEC22C', 'EIF4E3', 'ROBO2',
    // 'ADAMTS9-AS2', 'CXXC1', 'LINC01314', 'ATF7', 'ATP5F1']
    // const eg = exampleList.join('\n');

    const description = options.description || '';
    const popup = options.popup || false;
    const form = document.createElement('form');
    const listField = document.createElement('input');
    const descField = document.createElement('input');

    form.setAttribute('method', 'post');
    form.setAttribute('action', 'https://maayanlab.cloud/Enrichr/enrich');
    if (popup) {
        form.setAttribute('target', '_blank');
    }
    form.setAttribute('enctype', 'multipart/form-data');

    listField.setAttribute('type', 'hidden');
    listField.setAttribute('name', 'list');
    listField.setAttribute('value', options.list);

    form.appendChild(listField);

    descField.setAttribute('type', 'hidden');
    descField.setAttribute('name', 'description');
    descField.setAttribute('value', description);

    form.appendChild(descField);

    // Submit the form directly
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
}
