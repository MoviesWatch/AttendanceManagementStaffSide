import { useEffect, useState } from "react";
import { Input } from "../components/Input";
import { PaginatedTable } from "../components/PaginatedTable";
import { Select } from "../components/Select";
import { fetch } from "../helpers/fetch";
import { session } from "../helpers/getSession";
import "react-alert-confirm/lib/style.css";
import AlertConfirm from "react-alert-confirm";
import { getFacultiesAndSubjectsReport } from "../helpers/report";
export const ViewStaffsAndSubjects = () => {
  const [facultiesAndSubjects, setFacultiesAndSubjects] = useState([]);

  const faculty = session("faculty");
  const [filters, setFilters] = useState({
    subjectCode: "",
    subject: "",
    semester: "",
    departmentCode: "",
    facultyID: "",
    department: "",
    name: "",
  });
  const filterFunction = ({
    facultyID,
    name,
    subjectCode,
    subject,
    departmentCode,
    semester,
  }) =>
    subjectCode.toLowerCase().includes(filters.subjectCode) &&
    subject.toLowerCase().includes(filters.subject) &&
    departmentCode.includes(filters.departmentCode) &&
    ("" + semester).includes("" + filters.semester) &&
    facultyID.toLowerCase().includes(filters.facultyID) &&
    name.toLowerCase().includes(filters.name);

  const departments = session("departments");
  const semesters = session("semesters");
  const [serverError, setServerError] = useState("");
  const getHandler = () => {
    fetch({
      url: "/facultyAndSubject",
      setError: setServerError,
      setResult: (result) => {
        setFacultiesAndSubjects(result);
        if (result.length == 0) {
          setServerError("Nothing to show");
        } else {
          setServerError("");
        }
      },
    });
  };
  useEffect(() => {
    getHandler();
  }, []);
  const deleteHandler = async (facultyAndSubject) => {
    const confirmance = await AlertConfirm("Are you sure?");
    if (!confirmance[0]) return;
    fetch({
      url: `/facultyAndSubject/${facultyAndSubject.classSubjectID}/${facultyAndSubject.facultyID}`,
      method: "delete",
      setError: setServerError,
      setResult: AlertConfirm.alert,
    });
    getHandler();
  };
  const renderFunction = (facultyAndSubject) => {
    return (
      <>
        <td>{facultyAndSubject.facultyID}</td>
        <td>{facultyAndSubject.name}</td>
        <td>{facultyAndSubject.departmentCode}</td>
        <td>{facultyAndSubject.semester}</td>
        <td>{facultyAndSubject.subjectCode}</td>
        <td>{facultyAndSubject.subject}</td>
        <td>
          {faculty.accessID == 2 &&
          faculty.classID == facultyAndSubject.classID ? (
            <button
              className="small"
              onClick={() => deleteHandler(facultyAndSubject)}
            >
              Remove
            </button>
          ) : (
            "-"
          )}
        </td>
      </>
    );
  };
  //generateReport(facultiesAndSubjects.filter(fiterFunction));
  return (
    <>
      {facultiesAndSubjects.length > 0 && (
        <>
          <div className="filters-container">
            <p className="heading">
              Filters:<small> use any of the fields</small>
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
              <Input
                layoutType="inline"
                label="Faculty ID"
                isField={true}
                type="text"
                value={filters.facultyID}
                onChange={(ev) => {
                  setFilters({ ...filters, facultyID: ev.target.value });
                }}
              />
              <Input
                layoutType="inline"
                label="Name"
                isField={true}
                type="text"
                value={filters.name}
                onChange={(ev) => {
                  setFilters({ ...filters, name: ev.target.value });
                }}
              />
            </form>
          </div>
          <button
            onClick={() =>
              getFacultiesAndSubjectsReport(
                facultiesAndSubjects.filter(filterFunction)
              )
            }
          >
            Download
          </button>
          <PaginatedTable
            titles={[
              "Faculty ID",
              "Name",
              "Department",
              "Semester",
              "subject code",
              "Subject",
              "Actions",
            ]}
            renderFunction={renderFunction}
            resetTrigger={filters}
            data={facultiesAndSubjects.filter(filterFunction)}
          />
        </>
      )}
      {serverError && <small className="server-error">{serverError}</small>}
    </>
  );
};
