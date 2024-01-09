document.addEventListener('DOMContentLoaded', function () {    
    getReportes();
    return;
});

function getReportes() {
    const emailInput = "ulisesram19@gmail.com";

    fetch(`http://localhost:8000/reportes/${emailInput}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => displayReportes(data))
        .catch(error => console.error('Error:', error));
        return;
}

function displayReportes(reportes) {
    const resultContainer = document.getElementById("resultContainer");
    resultContainer.innerHTML = "";

    if (reportes.length === 0) {
        resultContainer.innerHTML = "<p>No se encontraron reportes.</p>";
        return;
    }

    const reportList = document.createElement("ul");

    reportes.forEach(report => {
        const listItem = document.createElement("li");
        const reportContent = document.createElement("span");
        reportContent.textContent = `Folio: ${report.folio} Fecha del siniestro: ${report.fechaDelSiniestro}`;
        listItem.appendChild(reportContent);
        listItem.setAttribute("id", `report_${report.folio}`);
        listItem.setAttribute("data-folio", report.folio);
        listItem.addEventListener("click", handleItemClick);
        reportList.appendChild(listItem);
    });
    resultContainer.appendChild(reportList);
    return;
}

function handleItemClick(event) {
    const selectedReportFolio = event.currentTarget.getAttribute("data-folio");
    document.cookie = `selectedReport=${selectedReportFolio}; path=/`;    
    window.location.href = 'http://localhost:8080/html/DictaminarReporte.html';
}

function cerrar_sesion() {
    window.location.href = 'http://localhost:8080/';  
}