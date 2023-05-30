import { useEffect, useState } from "react";
import { Input } from "../components/Input";
import { PaginatedTable } from "../components/PaginatedTable";
import { Select } from "../components/Select";
import { fetch } from "../helpers/fetch";
import "react-alert-confirm/lib/style.css";
import AlertConfirm from "react-alert-confirm";
import { session } from "../helpers/getSession";
import { getClassesAndSubjectsReport } from "../helpers/report";
export const ViewClassesAndSubjects = () => {
  const faculty = session("faculty");
  const [subjects, setSubjects] = useState([]);
  const [subjectTypes, setSubjectTypes] = useState([]);
  const [serverError, setServerError] = useState("");
  const departments = session("departments");
  const semesters = session("semesters");
  const [filters, setFilters] = useState({
    subjectCode: "",
    subjectAcronym: "",
    subject: "",
    semester: "",
    departmentCode: "",
    typeID: "",
  });
  const getHandler = () => {
    fetch({
      url: "/classAndSubject",
      setError: setServerError,
      setResult: (result) => {
        setSubjects(result);
        if (result.length == 0) {
          setServerError("Nothing to show");
        } else {
          setServerError("");
        }
      },
    });
  };
  const removeHandler = async (subject) => {
    const confirmance = await AlertConfirm("Are you sure?");
    if (!confirmance[0]) return;
    fetch({
      url: `/classAndSubject/${subject.classSubjectID}`,
      setError: setServerError,
      method: "delete",
      setResult: (result) => {
        AlertConfirm.alert(result);
      },
    });
    getHandler();
  };
  const filterFunction = ({
    subjectCode,
    subject,
    departmentCode,
    semester,
    typeID,
  }) =>
    subjectCode.toLowerCase().includes(filters.subjectCode) &&
    subject.toLowerCase().includes(filters.subject) &&
    departmentCode.includes(filters.departmentCode) &&
    ("" + semester).includes("" + filters.semester) &&
    ("" + typeID).includes("" + filters.typeID);

  useEffect(() => {
    getHandler();
    fetch({
      url: "/subjectType",
      setError: setServerError,
      setResult: setSubjectTypes,
    });
  }, []);

  const renderFunction = (subject) => {
    return (
      <>
        <td>{subject.departmentCode}</td>
        <td>{subject.semester}</td>
        <td>{subject.subjectCode}</td>
        <td>
          {subject.subject + (subject.batch ? "-B-" + subject.batch : "")}
        </td>
        <td>
          {subject.subjectAcronym +
            (subject.batch ? "-B-" + subject.batch : "")}
        </td>
        <td>{subject.type}</td>
        {faculty.accessID == 2 && (
          <td>
            {faculty.classID == subject.classID ? (
              <>
                <button
                  className="small"
                  onClick={() => removeHandler(subject)}
                >
                  Remove
                </button>
              </>
            ) : (
              "--"
            )}
          </td>
        )}
      </>
    );
  };
  return (
    <>
      {subjects.length > 0 && (
        <>
          <div className="filters-container">
            <p className="heading">
              Filters<small>(Use any of the fields)</small>
            </p>
            <form action="#">
              <Input
                layoutType="inline"
                label="Subject code"
                isField={true}
                type="text"
                value={filters.subjectCode}
                onChange={(ev) => {
                  setFilters({ ...filters, subjectCode: ev.target.value });
                }}
              />
              <Input
                layoutType="inline"
                label="Subject"
                isField={true}
                type="text"
                value={filters.subject}
                onChange={(ev) => {
                  setFilters({ ...filters, subject: ev.target.value });
                }}
              />
              <Select
                layoutType="inline"
                label="Department"
                options={departments.map(({ department, departmentCode }) => [
                  department,
                  departmentCode,
                ])}
                value={filters.departmentCode}
                onChange={(ev) => {
                  setFilters({ ...filters, departmentCode: ev.target.value });
                }}
              />
              <Select
                layoutType="inline"
                label="Semester"
                options={semesters.map((semester) => [semester, semester])}
                value={filters.semester}
                onChange={(ev) => {
                  setFilters({ ...filters, semester: ev.target.value });
                }}
              />
              <Select
                layoutType="inline"
                label="Type"
                options={subjectTypes.map(({ typeID, type }) => [type, typeID])}
                value={filters.typeID}
                onChange={(ev) => {
                  setFilters({ ...filters, typeID: ev.target.value });
                }}
              />
            </form>
          </div>
          <button
            onClick={() =>
              getClassesAndSubjectsReport(subjects.filter(filterFunction))
            }
          >
            Download
          </button>
          <PaginatedTable
            titles={(() => {
              const titles = [
                "Department",
                "Semester",
                "Subject code",
                "Subject name",
                "Subject acronym",
                "Type",
              ];
              if (faculty.accessID == 2) {
                titles.push("Actions");
              }
              return titles;
            })()}
            data={subjects.filter(filterFunction)}
            renderFunction={renderFunction}
            resetTrigger={filters}
          />
        </>
      )}
      {serverError && <small className="server-error">{serverError}</small>}
    </>
  );
};
