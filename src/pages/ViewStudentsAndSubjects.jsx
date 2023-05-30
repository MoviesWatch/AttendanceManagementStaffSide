import { useEffect, useState } from "react";
import { CustomTable } from "../components/CustomTable";
import { Select } from "../components/Select";
import { fetch } from "../helpers/fetch";
import { session } from "../helpers/getSession";
import "./../styles/studentsAndSubjects.scss";
import "react-alert-confirm/lib/style.css";
import AlertConfirm from "react-alert-confirm";
import { getStudentsAndSubjectsReport } from "../helpers/report";
export const ViewStudentsAndSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const departments = session("departments");
  const semesters = session("semesters");
  const [selectedClass, setSelectedClass] = useState({
    departmentCode: "",
    semester: "",
  });
  const [selectedSubject, setSelectedSubject] = useState("");
  const [serverError, setServerError] = useState("");
  const [students, setStudents] = useState([]);
  const faculty = session("faculty");

  const getHandler = (ev) => {
    ev?.preventDefault();
    fetch({
      url: `/classAndSubject/d_s/${selectedClass.departmentCode}/${selectedClass.semester}`,
      setResult: (result) => {
        setSubjects(result);
        if (result.length == 0) {
          setServerError("Nothing to show");
        }
      },
      setError: setServerError,
    });
    fetch({
      url: `/studentAndSubject/d_s/${selectedClass.departmentCode}/${selectedClass.semester}`,
      setResult: (result) => {
        setStudents(result);
        if (result.length == 0) {
          setServerError("Nothing to show");
        } else {
          setServerError("");
        }
      },
      setError: setServerError,
    });
  };
  const deleteHandler = async (regNo) => {
    const confirmance = await AlertConfirm("Are you sure?");
    if (!confirmance[0]) return;
    fetch({
      url: `/studentAndSubject/${regNo}/${selectedSubject}`,
      method: "delete",
      setError: setServerError,
      setResult: AlertConfirm.alert,
    });
    getHandler();
  };

  return (
    <>
      <form action="#">
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
      {students.length > 0 && (
        <>
          <form>
            <Select
              label="Subject"
              options={subjects.map(({ subject, classSubjectID }) => [
                subject,
                classSubjectID,
              ])}
              value={selectedSubject}
              onChange={(ev) => setSelectedSubject(ev.target.value)}
            />
          </form>
          <button
            onClick={() =>
              getStudentsAndSubjectsReport(
                students.filter(
                  ({ classSubjectID }) => classSubjectID == selectedSubject
                )
              )
            }
          >
            Download
          </button>
          {selectedSubject && (
            <CustomTable titles={["S.No", "Reg No", "Name", "Actions"]}>
              {students
                .filter(
                  ({ classSubjectID }) => classSubjectID == selectedSubject
                )
                .map((student, index) => (
                  <tr>
                    <td>{index + 1}</td>
                    <td>{student.regNo}</td>
                    <td>{student.name}</td>
                    {faculty.classID == student.classID ? (
                      <td>
                        <button
                          className="small"
                          onClick={() => deleteHandler(student.regNo)}
                        >
                          Remove
                        </button>
                      </td>
                    ) : (
                      " - "
                    )}
                  </tr>
                ))}
            </CustomTable>
          )}
        </>
      )}
      {serverError && <small className="server-error">{serverError}</small>}
    </>
  );
};
