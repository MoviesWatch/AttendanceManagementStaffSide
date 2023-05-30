import { useEffect, useState } from "react";
import { Input } from "../components/Input";
import { PaginatedTable } from "../components/PaginatedTable";
import { Select } from "../components/Select";
import { dateFormatter, days } from "../helpers/date";
import { fetch } from "../helpers/fetch";
import { session } from "../helpers/getSession";
import "./../styles/attendance.scss";
import "react-alert-confirm/lib/style.css";
import AlertConfirm from "react-alert-confirm";
import { getAttendanceReport } from "../helpers/report";
export const ViewAttendanceDetails = () => {
  const [studentsAndAttendances, setStudentsAndAttendances] = useState({
    students: [],
    attendances: [],
  });
  const [percentage, setPercentage] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [serverError, setServerError] = useState("");
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
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
    attendance1.date + attendance1.hour + attendance1.regNo >
    attendance2.date + attendance2.hour + attendance2.regNo;
  const getHandler = (ev) => {
    ev?.preventDefault();
    fetch({
      url: `/attendance/cs/${selectedSubject}`,
      setError: setServerError,
      setResult: (result) => {
        setStudentsAndAttendances({
          students: result.students,
          attendances: result.attendances.sort(sortFunction),
        });
        if (result.attendances.length == 0) {
          setServerError("Nothing to show");
        } else {
          setServerError("");
        }
      },
    });
  };

  useEffect(() => {
    if (filters.name || !filters.regNo) {
      setPercentage("");
      return;
    }

    const fullDataForRegNo =
      studentsAndAttendances.attendances.filter(filterFuction);

    if (fullDataForRegNo.length == 0) {
      setPercentage("");
      return;
    }

    const attendedDataForRegNo = fullDataForRegNo.filter(
      (data) => data.attended || data.isOd
    );
    setPercentage(
      ((attendedDataForRegNo.length / fullDataForRegNo.length) * 100).toFixed(2)
    );
  }, [filters, studentsAndAttendances]);

  const changeHandler = async (attendance) => {
    const confirmance = await AlertConfirm("Are you sure?");
    if (!confirmance[0]) return;
    if (!attendance.attended) {
      fetch({
        url: `/absentee/${attendance.date}/${attendance.periodID}/${attendance.regNo}`,
        method: "delete",
        setError: setServerError,
        setResult: AlertConfirm.alert,
      });
    } else {
      fetch({
        url: `/absentee`,
        method: "post",
        setError: setServerError,
        setResult: AlertConfirm.alert,
        body: [
          {
            date: attendance.date,
            periodID: attendance.periodID,
            regNo: attendance.regNo,
            hour: attendance.hour,
          },
        ],
      });
    }
    getHandler();
  };
  const filterFuction = (attendance) =>
    (filters.startDate ? attendance.date >= filters.startDate : true) &&
    (filters.endDate ? attendance.date <= filters.endDate : true) &&
    attendance.regNo.includes(filters.regNo) &&
    attendance.name.toLowerCase().includes(filters.name);

  const renderFunction = (attendance) => (
    <>
      <td>{dateFormatter(attendance.date)}</td>
      <td>{days[attendance.day]}</td>
      <td>{attendance.hour}</td>
      <td>{attendance.regNo}</td>
      <td>{attendance.name}</td>
      <td>
        <input type="checkbox" readOnly checked={attendance.attended} />
      </td>
      <td>
        <input type="checkbox" readOnly checked={attendance.isOd} />
      </td>
      <td>
        <button
          className="small"
          disabled={attendance.isOd}
          onClick={() => changeHandler(attendance)}
        >
          Change
        </button>
      </td>
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
      {studentsAndAttendances.attendances.length > 0 && (
        <>
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
            <Select
              label="Reg No"
              options={studentsAndAttendances.students.map(({ regNo }) => [
                regNo,
                regNo,
              ])}
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
          {percentage && (
            <p className="percentage">
              Attendance percentage: <span>{percentage}</span>%
            </p>
          )}
          <button
            onClick={() =>
              getAttendanceReport(
                studentsAndAttendances.attendances.filter(filterFuction)
              )
            }
          >
            Download
          </button>
          <PaginatedTable
            titles={[
              "Date",
              "Day",
              "Hour",
              "Reg No",
              "Name",
              "Attended",
              "OD",
              "Actions",
            ]}
            data={studentsAndAttendances.attendances.filter(filterFuction)}
            renderFunction={renderFunction}
            resetTrigger={filters}
          />
        </>
      )}
      {serverError && <small className="server-error">{serverError}</small>}
    </>
  );
};
