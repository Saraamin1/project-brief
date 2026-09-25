document.addEventListener('DOMContentLoaded', () => {

    // 1. SELECTABLE OVERALL STATUS BOXES
    const statusBoxes = document.querySelectorAll('.selectable-box');
    statusBoxes.forEach(box => {
        box.addEventListener('click', () => {
            const radio = box.querySelector('input[type="radio"]');
            if (radio) radio.checked = true;
        });
    });

    // 2. FORM RESET FUNCTIONALITY
    const resetBtn = document.getElementById('resetBtn');
    resetBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset all form fields?')) {
            document.getElementById('inspectionForm').reset();
        }
    });

    // 3. EXPORT TO PDF FUNCTIONALITY (html2pdf.js)
    const downloadPdfBtn = document.getElementById('downloadPdfBtn');
    downloadPdfBtn.addEventListener('click', () => {
        const element = document.getElementById('formContent');

        // Options for html2pdf
        const opt = {
            margin:       [0.3, 0.3, 0.3, 0.3], // top, left, bottom, right in inches
            filename:     'Excavation_Safety_Inspection.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true, logging: false },
            jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        // Trigger PDF generation
        html2pdf().set(opt).from(element).save();
    });

    // 4. EXPORT TO WORD FUNCTIONALITY (.doc)
    const downloadWordBtn = document.getElementById('downloadWordBtn');
    downloadWordBtn.addEventListener('click', () => {
        // Clone form content to prepare static text for Word export
        const element = document.getElementById('formContent').cloneNode(true);

        // Convert Input fields to text in Clone
        const inputs = element.querySelectorAll('input[type="text"], input[type="date"], input[type="datetime-local"]');
        inputs.forEach(input => {
            const span = document.createElement('span');
            span.style.borderBottom = "1px solid #343a40";
            span.style.display = "inline-block";
            span.style.minWidth = "120px";
            span.style.padding = "2px 5px";
            span.innerText = input.value || '___________';
            input.parentNode.replaceChild(span, input);
        });

        // Convert Textareas to text in Clone
        const textareas = element.querySelectorAll('textarea');
        textareas.forEach(textarea => {
            const div = document.createElement('div');
            div.style.border = "1px solid #6c757d";
            div.style.padding = "8px";
            div.style.minHeight = "80px";
            div.innerText = textarea.value || '';
            textarea.parentNode.replaceChild(div, textarea);
        });

        // HTML Header and Footer for Microsoft Word Format
        const headerHtml = "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
            "xmlns:w='urn:schemas-microsoft-com:office:word' " +
            "xmlns='http://www.w3.org/TR/REC-html40'>" +
            "<head><meta charset='utf-8'><title>Safety Inspection</title></head><body>";
        const footerHtml = "</body></html>";
        
        const sourceHTML = headerHtml + element.innerHTML + footerHtml;

        const blob = new Blob(['\ufeff' + sourceHTML], {
            type: 'application/msword'
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Excavation_Safety_Inspection.doc';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

});