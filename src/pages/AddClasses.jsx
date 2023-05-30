import { useEffect, useState } from "react";
import AlertConfirm from "react-alert-confirm";
import "react-alert-confirm/lib/style.css";
import { Input } from "../components/Input";
import { Select } from "../components/Select";
import { fetch } from "../helpers/fetch";

export const AddClasses = () => {
  const [semesters, setSemesters] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [serverError, setServerError] = useState("");
  const [_class, setClass] = useState("");
  useEffect(() => {
    fetch({
      url: "/department",
      setError: setServerError,
      setResult: setDepartments,
    });
    fetch({
      url: "/semester",
      setError: setServerError,
      setResult: setSemesters,
    });
  }, []);
  const addHandler = (ev) => {
    ev.preventDefault();
    fetch({
      url: "/class",
      method: "post",
      body: _class,
      setError: setServerError,
      setResult: AlertConfirm.alert,
    });
  };
  return (
    <>
      <form action="#">
        <Select
          layoutType="inline"
          label="Department"
          options={departments.map(({ department, departmentCode }) => [
            department,
            departmentCode,
          ])}
          onChange={(ev) =>
            setClass({ ..._class, departmentCode: ev.target.value })
          }
        />
        <Select
          layoutType="inline"
          label="Semester"
          options={semesters.map(({ semester }) => [semester, semester])}
          onChange={(ev) => setClass({ ..._class, semester: ev.target.value })}
        />
        <button
          disabled={!(_class.departmentCode && _class.semester)}
          onClick={addHandler}
        >
          Add
        </button>
      </form>
      {serverError && <small className="server-error">{serverError}</small>}
    </>
  );
};
