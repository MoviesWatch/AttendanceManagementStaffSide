import { days } from "./date";

export const getStudentsReport = (students) => {
  var csvFileData = [];
  students.forEach((student) => {
    csvFileData.push([
      student.regNo,
      student.name,
      student.gender,
      student.dateOfBirth,
      student.semester,
      student.departmentCode,
      student.mobile,
      student.email,
      student.parentName,
      student.parentMobile,
      student.dateJoined,
    ]);
  });
  function download_csv_file() {
    var csv =
      "Reg No,Name,Gender,Date of birth,Semester,Department,Mobile,Email,Parent name,Parent mobile,Joined date\n";

    csvFileData.forEach(function (row) {
      csv += row.join(",");
      csv += "\n";
    });

    var hiddenElement = document.createElement("a");
    hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
    hiddenElement.target = "_blank";

    //provide the name for the CSV file to be downloaded
    hiddenElement.download = "Students.csv";
    hiddenElement.click();
  }
  download_csv_file();
};

export const getSubjectsReport = (subjects) => {
  var csvFileData = [];
  subjects.forEach((subject) => {
    csvFileData.push([
      subject.subjectCode,
      subject.subject,
      subject.subjectAcronym,
    ]);
  });
  function download_csv_file() {
    var csv = "Subject Code,Subject Name,Subject Acronym\n";
    csvFileData.forEach(function (row) {
      csv += row.join(",");
      csv += "\n";
    });

    var hiddenElement = document.createElement("a");
    hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
    hiddenElement.target = "_blank";

    //provide the name for the CSV file to be downloaded
    hiddenElement.download = "Subjects.csv";
    hiddenElement.click();
  }
  download_csv_file();
};

export const getStudentsAndSubjectsReport = (students) => {
  var csvFileData = [];
  students.forEach((student) => {
    csvFileData.push([student.regNo, student.name]);
  });

  function download_csv_file() {
    var csv = "Reg No,Name\n";

    csvFileData.forEach(function (row) {
      csv += row.join(",");
      csv += "\n";
    });

    var hiddenElement = document.createElement("a");
    hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
    hiddenElement.target = "_blank";

    //provide the name for the CSV file to be downloaded
    hiddenElement.download = "Students.csv";
    hiddenElement.click();
  }
  download_csv_file();
};

export const getTimetableReport = (timetable) => {
  var csvFileData = [];
  [1, 2, 3, 4, 5].forEach((day) => {
    let oneDay = timetable.filter((period) => period.day == day);
    let oneDayTable = [];
    oneDayTable.push(days[day]);
    if (oneDay.length) {
      [1, 2, 3, 4, 5, 6, 7].forEach((hour) => {
        let onePeriod = oneDay.filter((period) => period.hour == hour);
        let subAcr = "";
        if (onePeriod.length) {
          for (let i = 0; i < onePeriod.length - 1; i++) {
            subAcr += onePeriod[i].subjectAcronym;
            subAcr += " / ";
          }
          subAcr += onePeriod[onePeriod.length - 1].subjectAcronym;
        }
        oneDayTable.push(subAcr);
      });
    }
    csvFileData.push(oneDayTable);
  });
  function download_csv_file() {
    var csv = "Day,1,2,3,4,5,6,7\n";
    csvFileData.forEach(function (row) {
      csv += row.join(",");
      csv += "\n";
    });

    var hiddenElement = document.createElement("a");
    hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
    hiddenElement.target = "_blank";

    //provide the name for the CSV file to be downloaded
    hiddenElement.download = "Timetable.csv";
    hiddenElement.click();
  }
  download_csv_file();
};

export const getWorkingDaysReport = (allWorkingDays) => {
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
    hiddenElement.download = "Working-Days.csv";
    hiddenElement.click();
  }
  download_csv_file();
};

export const getFacultyReport = (faculties) => {
  const accessRef = {
    1: "Faculty",
    2: "Faculty advisor",
    3: "HOD",
    4: "Admin",
  };
  var csvFileData = [];
  faculties.forEach((Faculty) => {
    csvFileData.push([
      Faculty.facultyID,
      Faculty.name,
      Faculty.email,
      Faculty.mobile,
      Faculty.departmentCode,
      Faculty.semester,
      accessRef[Faculty.accessID],
    ]);
  });
  function download_csv_file() {
    var csv = "Faculty ID,Name,Email,Mobile,Department,Semester,Access\n";

    csvFileData.forEach(function (row) {
      csv += row.join(",");
      csv += "\n";
    });

    var hiddenElement = document.createElement("a");
    hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
    hiddenElement.target = "_blank";

    //provide the name for the CSV file to be downloaded
    hiddenElement.download = "Faculties.csv";
    hiddenElement.click();
  }

  download_csv_file();
};

