import { Input } from "../components/Input";
import "./../styles/login.scss";
import "./../styles/home.scss";
import "./../styles/button.scss";
import { useEffect, useState } from "react";
import { Select } from "../components/Select";
import { NavLink } from "react-router-dom";
import { dateFormatter } from "../helpers/date";
import { fetch } from "../helpers/fetch";
import { PaginatedTable } from "../components/PaginatedTable";
import { session } from "../helpers/getSession";
import "react-alert-confirm/lib/style.css";
import AlertConfirm from "react-alert-confirm";
import { getStudentsReport } from "../helpers/report";
export const ViewStudents = () => {
  const faculty = session("faculty");
  const [students, setStudents] = useState([]);
  const departements = session("departments");
  const semesters = session("semesters");
  const [filters, setFilters] = useState({
    regNo: "",
    name: "",
  });
  const [inputValues, setInputValues] = useState({
    departmentCode: "",
    semester: "",
  });
  const [serverError, setServerError] = useState("");
  const filterFunction = (student) =>
    student.regNo.includes(filters.regNo) &&
    student.name.toLowerCase().includes(filters.name);
  const sortFunction = (student1, student2) => student1.regNo > student2.regNo;
  const renderFunction = (student) => (
    <>
      <td>{student.regNo}</td>
      <td>{student.name}</td>
      <td>{student.gender}</td>
      <td>{dateFormatter(student.dateOfBirth)}</td>
      <td>{student.semester}</td>
      <td>{student.departmentCode}</td>
      <td>{student.mobile || "-"}</td>
      <td>{student.email || "-"}</td>
      <td>{student.parentName || "-"}</td>
      <td>{student.parentMobile || "-"}</td>
      <td>{dateFormatter(student.dateJoined)}</td>
      <td>
        {student.inactive
          ? `Inactive from ${dateFormatter(student.inactive)}`
          : "Active"}
      </td>

      {faculty.accessID == 2 && (
        <td>
          {faculty.classID == student.classID ? (
            <>
              <button className="small">
                <NavLink to="/students/edit" state={student}>
                  Edit
                </NavLink>
              </button>
              <button className="small">
                <NavLink
                  to="/changeStudentPassword"
                  state={{ url: "/student", user: student.regNo }}
                >
                  Change password
                </NavLink>
              </button>
              <button
                className="small"
                disabled={student.inactive}
                onClick={() => deleteHandler("inactive", student)}
              >
                Inactive
              </button>
              <button
                className="small"
                onClick={() => deleteHandler("delete", student)}
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

  const getHandler = (ev) => {
    ev?.preventDefault();
    if (!(inputValues.departmentCode && inputValues.semester)) return;
    fetch({
      url: `/student/d_s/${inputValues.departmentCode}/${inputValues.semester}`,
      setError: setServerError,
      setResult: (result) => {
        setStudents(result);
        if (result.length == 0) {
          setServerError("Nothing to show");
        } else {
          setServerError("");
        }
      },
      sortFunction,
    });
  };

  const deleteHandler = async (type, student) => {
    if (type == "inactive") {
      const confirmance = await AlertConfirm("Are you sure?");
      if (!confirmance[0]) return;
      fetch({
        url: `/student/${student.regNo}`,
        method: "delete",
        setError: setServerError,
        setResult: AlertConfirm.alert,
      });
    } else {
      const confirmance = await AlertConfirm("Are you sure?");
      if (!confirmance[0]) return;
      fetch({
        url: `/student/permanentDelete/${student.regNo}`,
        method: "delete",
        setError: setServerError,
        setResult: AlertConfirm.alert,
      });
    }
    getHandler();
  };

  return (
    <>
      <form>
        <Select
          layoutType="inline"
          label="Department"
          options={departements.map(({ department, departmentCode }) => [
            department,
            departmentCode,
          ])}
          value={inputValues.departmentCode}
          onChange={(ev) =>
            setInputValues({ ...inputValues, departmentCode: ev.target.value })
          }
        />
        <Select
          layoutType="inline"
          label="Semester"
          value={inputValues.semester}
          options={semesters.map((semester) => [semester, semester])}
          onChange={(ev) =>
            setInputValues({ ...inputValues, semester: ev.target.value })
          }
        />
        <button
          disabled={!(inputValues.departmentCode && inputValues.semester)}
          onClick={getHandler}
        >
          Get
        </button>
      </form>
      {students.length > 0 && (
        <>
          <div className="filters-container">
            <p className="heading">
              Filters:<small> use any of the fields</small>
            </p>
            <form action="">
              <Input
                type="text"
                label="Reg No"
                isField={true}
                value={filters.regNo}
                onChange={(ev) => {
                  setFilters({ ...filters, regNo: ev.target.value });
                }}
              />
              <Input
                type="text"
                label="Name"
                isField={true}
                value={filters.name}
                onChange={(ev) => {
                  setFilters({ ...filters, name: ev.target.value });
                }}
              />
            </form>
          </div>
          <button
            onClick={() => getStudentsReport(students.filter(filterFunction))}
          >
            Download
          </button>
          <PaginatedTable
            titles={(() => {
              const titles = [
                "Reg No",
                "Name",
                "Gender",
                "Date of birth",
                "Semester",
                "Department",
                "Mobile",
                "Email",
                "Parent name",
                "Parent mobile",
                "Joined date",
                "State",
              ];
              if (faculty.accessID == 2) {
                titles.push("Actions");
              }
              return titles;
            })()}
            data={students.filter(filterFunction)}
            renderFunction={renderFunction}
            resetTrigger={filters}
          />
        </>
      )}
      {serverError && <small className="server-error">{serverError}</small>}
    </>
  );
};
