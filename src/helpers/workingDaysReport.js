import { days } from "./date";
export const generateReport = (allWorkingDays) => {
  var csvFileData = [];
  allWorkingDays.forEach((workingDay) => {
    csvFileData.push([workingDay.date, days[workingDay.day]]);
  });
  function download_csv_file() {
    var csv = "Date,Day\n";
    csvFileData.forEach(function (row) {
      csv += row.join(",");
      csv += "\n";
    });

    var hiddenElement = document.createElement("a");
    hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
    hiddenElement.target = "_blank";

    //provide the name for the CSV file to be downloaded
    hiddenElement.download = "workingDays.csv";
    hiddenElement.click();
  }
  download_csv_file();
};