export const getAttendanceReport = (attendance) => {
  const listOfDates = [];
  const periods = [];
  if (attendance[0]) {
    const exPerson = attendance[0].regNo;
    const hourscount = attendance.filter((one) => one.regNo == exPerson);
    hourscount.forEach((element) => {
      if (listOfDates.findIndex((date) => date == element.date) === -1) {
        listOfDates.push(element.date);
      }
    });
    for (let i = 0; i < listOfDates.length; i++) {
      let hours = attendance.filter(
        (element) => element.date == listOfDates[i] && element.regNo == exPerson
      );
      let hourList = [];
      hours.forEach((element) => {
        hourList.push(element.hour);
      });
      periods.push(hourList.sort((a, b) => a - b));
    }
    const students = [];
    const listofStudents = attendance.filter(
      (a) => a.date == listOfDates[0] && a.hour == periods[0][0]
    );

    listofStudents.forEach((element) => {
      students.push([element.regNo, element.name]);
    });
    students.sort((a, b) => a[0] - b[0]);

    var csvFileData = [];
    students.forEach((student) => {
      let row = [];
      row.push(student[0]);
      row.push(student[1]);
      for (let i = 0; i < listOfDates.length; i++) {
        const studentHour = attendance.filter(
          (a) => a.date == listOfDates[i] && a.regNo == student[0]
        );
        for (let j = 0; j < periods[i].length; j++) {
          let x = studentHour.filter((a) => a.hour == periods[i][j])[0];
          if (x.isOd) {
            row.push("OD");
          } else if (x.attended) {
            row.push("P");
          } else {
            row.push("A");
          }
        }
      }
      csvFileData.push(row);
    });

    //create a user-defined function to download CSV file
    function download_csv_file() {
      //define the heading for each row of the data
      var csv = ",,";
      for (let i = 0; i < listOfDates.length; i++) {
        for (let j = 0; j < periods[i].length; j++) {
          csv += listOfDates[i];
          csv += ",";
        }
      }
      csv += "\nReg No.,Name,";
      for (let i = 0; i < listOfDates.length; i++) {
        for (let j = 0; j < periods[i].length; j++) {
          csv += periods[i][j];
          csv += ",";
        }
      }
      csv += "\n";
      csvFileData.forEach(function (row) {
        csv += row.join(",");
        csv += "\n";
      });
      var hiddenElement = document.createElement("a");
      hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
      hiddenElement.target = "_blank";
      hiddenElement.download = "Attendance-Data.csv";
      hiddenElement.click();
    }
    download_csv_file();
  }
};

export const getFacultiesAndSubjectsReport = (facultiesAndSubjects) => {
  var csvFileData = [];
  facultiesAndSubjects.forEach((faculty) => {
    csvFileData.push([
      faculty.facultyID,
      faculty.name,
      faculty.departmentCode,
      faculty.semester,
      faculty.subjectCode,
      faculty.subject,
    ]);
  });
  function download_csv_file() {
    var csv = "Faculty ID,Name,Department,Semester,subject code,Subject\n";

    csvFileData.forEach(function (row) {
      csv += row.join(",");
      csv += "\n";
    });

    var hiddenElement = document.createElement("a");
    hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
    hiddenElement.target = "_blank";

    //provide the name for the CSV file to be downloaded
    hiddenElement.download = "Faculties-And-Subjects.csv";
    hiddenElement.click();
  }
  download_csv_file();
};

export const getClassesAndSubjectsReport = (allSubject) => {
  var csvFileData = [];
  allSubject.forEach((subject) => {
    csvFileData.push([
      subject.departmentCode,
      subject.semester,
      subject.subjectCode,
      subject.subject,
      subject.subjectAcronym,
      subject.type,
    ]);
  });
  function download_csv_file() {
    var csv =
      "Department,Semester,Subject code,Subject name,Subject acronym,Type\n";

    csvFileData.forEach(function (row) {
      csv += row.join(",");
      csv += "\n";
    });

    var hiddenElement = document.createElement("a");
    hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
    hiddenElement.target = "_blank";

    //provide the name for the CSV file to be downloaded
    hiddenElement.download = "Classes-And-Subjects.csv";
    hiddenElement.click();
  }
  download_csv_file();
};
export const getAttendancePercentageReport = (data) => {
  var csvFileData = [];
  data.forEach((student) => {
    csvFileData.push([student.regNo, student.name, student.percentage]);
  });
  function download_csv_file() {
    var csv = "Reg No,Name,Percentage\n";

    csvFileData.forEach(function (row) {
      csv += row.join(",");
      csv += "\n";
    });

    var hiddenElement = document.createElement("a");
    hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
    hiddenElement.target = "_blank";

    //provide the name for the CSV file to be downloaded
    hiddenElement.download = "Attendance Percentage.csv";
    hiddenElement.click();
  }
  download_csv_file();
};
