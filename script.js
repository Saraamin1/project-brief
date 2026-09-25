document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("inspectionForm");

    const savePdfBtn = document.getElementById("savePdfBtn");
    const saveWordBtn = document.getElementById("saveWordBtn");
    const clearBtn = document.getElementById("clearBtn");

    const STORAGE_KEY = "excavationSafetyInspectionData";


    /* =========================
       SAVE FORM TO LOCAL STORAGE
    ========================= */

    function saveFormData() {

        const data = {};

        const fields = form.querySelectorAll(
            "input, select, textarea"
        );

        fields.forEach(function (field) {

            if (field.type === "radio") {

                if (field.checked) {
                    data[field.name] = field.value;
                }

            } else {

                data[field.name] = field.value;

            }

        });

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(data)
        );
    }


    /* =========================
       LOAD FORM DATA
    ========================= */

    function loadFormData() {

        const savedData = localStorage.getItem(
            STORAGE_KEY
        );

        if (!savedData) {
            return;
        }

        const data = JSON.parse(savedData);

        const fields = form.querySelectorAll(
            "input, select, textarea"
        );

        fields.forEach(function (field) {

            if (!field.name) {
                return;
            }

            if (field.type === "radio") {

                field.checked =
                    data[field.name] === field.value;

            } else {

                if (data[field.name] !== undefined) {
                    field.value = data[field.name];
                }

            }

        });

    }


    /* =========================
       AUTO SAVE
    ========================= */

    form.addEventListener("input", function () {
        saveFormData();
    });

    form.addEventListener("change", function () {
        saveFormData();
    });


    /* =========================
       PDF
    ========================= */

    savePdfBtn.addEventListener("click", function () {

        saveFormData();

        const element = document.querySelector(
            ".app-container"
        );

        const options = {

            margin: 8,

            filename:
                "excavation-trenching-safety-inspection.pdf",

            image: {
                type: "jpeg",
                quality: 0.98
            },

            html2canvas: {
                scale: 2,
                useCORS: true,
                logging: false
            },

            jsPDF: {
                unit: "mm",
                format: "a4",
                orientation: "portrait"
            },

            pagebreak: {
                mode: [
                    "avoid-all",
                    "css",
                    "legacy"
                ]
            }

        };


        document.body.classList.add("pdf-mode");


        html2pdf()
            .set(options)
            .from(element)
            .save()
            .finally(function () {

                document.body.classList.remove(
                    "pdf-mode"
                );

            });

    });


    /* =========================
       WORD
    ========================= */

    saveWordBtn.addEventListener("click", function () {

        saveFormData();

        const container =
            document.querySelector(".app-container");

        const clone =
            container.cloneNode(true);


        /* Remove buttons */

        const headerActions =
            clone.querySelector(".header-actions");

        if (headerActions) {
            headerActions.remove();
        }


        /* Convert radio inputs to text */

        const radios =
            clone.querySelectorAll(
                'input[type="radio"]'
            );

        radios.forEach(function (radio) {

            const parent = radio.parentElement;

            if (!parent) {
                return;
            }

            const checked =
                radio.checked;

            if (checked) {

                parent.innerHTML =
                    "●";

            } else {

                parent.innerHTML =
                    "○";

            }

        });


        /* Convert input values */

        const inputs =
            clone.querySelectorAll(
                "input, textarea, select"
            );

        inputs.forEach(function (field) {

            if (
                field.type === "radio"
            ) {
                return;
            }

            let value = "";

            if (
                field.tagName.toLowerCase() ===
                "select"
            ) {

                value =
                    field.options[
                        field.selectedIndex
                    ]?.text || "";

            } else {

                value =
                    field.value || "";

            }


            const replacement =
                document.createElement("span");

            replacement.textContent =
                value;

            replacement.style.display =
                "inline-block";

            replacement.style.minWidth =
                "150px";

            replacement.style.borderBottom =
                "1px solid #777";

            replacement.style.padding =
                "4px 2px";


            field.parentNode.replaceChild(
                replacement,
                field
            );

        });


        const htmlContent = `

<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<title>
Excavation & Trenching Safety Inspection
</title>

<style>

body {
    font-family: Arial, sans-serif;
    color: #343A40;
    line-height: 1.5;
}

.app-container {
    max-width: 900px;
    margin: auto;
}

.app-header {
    background: #1E3A5F;
    color: white;
    padding: 20px;
}

.card {
    border: 1px solid #ddd;
    padding: 20px;
    margin-bottom: 20px;
}

.section-title {
    color: #1E3A5F;
    border-bottom: 2px solid #ddd;
    padding-bottom: 8px;
}

.osha-box {
    background: #eef5fa;
    border-left: 5px solid #1E3A5F;
    padding: 15px;
    margin-bottom: 20px;
}

.critical-alert {
    background: #fff3cd;
    border: 2px solid #FF6B35;
    padding: 15px;
    margin-bottom: 20px;
}

.checklist {
    width: 100%;
}

.checklist-header,
.checklist-row {
    display: grid;
    grid-template-columns: 1fr 60px 60px 60px;
}

.checklist-header {
    background: #1E3A5F;
    color: white;
    padding: 10px;
}

.checklist-row {
    border: 1px solid #ddd;
    border-top: none;
    padding: 10px;
}

.app-footer {
    margin-top: 20px;
    text-align: center;
}

</style>

</head>

<body>

${clone.outerHTML}

</body>

</html>

`;


        const blob =
            new Blob(
                [htmlContent],
                {
                    type:
                        "application/msword"
                }
            );


        const url =
            URL.createObjectURL(blob);


        const link =
            document.createElement("a");

        link.href = url;

        link.download =
            "excavation-trenching-safety-inspection.doc";


        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);


        URL.revokeObjectURL(url);

    });


    /* =========================
       CLEAR FORM
    ========================= */

    clearBtn.addEventListener("click", function () {

        const confirmation =
            confirm(
                "Are you sure you want to clear the entire form?"
            );


        if (!confirmation) {
            return;
        }


        const fields =
            form.querySelectorAll(
                "input, select, textarea"
            );


        fields.forEach(function (field) {

            if (field.type === "radio") {

                field.checked = false;

            } else {

                field.value = "";

            }

        });


        localStorage.removeItem(
            STORAGE_KEY
        );

    });


    /* =========================
       INITIAL LOAD
    ========================= */

    loadFormData();

});
