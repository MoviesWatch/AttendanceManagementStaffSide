import { useEffect } from "react";
import { useState } from "react";
import { Input } from "../components/Input";
import { Select } from "../components/Select";
import { days } from "../helpers/date";
import { fetch } from "../helpers/fetch";
import { session } from "../helpers/getSession";
import "react-alert-confirm/lib/style.css";
import AlertConfirm from "react-alert-confirm";
export const AddWorkingDays = () => {
  const faculty = session("faculty");
  const [value, setValue] = useState({
    date: "",
    day: "",
  });
  const [serverError, setServerError] = useState("");
  const addHandler = (ev) => {
    ev.preventDefault();
    value.classID = faculty.classID;
    fetch({
      url: "/workingDay",
      method: "post",
      body: value,
      setError: setServerError,
      setResult: AlertConfirm.alert,
    });
  };
  if (!faculty.classID) return;
  return (
    <>
      <form>
        <Input
          type="date"
          layoutType="inline"
          isField={true}
          label="Date"
          value={value.date}
          onChange={(ev) =>
            setValue({
              date: ev.target.value,
              day: new Date(ev.target.value).getDay(),
            })
          }
        />
        <Select
          options={Object.entries(days).map((day) => day.reverse())}
          label="Day"
          layoutType="inline"
          value={value.day}
          onChange={(ev) => setValue({ ...value, day: ev.target.value })}
        />
        <button
          disabled={!(value.date && value.day < 6 && value.day > 0)}
          onClick={addHandler}
        >
          Add
        </button>
      </form>
      {serverError && <small className="server-error">{serverError}</small>}
    </>
  );
};
