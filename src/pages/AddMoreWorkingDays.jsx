import { useState } from "react";
import { Input } from "../components/Input";
import { Select } from "../components/Select";
import { fetch } from "../helpers/fetch";
import { session } from "../helpers/getSession";
import "./../styles/addMoreWorkingDays.scss";
import AlertConfirm from "react-alert-confirm";
import "react-alert-confirm/lib/style.css";
export const AddMoreWorkingDays = () => {
  const faculty = session("faculty");
  const [range, setRange] = useState({
    start: "",
    end: "",
  });
  const [inBetweenDays, setInBetweenDays] = useState([]);
  const [workingDays, setWorkingDays] = useState([]);
  const [serverError, setServerError] = useState("");
  const getDays = (ev) => {
    ev.preventDefault();
    const startDate = new Date(range.start);
    const endDate = new Date(range.end);
    while (startDate <= endDate) {
      const dayObj = {
        date: startDate.toISOString().split("T")[0],
        day: startDate.getDay(),
        classID: faculty.classID,
      };
      inBetweenDays.push(dayObj);
      if (dayObj.day < 6 && dayObj.day > 0) {
        workingDays.push(dayObj);
      }
      startDate.setDate(startDate.getDate() + 1);
    }
    setInBetweenDays([...inBetweenDays]);
    setWorkingDays([...workingDays]);
  };
  const submitHandler = () => {
    if (workingDays.length <= 0) return;
    fetch({
      url: "/workingDay/addMore",
      body: workingDays,
      method: "post",
      setError: setServerError,
      setResult: AlertConfirm.alert,
    });
  };
  if (!faculty.classID) return;
  return (
    <>
      <form action="">
        <Input
          type="date"
          layoutType="inline"
          isField={true}
          label="Start date"
          value={range.start}
          onChange={(ev) => setRange({ ...range, start: ev.target.value })}
        />
        <Input
          type="date"
          layoutType="inline"
          isField={true}
          value={range.end}
          label="End date"
          onChange={(ev) => setRange({ ...range, end: ev.target.value })}
        />
        <button onClick={getDays}>Proceed</button>
      </form>
      <div className="working-days-container">
        {inBetweenDays.map((dayObj, index) => (
          <div className="day-container">
            <p>{index + 1 + "."}</p>
            <input
              type="checkbox"
              checked={workingDays.includes(dayObj)}
              onChange={(ev) => {
                if (ev.target.checked) {
                  if (dayObj.day <= 0 || dayObj.day > 5) {
                    dayObj.day = 1;
                  }
                  workingDays.push(dayObj);
                  setWorkingDays([...workingDays]);
                } else {
                  setWorkingDays((workingDays) =>
                    workingDays.filter((day) => day !== dayObj)
                  );
                }
              }}
            />
            <p>{dayObj.date.split("-").reverse().join(" / ")}</p>
            <Select
              disabled={!workingDays.includes(dayObj)}
              options={[
                ["Sun", 0],
                ["Mon", 1],
                ["Tue", 2],
                ["Wed", 3],
                ["Thu", 4],
                ["Fri", 5],
                ["Sat", 6],
              ]}
              value={dayObj.day}
              onChange={(ev) => {
                const day = ev.target.value;
                if (day > 0 && day < 6) {
                  dayObj.day = day;
                  setInBetweenDays([...inBetweenDays]);
                }
              }}
            />
          </div>
        ))}
      </div>
      {workingDays.length > 0 && (
        <button className="submit-working-days" onClick={submitHandler}>
          Submit
        </button>
      )}
      {serverError && <small className="server-error">{serverError}</small>}
    </>
  );
};
