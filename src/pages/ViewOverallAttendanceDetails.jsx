import { useEffect, useState } from "react";
import { Input } from "../components/Input";
import { PaginatedTable } from "../components/PaginatedTable";
import { Select } from "../components/Select";
import { dateFormatter, days } from "../helpers/date";
import { fetch } from "../helpers/fetch";
import { getAttendanceReport } from "../helpers/report";
import "./../styles/attendance.scss";
export const ViewOverallAttendanceDetails = () => {
  const [studentsSubjectsAndAttendances, setStudentsSubjectsAndAttendances] =
    useState({
      students: [],
      subjects: [],
      attendances: [],
    });
  const [percentage, setPercentage] = useState("");
  const [filters, setFilters] = useState({
    subjectCode: "",
    regNo: "",
    startDate: "",
    endDate: "",
    name: "",
  });
  const [serverError, setServerError] = useState("");
  const filterFunction = (attendance) =>
    attendance.subjectCode.includes(filters.subjectCode) &&
    (filters.startDate ? attendance.date >= filters.startDate : true) &&
    (filters.endDate ? attendance.date <= filters.endDate : true) &&
    attendance.regNo.includes(filters.regNo) &&
    attendance.name.toLowerCase().includes(filters.name);

  const sortFunction = (attendance1, attendance2) =>
    attendance1.subjectCode +
      attendance1.date +
      attendance1.hour +
      attendance1.regNo >
    attendance1.subjectCode +
      attendance2.date +
      attendance2.hour +
      attendance2.regNo;

  useEffect(() => {
    fetch({
      url: "/attendance/c",
      setError: setServerError,
      setResult: (result) => {
        setStudentsSubjectsAndAttendances({
          students: result.students,
          subjects: result.subjects,
          attendances: result.attendances.sort(sortFunction),
        });
        if (result.attendances.length == 0) {
          setServerError("Nothing to show");
        } else {
          setServerError("");
        }
      },
    });
  }, []);

  useEffect(() => {
    if (filters.name || !filters.regNo) {
      setPercentage("");
      return;
    }
    const fullDataForRegNo =
      studentsSubjectsAndAttendances.attendances.filter(filterFunction);
    if (fullDataForRegNo.length == 0) {
      setPercentage("");
      return;
    }

    const attendedDataForRegNo = fullDataForRegNo.filter(
      (data) => data.attended || data.isOd
    );

    if (filters.subjectCode) {
      const fullDataForSubject = fullDataForRegNo.filter((data) => {
        return data.subjectCode.includes(filters.subjectCode);
      });
      if (fullDataForSubject.length == 0) {
        setPercentage("");
        return;
      }
      const attendedDataForSubject = fullDataForSubject.filter(
        (data) => data.attended || data.isOd
      );
      setPercentage(
        (
          (attendedDataForSubject.length / fullDataForSubject.length) *
          100
        ).toFixed(2)
      );
      return;
    }
    setPercentage(
      ((attendedDataForRegNo.length / fullDataForRegNo.length) * 100).toFixed(2)
    );
  }, [filters]);
  const renderFunction = (attendance) => (
    <>
      <td>{dateFormatter(attendance.date)}</td>
      <td>{days[attendance.day]}</td>
      <td>{attendance.subjectAcronym}</td>
      <td>{attendance.hour}</td>
      <td>{attendance.regNo}</td>
      <td>{attendance.name}</td>
      <td>
        <input type="checkbox" readOnly checked={attendance.attended} />
      </td>
      <td>
        <input type="checkbox" readOnly checked={attendance.isOd} />
      </td>
    </>
  );

  return (
    <>
      {studentsSubjectsAndAttendances.attendances.length > 0 && (
        <>
          <p className="heading">
            Filters:<small> use any of the fields</small>
          </p>
          <form action="">
            <Select
              label="Subject"
              options={studentsSubjectsAndAttendances.subjects.map(
                ({ subjectAcronym, subjectCode }) => [
                  subjectAcronym,
                  subjectCode,
                ]
              )}
              value={filters.subjectCode}
              onChange={(ev) => {
                setFilters({ ...filters, subjectCode: ev.target.value });
              }}
            />
            <Select
              label="Reg No"
              options={studentsSubjectsAndAttendances.students.map(
                ({ regNo }) => [regNo, regNo]
              )}
              value={filters.regNo}
              onChange={(ev) => {
                setFilters({ ...filters, regNo: ev.target.value });
              }}
            />
            <Input
              label="Start date"
              type="date"
              isField={true}
              value={filters.startDate}
              onChange={(ev) => {
                setFilters({ ...filters, startDate: ev.target.value });
              }}
            />{" "}
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
                studentsSubjectsAndAttendances.attendances.filter(
                  filterFunction
                )
              )
            }
          >
            Download
          </button>
          <PaginatedTable
            titles={[
              "Date",
              "Day",
              "Subject",
              "Hour",
              "Reg.No",
              "Name",
              "Attended",
              "OD",
            ]}
            data={studentsSubjectsAndAttendances.attendances.filter(
              filterFunction
            )}
            renderFunction={renderFunction}
            resetTrigger={filters}
          />
        </>
      )}
      {serverError && <small className="server-error">{serverError}</small>}
    </>
  );
};
