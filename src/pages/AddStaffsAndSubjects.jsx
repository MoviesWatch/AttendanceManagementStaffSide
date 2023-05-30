import axios from "axios";
import { useEffect, useState } from "react";
import { Select } from "../components/Select";
import { fetch } from "../helpers/fetch";
import { session } from "../helpers/getSession";
import AlertConfirm from "react-alert-confirm";
import "react-alert-confirm/lib/style.css";
export const AddStaffsAndSubjects = () => {
  const [facultyAndSubject, setFacultyAndSubject] = useState({
    classSubjectID: "",
    facultyID: "",
  });
  const [classesAndSubjects, setClassesAndSubjects] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [serverError, setServerError] = useState("");
  const faculty = session("faculty");
  useEffect(() => {
    fetch({
      url: `/classAndSubject/${faculty.classID}`,
      setError: setServerError,
      setResult: setClassesAndSubjects,
    });
    fetch({
      url: "/faculty",
      setResult: setFaculties,
      setError: setServerError,
    });
  }, []);

  const submitHandler = async (ev) => {
    ev.preventDefault();
    fetch({
      url: "/facultyAndSubject",
      method: "post",
      body: facultyAndSubject,
      setError: setServerError,
      setResult: AlertConfirm.alert,
    });
    setFacultyAndSubject({ classSubjectID: "", facultyID: "" });
  };
  if (!faculty.classID) return;
  return (
    <>
      <form action="">
        <Select
          label="Subject"
          options={classesAndSubjects.map(
            ({ subjectCode, subjectAcronym, classSubjectID }) => [
              subjectCode + " - " + subjectAcronym,
              classSubjectID,
            ]
          )}
          value={facultyAndSubject.classSubjectID}
          onChange={(ev) =>
            setFacultyAndSubject({
              ...facultyAndSubject,
              classSubjectID: ev.target.value,
            })
          }
        />
        <Select
          label="Faculty"
          options={faculties.map(({ facultyID, name }) => [
            facultyID + " - " + name,
            facultyID,
          ])}
          value={facultyAndSubject.facultyID}
          onChange={(ev) =>
            setFacultyAndSubject({
              ...facultyAndSubject,
              facultyID: ev.target.value,
            })
          }
        />
        <button
          disabled={
            !(facultyAndSubject.facultyID && facultyAndSubject.classSubjectID)
          }
          onClick={submitHandler}
        >
          Add
        </button>
      </form>
      {serverError && <small className="server-error">{serverError}</small>}
    </>
  );
};
