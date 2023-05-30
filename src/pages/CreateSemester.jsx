import { useEffect, useState } from "react";
import { Input } from "../components/Input";
import { Select } from "../components/Select";
import { fetch } from "../helpers/fetch";
import "./../styles/createAcademicSemester.scss";
import "react-alert-confirm/lib/style.css";
import AlertConfirm from "react-alert-confirm";
export const CreateSemester = () => {
  const [semester, setSemester] = useState({
    startYear: new Date().getFullYear(),
    endYear: new Date().getFullYear() + 1,
    copyFrom: null,
    type: "",
    tables: [],
  });
  const [oldSemesters, setOldSemesters] = useState([]);
  const [serverError, setServerError] = useState("");
  useEffect(() => {
    fetch({
      url: "/academicSemester/api/academicSemester",
      setResult: setOldSemesters,
      setError: setServerError,
    });
  }, []);
  const addHandler = async (ev) => {
    ev.preventDefault();
    if (!(semester.startYear && semester.endYear && semester.type)) return;
    const confirmance = await AlertConfirm("Are you sure?");
    if (!confirmance[0]) return;
    fetch({
      url: "/academicSemester/api/academicSemester",
      method: "post",
      body: {
        name: semester.startYear + "-" + semester.endYear + "-" + semester.type,
        copyFrom: semester.copyFrom,
        tables: semester.tables,
      },
      setError: setServerError,
      setResult: AlertConfirm.alert,
    });
  };
  const tablesHandler = () => {
    setSemester({
      ...semester,
      tables: [...document.getElementsByName("tables")]
        .filter((el) => el.checked)
        .map((el) => el.value),
    });
  };
  return (
    <>
      <form action="" className="create-academic-semester-form">
        <Input
          type="number"
          min="2019"
          max="2100"
          label="Start year"
          layoutType="inline"
          isField={true}
          value={semester.startYear}
          onChange={(ev) =>
            setSemester({ ...semester, startYear: ev.target.value })
          }
        />
        <Input
          type="number"
          min="2019"
          max="2100"
          label="End year"
          layoutType="inline"
          isField={true}
          value={semester.endYear}
          onChange={(ev) =>
            setSemester({ ...semester, endYear: ev.target.value })
          }
        />
        <Select
          label="Even or odd"
          options={[
            ["Even", "even"],
            ["Odd", "odd"],
          ]}
          layoutType="inline"
          value={semester.type}
          onChange={(ev) => setSemester({ ...semester, type: ev.target.value })}
        />
        <Select
          label="Copy from"
          options={oldSemesters.map(({ name, databaseName }) => [
            name,
            databaseName,
          ])}
          layoutType="inline"
          value={semester.copyFrom}
          onChange={(ev) =>
            setSemester({ ...semester, copyFrom: ev.target.value })
          }
        />
        <div className="tables-container">
          <p>Copy</p>
          <Input
            type="checkbox"
            label="Students"
            name="tables"
            value="students"
            onChange={tablesHandler}
            disabled={!semester.copyFrom}
          />
          <Input
            type="checkbox"
            name="tables"
            label="Faculties"
            value="faculties"
            onChange={tablesHandler}
            disabled={!semester.copyFrom}
          />
          <Input
            type="checkbox"
            name="tables"
            label="Subjects"
            value="subjects"
            onChange={tablesHandler}
            disabled={!semester.copyFrom}
          />
        </div>
        <button
          disabled={!(semester.startYear && semester.endYear && semester.type)}
          onClick={addHandler}
        >
          Create
        </button>
      </form>
      {serverError && <small className="server-error">{serverError}</small>}
    </>
  );
};
