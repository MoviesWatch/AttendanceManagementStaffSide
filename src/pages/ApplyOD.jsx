import { useEffect, useState } from "react";
import { Input } from "../components/Input";
import { CustomTable } from "../components/CustomTable";
import { dateFormatter, dayGetter, days } from "../helpers/date";
import "./../styles/applyOD.scss";
import { fetch } from "../helpers/fetch";
import { session } from "../helpers/getSession";
import "react-alert-confirm/lib/style.css";
import AlertConfirm from "react-alert-confirm";
export const ApplyOD = () => {
  const faculty = session("faculty");
  const [workingDays, setWorkingDays] = useState([]);

  const [students, setStudents] = useState([]);

  const [values, setValues] = useState({
    days: [],
    regNos: [],
    hours: [],
  });
  const [file, setFile] = useState({ files: [] });
  const [serverError, setServerError] = useState(null);
  const [odData, setODData] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [filters, setFilters] = useState({
    workingDay: "",
    regNo: "",
  });

  useEffect(() => {
    fetch({
      url: `/workingDay/${faculty.classID}`,
      setError: setServerError,
      setResult: setWorkingDays,
    });
    fetch({
      url: `/student/c/${faculty.classID}`,
      setError: setServerError,
      setResult: setStudents,
    });
    fetch({
      url: `/timetable/c/${faculty.classID}`,
      setError: serverError,
      setResult: setTimetable,
    });
  }, []);

  const changeHandler = (checked, key, value) => {
    if (checked) {
      values[key].push(value);
    } else {
      values[key].splice(values[key].indexOf(value), 1);
    }
    setValues({ ...values });
    console.log(values);
  };

  const addHandler = () => {
    const { days, regNos, hours } = values;
    days.forEach((day) => {
      regNos.forEach((regNo) => {
        hours.forEach((hour) => {
          const alreadyIn = odData.find(
            (od) =>
              day.date === od.date && regNo === od.regNo && hour === od.hour
          );
          if (alreadyIn) return;
          odData.push({
            date: day.date,
            regNo,
            hour,
          });
        });
      });
    });
    odData.sort((obj1, obj2) => {
      return (
        "" + obj1.date + obj1.period + obj1.regNo >
        "" + obj2.date + obj2.period + obj2.regNo
      );
    });
    setODData([...odData]);
    setValues({
      days: [],
      regNos: [],
      hours: [],
    });
  };

  const removeHandler = (OD) => {
    odData.splice(odData.indexOf(OD), 1);
    setODData([...odData]);
  };

  const submitHandler = () => {
    const formData = new FormData();
    formData.append("odData", JSON.stringify(odData));
    formData.append("attachment", file.files[0]);
    fetch({
      url: "/odRequest",
      method: "post",
      body: formData,
      setError: setServerError,
      setResult: AlertConfirm.alert,
      headers: {
        "content-type": "multipart/form-data",
      },
    });
  };
  if (!faculty.classID) return;
  return (
    <>
      <div className="fill-od-container">
        <div className="days-container">
          <p>Working days</p>
          <Input
            type="text"
            label="Search"
            isField={true}
            className="search"
            value={filters.workingDay}
            onChange={(ev) =>
              setFilters({ ...filters, workingDay: ev.target.value })
            }
          />
          {workingDays
            .filter(({ date }) =>
              dateFormatter(date).includes(filters.workingDay)
            )
            .map((day) => (
              <Input
                type="checkbox"
                key={day.date}
                label={dateFormatter(day.date) + "-" + days[day.day]}
                layoutType="inline"
                value={day.date}
                checked={values.days.includes(day)}
                onChange={(ev) => changeHandler(ev.target.checked, "days", day)}
              />
            ))}
        </div>
        <div className="students-container">
          <p>Reg No</p>
          <Input
            type="text"
            label="Search"
            className="search"
            isField={true}
            value={filters.regNo}
            onChange={(ev) =>
              setFilters({ ...filters, regNo: ev.target.value })
            }
          />
          {students
            .filter(({ regNo }) => regNo.includes(filters.regNo))
            .map(({ regNo }) => (
              <Input
                label={regNo}
                key={regNo}
                type="checkbox"
                value={regNo}
                layoutType="inline"
                checked={values.regNos.includes(regNo)}
                onChange={(ev) =>
                  changeHandler(ev.target.checked, "regNos", regNo)
                }
              />
            ))}
        </div>
        <div className="periods-container">
          <p>Periods</p>
          {[1, 2, 3, 4, 5, 6, 7].map((hour) => (
            <Input
              label={hour}
              type="checkbox"
              layoutType="inline"
              value={hour}
              checked={values.hours.includes(hour)}
              onChange={(ev) => changeHandler(ev.target.checked, "hours", hour)}
            />
          ))}
        </div>
        <button
          disabled={
            !(
              values.days.length > 0 &&
              values.regNos.length > 0 &&
              values.hours.length > 0
            )
          }
          onClick={addHandler}
        >
          Add
        </button>
      </div>
      {odData.length != 0 && (
        <div className="od-result-container">
          <CustomTable titles={["S.No", "Date", "Period", "Reg No", "Actions"]}>
            {odData.map((OD, index) => (
              <tr>
                <td>{index + 1}</td>
                <td>{dateFormatter(OD.date)}</td>
                <td>{OD.hour}</td>
                <td>{OD.regNo}</td>
                <td>
                  <button className="small" onClick={() => removeHandler(OD)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </CustomTable>
          <Input
            type="file"
            label="Attatchement"
            layoutType="block"
            onChange={(ev) => setFile(ev.target)}
          />
          <button
            onClick={submitHandler}
            disabled={!(odData.length > 0 && file.files.length > 0)}
          >
            Submit
          </button>
        </div>
      )}
      {serverError && <small className="server-error">{serverError}</small>}
    </>
  );
};
