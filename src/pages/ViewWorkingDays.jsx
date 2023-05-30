import { useEffect } from "react";
import { useState } from "react";
import { Input } from "../components/Input";
import { Select } from "../components/Select";
import { dateFormatter, dayGetter, days } from "../helpers/date";
import { fetch } from "../helpers/fetch";
import { session } from "../helpers/getSession";
import "./../styles/viewWorkingDays.scss";
import "react-alert-confirm/lib/style.css";
import AlertConfirm from "react-alert-confirm";
import { getWorkingDaysReport } from "../helpers/report";
export const ViewWorkingDays = () => {
  const departments = session("departments");
  const semesters = session("semesters");
  const [selectedClass, setSelectedClass] = useState({
    departmentCode: "",
    semester: "",
  });
  const [workingDays, setWorkingDays] = useState([]);
  const [serverError, setServerError] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const faculty = session("faculty");

  const getHandler = (ev) => {
    ev?.preventDefault();
    fetch({
      url: `/workingDay/d_s/${selectedClass.departmentCode}/${selectedClass.semester}`,
      setResult: (result) => {
        setWorkingDays(result);
        if (result.length == 0) {
          setServerError("Nothing to show");
        } else {
          setServerError("");
        }
      },
      setError: setServerError,
      sortFunction: (day1, day2) => day1.date > day2.date,
    });
  };
  const removeHandler = async (date) => {
    const confirmance = await AlertConfirm("Are you sure?");
    if (!confirmance[0]) return;
    fetch({
      url: `/workingDay/${faculty.classID}/${date}`,
      setResult: AlertConfirm.alert,
      method: "delete",
      setError: setServerError,
    });
    getHandler();
  };

  return (
    <>
      <div className="view-working-days-container">
        <form action="">
          <Select
            options={departments.map(({ departmentCode, department }) => [
              department,
              departmentCode,
            ])}
            label="Department"
            value={selectedClass.departmentCode}
            onChange={(ev) =>
              setSelectedClass({
                ...selectedClass,
                departmentCode: ev.target.value,
              })
            }
          />
          <Select
            options={semesters.map((semester) => [semester, semester])}
            label="Semester"
            value={selectedClass.semester}
            onChange={(ev) =>
              setSelectedClass({
                ...selectedClass,
                semester: ev.target.value,
              })
            }
          />
          <button
            disabled={!(selectedClass.departmentCode && selectedClass.semester)}
            onClick={getHandler}
          >
            Get
          </button>
        </form>
        {workingDays.length > 0 && (
          <>
            <div className="filters-container">
              <p className="heading">
                Filters:<small> use any of the fields</small>
              </p>
              <form action="">
                <Input
                  label="Date"
                  type="text"
                  layoutType="inline"
                  isField={true}
                  value={dateFilter}
                  onChange={(ev) => setDateFilter(ev.target.value)}
                />
              </form>
            </div>
            <button
              className="download-report"
              onClick={() => getWorkingDaysReport(workingDays)}
            >
              Download
            </button>
            <p className="heading">S.No - Date - Day - Actions</p>
            <div className="days-container">
              {workingDays
                .filter((day) => dateFormatter(day.date).includes(dateFilter))
                .map((day, index) => (
                  <p className="day">
                    <span>{index + 1}</span>
                    <span>{dateFormatter(day.date)}</span>
                    <span>{days[day.day]}</span>
                    {faculty.classID == day.classID && (
                      <button
                        className="small"
                        onClick={() => removeHandler(day.date)}
                      >
                        Remove
                      </button>
                    )}
                  </p>
                ))}
            </div>
          </>
        )}
      </div>
      {serverError && <small className="server-error">{serverError}</small>}
    </>
  );
};
