import { useEffect, useState } from "react";
import { Input } from "../components/Input";
import { Select } from "../components/Select";
import { fetch } from "../helpers/fetch";
import { session } from "../helpers/getSession";
import "./../styles/add.scss";
import AlertConfirm from "react-alert-confirm";
import "react-alert-confirm/lib/style.css";
export const AddClassesAndSubjects = () => {
  const faculty = session("faculty");
  const [subjects, setSubjects] = useState([]);
  const [subjectTypes, setSubjectTypes] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [typeID, setTypeID] = useState("");
  const [batch, setBatch] = useState("");
  const [serverError, setServerError] = useState("");
  const [searchValue, setSearchValue] = useState("");
  useEffect(() => {
    fetch({
      url: "/subject",
      setResult: setSubjects,
      setError: setServerError,
    });
    fetch({
      url: "/subjectType",
      setResult: setSubjectTypes,
      setError: setServerError,
    });
  }, []);

  const submitHandler = (ev) => {
    ev.preventDefault();
    const classesAndSubjects = selectedSubjects.map((subject) => {
      const classAndSubject = {
        subjectCode: subject,
        typeID: typeID,
        classID: faculty.classID,
      };
      if (batch != "") {
        classAndSubject.batch = batch;
      }
      return classAndSubject;
    });
    fetch({
      url: "/classAndSubject/addMore",
      method: "post",
      body: classesAndSubjects,
      setError: setServerError,
      setResult: AlertConfirm.alert,
    });
    setSelectedSubjects([]);
  };

  if (!faculty.classID) return;
  return (
    <>
      <div className="add-container add-classes-and-subjects-container">
        <form>
          <div className="inputs-conatiner">
            <Input
              type="text"
              value={searchValue}
              onChange={(ev) => setSearchValue(ev.target.value)}
              label="Search subjects"
              isField={true}
            />
            <div className="inputs">
              {subjects
                .filter(
                  ({ subject, subjectCode }) =>
                    subjectCode.toLowerCase().includes(searchValue) ||
                    subject.toLowerCase().includes(searchValue)
                )
                .map((subject) => (
                  <Input
                    type="checkbox"
                    label={subject.subjectCode + " - " + subject.subject}
                    checked={selectedSubjects.includes(subject.subjectCode)}
                    value={subject.subjectCode}
                    onChange={(ev) => {
                      if (ev.target.checked) {
                        selectedSubjects.push(subject.subjectCode);
                      } else {
                        selectedSubjects.splice(
                          selectedSubjects.indexOf(subject.subjectCode),
                          1
                        );
                      }
                      setSelectedSubjects([...selectedSubjects]);
                    }}
                  />
                ))}
            </div>
          </div>
          <Select
            layoutType="inline"
            label="Type"
            options={subjectTypes.map(({ typeID, type }) => [type, typeID])}
            value={typeID}
            onChange={(ev) => setTypeID(ev.target.value)}
          />
          <Input
            type="number"
            value={batch}
            onChange={(ev) => setBatch(ev.target.value)}
            label="Batch"
            isField={true}
          />
          <button
            disabled={!(selectedSubjects.length > 0 && typeID)}
            onClick={submitHandler}
          >
            Add
          </button>
        </form>
      </div>
      {serverError && <small className="server-error">{serverError}</small>}
    </>
  );
};
