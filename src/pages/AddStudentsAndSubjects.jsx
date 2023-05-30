import { Check } from "@mui/icons-material";
import { useEffect } from "react";
import { useState } from "react";
import AlertConfirm from "react-alert-confirm";
import "react-alert-confirm/lib/style.css";
import { Input } from "../components/Input";
import { Select } from "../components/Select";
import { fetch } from "../helpers/fetch";
import { session } from "../helpers/getSession";

export const AddStudentsAndSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [serverError, setServerError] = useState("");
  const faculty = session("faculty");
  const [regNoFilter, setRegNoFilter] = useState("");
  const [values, setValues] = useState({
    subjects: [],
    regNos: [],
  });
  const [checkAll, setCheckAll] = useState(false);
  useEffect(() => {
    fetch({
      url: `/classAndSubject/${faculty.classID}`,
      setResult: setSubjects,
      setError: setServerError,
    });
    fetch({
      url: `/student/c/${faculty.classID}`,
      setResult: (result) =>
        setStudents(result.filter(({ inactive }) => inactive === null)),
      setError: setServerError,
    });
  }, []);
  const changeHandler = (checked, key, value) => {
    if (checked) {
      values[key].push(value);
    } else {
      values[key].splice(values[key].indexOf(value), 1);
    }
    setValues({ ...values });
  };
  const submitHandler = () => {
    const studentsAndSubjectsData = [];
    values.subjects.forEach(({ classSubjectID }) => {
      values.regNos.forEach((regNo) => {
        studentsAndSubjectsData.push({
          classSubjectID,
          regNo,
        });
      });
    });
    fetch({
      url: "/studentAndSubject/addMore",
      method: "post",
      body: studentsAndSubjectsData,
      setError: setServerError,
      setResult: AlertConfirm.alert,
    });
    setValues({
      regNos: [],
      subjects: [],
    });
    setCheckAll(false);
  };
  if (!faculty.classID) return;

  return (
    <>
      <div className="add-students-and-subjects-container">
        <div className="days-container">
          <p>Subjects</p>
          {subjects.map((subject) => (
            <Input
              type="checkbox"
              key={subject.classSubjectID}
              label={
                subject.subject + (subject.batch ? "-B-" + subject.batch : "")
              }
              layoutType="inline"
              checked={values.subjects.includes(subject)}
              onChange={(ev) =>
                changeHandler(ev.target.checked, "subjects", subject)
              }
            />
          ))}
        </div>
        <div className="students-container">
          <p>Reg No</p>{" "}
          <Input
            label="Select all"
            type="checkbox"
            layoutType="inline"
            checked={checkAll}
            onChange={(ev) => {
              if (ev.target.checked) {
                values.regNos = students.map(({ regNo }) => regNo);
              } else {
                values.regNos = [];
              }
              setCheckAll((checkAll) => !checkAll);
            }}
          />
          <Input
            type="text"
            label="Search"
            className="search"
            isField={true}
            value={regNoFilter}
            onChange={(ev) => setRegNoFilter(ev.target.value)}
          />
          {students
            .filter(({ regNo }) => regNo.includes(regNoFilter))
            .map(({ regNo }) => (
              <Input
                label={regNo}
                key={regNo}
                type="checkbox"
                layoutType="inline"
                checked={values.regNos.includes(regNo)}
                onChange={(ev) =>
                  changeHandler(ev.target.checked, "regNos", regNo)
                }
              />
            ))}
        </div>
        <button
          onClick={submitHandler}
          disabled={!(values.subjects.length > 0 && values.regNos.length > 0)}
        >
          Submit
        </button>
      </div>
      {serverError && <small className="server-error">{serverError}</small>}
    </>
  );
};
