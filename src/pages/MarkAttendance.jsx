import axios from "axios";
import { useEffect, useState } from "react";
import { CustomTable } from "../components/CustomTable";
import { Input } from "../components/Input";
import { Select } from "../components/Select";
import { fetch } from "../helpers/fetch";
import { session } from "../helpers/getSession";
import "./../styles/markAttendance.scss";
import "react-alert-confirm/lib/style.css";
import AlertConfirm from "react-alert-confirm";
export const MarkAttendence = () => {
  const [subjects, setSubjects] = useState([]);
  const [workingDays, setWorkingDays] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [date, setDate] = useState("");
  const [periods, setPeriods] = useState([]);
  const [selectedPeriods, setSelectedPeriods] = useState([]);
  const [students, setStudents] = useState([]);
  const [filters, setFilters] = useState({
    regNo: "",
    name: "",
  });
  const faculty = session("faculty");
  const [allPresent, setAllPresent] = useState(false);
  const [absentees, setAbsentees] = useState([]);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    fetch({
      url: `/facultyAndSubject/${faculty.facultyID}`,
      setError: setServerError,
      setResult: setSubjects,
    });
  }, []);
  useEffect(() => {
    if (!selectedSubject) return;
    fetch({
      url: `/workingDay/${selectedSubject.split("/")[0]}`,
      setError: setServerError,
      setResult: setWorkingDays,
    });
  }, [selectedSubject]);
  const submitHandler = () => {
    //post absentees
    const absenteesData = [];
    const activePeriods = [];
    selectedPeriods.forEach(([periodID, hour]) => {
      activePeriods.push({ periodID, date });
      absentees.forEach(({ regNo }) => {
        absenteesData.push({
          regNo,
          date,
          periodID,
          hour,
        });
      });
    });
    fetch({
      url: "/absentee/addNew",
      method: "post",
      setError: setServerError,
      setResult: AlertConfirm.alert,
      body: { absentees: absenteesData, activePeriods },
    });
    setAbsentees([]);
  };

  const getHandler = async (ev) => {
    ev.preventDefault();
    fetch({
      url: `/timetable/c_d/${selectedSubject.split("/")[1]}/${
        workingDays.find((workingDay) => workingDay.date == date).day
      }`,
      setError: setServerError,
      setResult: (result) => {
        if (result.length == 0) {
          setServerError("No hours for that day");
        } else {
          setServerError("");
        }
        setPeriods(result);
      },
    });
    fetch({
      url: `/studentAndSubject/cs/${selectedSubject.split("/")[1]}`,
      setError: setServerError,
      setResult: (result) => {
        result = result.filter(({ inactive }) => inactive == null);
        setStudents(result);
        setAbsentees(result);
      },
    });
  };

  return (
    <>
      <form action="#" className="mark-attendance">
        <Select
          layoutType="inline"
          label="Subject"
          options={subjects.map(
            ({
              classID,
              classSubjectID,
              subjectAcronym,
              departmentCode,
              semester,
            }) => [
              subjectAcronym + " / " + departmentCode + " - " + semester,
              classID + "/" + classSubjectID,
            ]
          )}
          value={selectedSubject}
          onChange={(ev) => setSelectedSubject(ev.target.value)}
        />
        <Input
          type="date"
          layoutType="inline"
          isField={true}
          label="Date"
          value={date}
          onChange={(ev) => setDate(ev.target.value)}
        />
        <button
          onClick={getHandler}
          disabled={
            !(
              selectedSubject &&
              workingDays.filter((workingDay) => workingDay.date === date)
                .length > 0
            )
          }
        >
          Proceed
        </button>
        {periods.length > 0 && (
          <>
            <div className="period-container">
              <>
                <p>Period</p>
                <div>
                  {periods.map((period) => (
                    <Input
                      type="checkbox"
                      label={period.hour}
                      value={period.periodID + "/" + period.hour}
                      isField={false}
                      name="periods"
                      layoutType="inline"
                      onChange={() => {
                        setSelectedPeriods(
                          [...document.getElementsByName("periods")]
                            .filter((el) => el.checked)
                            .map((el) => el.value.split("/"))
                        );
                      }}
                    />
                  ))}
                </div>
              </>
            </div>
            <Input
              type="checkbox"
              isField={false}
              label="All present"
              disabled={!(selectedSubject && date && selectedPeriods.length)}
              onChange={(ev) =>
                setAllPresent(() => {
                  students.forEach((student) => {
                    student.attended = ev.target.checked ? true : false;
                  });
                  setStudents([...students]);
                  setAbsentees(() => {
                    return students.filter((student) => !student.attended);
                  });
                  return ev.target.checked;
                })
              }
              checked={allPresent}
            />
          </>
        )}
      </form>
      {periods.length > 0 && selectedPeriods.length > 0 && (
        <>
          <div className="filters-container">
            <p className="heading">Filters</p>
            <form action="">
              <Input
                type="text"
                layoutType="inline"
                isField={true}
                label="Reg No"
                onChange={(ev) =>
                  setFilters({ ...filters, regNo: ev.target.value })
                }
                value={filters.regNo}
              />
              <Input
                type="text"
                layoutType="inline"
                isField={true}
                label="Name"
                onChange={(ev) =>
                  setFilters({ ...filters, name: ev.target.value })
                }
                value={filters.name}
              />
            </form>
          </div>

          <div className="absentees">
            <p>Absentees</p>
            <ul>
              {absentees.map((student) => (
                <li>
                  <label htmlFor={student.regNo}>
                    {student.regNo + " - " + student.name}
                  </label>
                </li>
              ))}
            </ul>
            <button onClick={submitHandler}>Submit</button>
          </div>
          <CustomTable titles={["S.No", "Reg No", "Name", "Attended"]}>
            {students
              .filter(
                (student) =>
                  student.regNo.includes(filters.regNo) &&
                  student.name.toLowerCase().includes(filters.name)
              )
              .map((student, index) => (
                <tr>
                  <td>{index + 1}</td>
                  <td>{student.regNo}</td>
                  <td>{student.name}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={student.attended}
                      id={student.regNo}
                      onChange={(ev) => {
                        student.attended = ev.target.checked;
                        setAllPresent(false);
                        setStudents([...students]);
                        setAbsentees(() => {
                          return students.filter(
                            (student) => !student.attended
                          );
                        });
                      }}
                    />
                  </td>
                </tr>
              ))}
          </CustomTable>
        </>
      )}
      {serverError && <small className="server-error">{serverError}</small>}
    </>
  );
};
