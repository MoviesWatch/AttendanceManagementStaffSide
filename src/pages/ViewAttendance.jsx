import { useEffect, useState } from "react";
import { Input } from "../components/Input";
import { PaginatedTable } from "../components/PaginatedTable";
import { Select } from "../components/Select";
import { fetch } from "../helpers/fetch";
import { session } from "../helpers/getSession";
import "./../styles/attendance.scss";
import "react-alert-confirm/lib/style.css";
import { getAttendancePercentageReport } from "../helpers/report";
export const ViewAttendance = () => {
  const [studentsAndAttendances, setStudentsAndAttendances] = useState({
    students: [],
    attendances: [],
  });
  const [attendances, setAttendances] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [serverError, setServerError] = useState("");
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    minPercent: "",
    maxPercent: "",
    regNo: "",
    name: "",
  });
  const faculty = session("faculty");
  useEffect(() => {
    fetch({
      url: `/facultyAndSubject/${faculty.facultyID}`,
      setError: setServerError,
      setResult: setSubjects,
    });
  }, []);
  const sortFunction = (attendance1, attendance2) =>
    attendance1.regNo > attendance2.regNo;
  const getHandler = (ev) => {
    ev?.preventDefault();
    fetch({
      url: `/attendance/cs/${selectedSubject}`,
      setError: setServerError,
      setResult: (result) => {
        setStudentsAndAttendances({
          students: result.students.sort(sortFunction),
          attendances: result.attendances,
        });
        if (result.attendances.length == 0) {
          setServerError("Nothing to show");
        } else {
          setServerError("");
        }
      },
    });
  };

  const filterFunction = (attendance) => {
    return (
      attendance.regNo.toLowerCase().includes(filters.regNo) &&
      attendance.name.toLowerCase().includes(filters.name) &&
      Number(attendance.percentage) >= Number(filters.minPercent || 0) &&
      Number(attendance.percentage) <= Number(filters.maxPercent || 100)
    );
  };

  useEffect(() => {
    const attendances = [];
    if (studentsAndAttendances.attendances.length == 0) {
      setAttendances([]);
      return;
    }
    const dateFilteredAttendances = studentsAndAttendances.attendances.filter(
      (attendance) =>
        (filters.startDate ? attendance.date >= filters.startDate : true) &&
        (filters.endDate ? attendance.date <= filters.endDate : true)
    );

    studentsAndAttendances.students.forEach((student) => {
      const fullAttendance = dateFilteredAttendances.filter(
        (attendance) => attendance.regNo == student.regNo
      );
      const attendedAttendance = fullAttendance.filter(
        (attendance) => attendance.attended || attendance.isOd
      );
      attendances.push({
        regNo: student.regNo,
        name: student.name,
        percentage: (
          (attendedAttendance.length / fullAttendance.length) *
          100
        ).toFixed(2),
      });
    });
    setAttendances([...attendances]);
  }, [studentsAndAttendances, filters]);

  const renderFunction = (attendance) => (
    <>
      <td>{attendance.regNo}</td>
      <td>{attendance.name}</td>
      <td>{attendance.percentage}</td>
    </>
  );

  return (
    <>
      <form action="">
        <Select
          label="Subject"
          options={subjects.map(
            ({ classSubjectID, subjectAcronym, departmentCode, semester }) => [
              subjectAcronym + " / " + departmentCode + " - " + semester,
              classSubjectID,
            ]
          )}
          value={selectedSubject}
          onChange={(ev) => setSelectedSubject(ev.target.value)}
        />
        <button onClick={getHandler} disabled={!selectedSubject}>
          Get
        </button>
      </form>
      {attendances.length > 0 && (
        <>
          <div className="filters-conatiner">
            <p className="heading">
              Filters:<small> use any of the fields</small>
            </p>
            <form action="">
              <Input
                label="Start date"
                type="date"
                isField={true}
                value={filters.startDate}
                onChange={(ev) => {
                  setFilters({ ...filters, startDate: ev.target.value });
                }}
              />
              <Input
                label="End date"
                type="date"
                isField={true}
                value={filters.endDate}
                onChange={(ev) => {
                  setFilters({ ...filters, endDate: ev.target.value });
                }}
              />
              <Input
                label="Minimum percent"
                type="number"
                isField={true}
                value={filters.minPercent}
                onChange={(ev) => {
                  setFilters({ ...filters, minPercent: ev.target.value });
                }}
              />
              <Input
                label="Maximum percent"
                type="number"
                isField={true}
                value={filters.maxPercent}
                onChange={(ev) => {
                  setFilters({ ...filters, maxPercent: ev.target.value });
                }}
              />
              <Input
                label="Reg No"
                type="text"
                isField={true}
                value={filters.regNo}
                onChange={(ev) => {
                  setFilters({ ...filters, regNo: ev.target.value });
                }}
              />
              <Input
                label="Name"
                type="text"
                isField={true}
                value={filters.name}
                onChange={(ev) => {
                  setFilters({ ...filters, name: ev.target.value });
                }}
              />
            </form>
          </div>
          <button
            onClick={() =>
              getAttendancePercentageReport(attendances.filter(filterFunction))
            }
          >
            Download
          </button>
          <PaginatedTable
            titles={["Reg No", "Name", "Percentage"]}
            data={attendances.filter(filterFunction)}
            renderFunction={renderFunction}
            resetTrigger={filters}
          />
        </>
      )}
      {serverError && <small className="server-error">{serverError}</small>}
    </>
  );
};
