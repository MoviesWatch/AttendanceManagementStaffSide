import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { PaginatedTable } from "../components/PaginatedTable";
import { fetch } from "../helpers/fetch";
import { session } from "../helpers/getSession";
import AlertConfirm from "react-alert-confirm";
import { getFacultyReport } from "../helpers/report";
import { Input } from "../components/Input";
export const ViewStaffs = () => {
  const [faculties, setFaculties] = useState([]);
  const [filters, setFilters] = useState({
    facultyID: "",
    name: "",
  });
  const currentFaculty = session("faculty");
  const [serverError, setServerError] = useState("");
  const getHandler = () => {
    fetch({
      url: "/faculty/all",
      setResult: (result) => {
        setFaculties(result);
        if (result.length == 0) {
          setServerError("Nothing to show");
        } else {
          setServerError("");
        }
      },
      setError: setServerError,
    });
  };
  useEffect(() => {
    getHandler();
  }, []);

  const inactiveHandler = async (faculty) => {
    const confirmance = await AlertConfirm("Are you sure?");
    if (!confirmance[0]) return;
    fetch({
      url: `/faculty/${faculty.facultyID}`,
      method: "delete",
      setError: setServerError,
      setResult: AlertConfirm.alert,
    });
    getHandler();
  };
  const filterFuction = (faculty) =>
    faculty.facultyID.includes(filters.facultyID) &&
    faculty.name.toLowerCase().includes(filters.name);
  const activeHandler = async (faculty) => {
    const confirmance = await AlertConfirm("Are you sure?");
    if (!confirmance[0]) return;
    fetch({
      url: `/faculty/retrive/${faculty.facultyID}`,
      method: "put",
      setError: setServerError,
      setResult: AlertConfirm.alert,
    });
    getHandler();
  };
  const deleteHandler = async (faculty) => {
    const confirmance = await AlertConfirm("Are you sure?");
    if (!confirmance[0]) return;
    fetch({
      url: `/faculty/permanentDelete/${faculty.facultyID}`,
      method: "delete",
      setError: setServerError,
      setResult: AlertConfirm.alert,
    });
    getHandler();
  };

  const renderFunction = (faculty) => {
    return (
      <>
        <td>{faculty.facultyID}</td>
        <td>{faculty.name}</td>
        <td>{faculty.email || "-"}</td>
        <td>{faculty.mobile || "-"}</td>
        <td>{faculty.departmentCode || "-"}</td>
        <td>{faculty.semester || "-"}</td>
        <td>{faculty.access}</td>
        <td>
          {faculty.inactive ? `Inactive from ${faculty.inactive}` : "Active"}
        </td>
        {currentFaculty.accessID == 5 && (
          <td>
            <>
              <button className="small">
                <NavLink to="/faculties/edit" state={faculty}>
                  Edit
                </NavLink>
              </button>
              {currentFaculty.facultyID != faculty.facultyID && (
                <>
                  <button className="small">
                    <NavLink
                      to="/changeFacultyPassword"
                      state={{ url: "/faculty", user: faculty.facultyID }}
                    >
                      Change password
                    </NavLink>
                  </button>
                  <button
                    className={"small " + (faculty.inactive ? "inactive" : "")}
                    onClick={() => {
                      faculty.inactive
                        ? activeHandler(faculty)
                        : inactiveHandler(faculty);
                    }}
                  >
                    Active
                  </button>
                  <button
                    className="small"
                    onClick={() => deleteHandler(faculty)}
                  >
                    Remove
                  </button>
                </>
              )}
            </>
          </td>
        )}
      </>
    );
  };

  return (
    <>
      {faculties.length > 0 && (
        <>
          <div className="filters-container">
            <p className="heading">
              Filters:<small> use any of the fields</small>
            </p>
            <form action="">
              <Input
                type="text"
                label="Faculty ID"
                isField={true}
                value={filters.facultyID}
                onChange={(ev) => {
                  setFilters({ ...filters, facultyID: ev.target.value });
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
            onClick={() => getFacultyReport(faculties.filter(filterFuction))}
          >
            Download
          </button>
          <PaginatedTable
            titles={(() => {
              const titles = [
                "Faculty ID",
                "Name",
                "Email",
                "Mobile",
                "Department",
                "Semester",
                "Access",
                "State",
              ];
              if (currentFaculty.accessID == 5) {
                titles.push("Actions");
              }
              return titles;
            })()}
            renderFunction={renderFunction}
            data={faculties.filter(filterFuction)}
            resetTrigger={filters}
          />
        </>
      )}
      {serverError && <small className="server-error">{serverError}</small>}
    </>
  );
};
