import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Input } from "../components/Input";
import { PaginatedTable } from "../components/PaginatedTable";
import { fetch } from "../helpers/fetch";
import { session } from "../helpers/getSession";
import "react-alert-confirm/lib/style.css";
import AlertConfirm from "react-alert-confirm";
import { getSubjectsReport } from "../helpers/report";
export const ViewSubjects = () => {
  const faculty = session("faculty");
  const [subjects, setSubjects] = useState([]);
  const [serverError, setServerError] = useState("");
  const [filters, setFilters] = useState({
    subjectCode: "",
    subjectAcronym: "",
    subject: "",
  });
  const getHandler = () => {
    fetch({
      url: "/subject",
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
  const removeHandler = async (subjectCode) => {
    const confirmance = await AlertConfirm("Are you sure?");
    if (!confirmance[0]) return;
    fetch({
      url: `/subject/${subjectCode}`,
      method: "delete",
      setError: setServerError,
      setResult: AlertConfirm.alert,
    });
    getHandler();
  };

  const filterFuction = ({ subjectCode, subject, subjectAcronym }) =>
    subjectCode.toLowerCase().includes(filters.subjectCode) &&
    subjectAcronym.toLowerCase().includes(filters.subjectAcronym) &&
    subject.toLowerCase().includes(filters.subject);

  useEffect(() => {
    getHandler();
  }, []);
  const renderFunction = (subject) => (
    <>
      <td>{subject.subjectCode}</td>
      <td>{subject.subject}</td>
      <td>{subject.subjectAcronym}</td>

      {faculty.accessID == 5 && (
        <td>
          <>
            <button className="small">
              <NavLink to="/subjects/edit" state={subject}>
                Edit
              </NavLink>
            </button>
            <button
              className="small"
              onClick={() => removeHandler(subject.subjectCode)}
            >
              Remove
            </button>
          </>
        </td>
      )}
    </>
  );

  return (
    <>
      {subjects.length > 0 && (
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
              <Input
                layoutType="inline"
                label="Subject acronym"
                isField={true}
                type="text"
                value={filters.subjectAcronym}
                onChange={(ev) => {
                  setFilters({ ...filters, subjectAcronym: ev.target.value });
                }}
              />
            </form>
          </div>
          <button
            onClick={() => getSubjectsReport(subjects.filter(filterFuction))}
          >
            Download
          </button>
          <PaginatedTable
            titles={(() => {
              const titles = [
                "Subject code",
                "Subject name",
                "Subject acronym",
              ];
              if (faculty.accessID == 5) {
                titles.push("Actions");
              }
              return titles;
            })()}
            data={subjects.filter(filterFuction)}
            resetTrigger={filters}
            renderFunction={renderFunction}
          />
        </>
      )}
      {serverError && <small className="server-error">{serverError}</small>}
    </>
  );
};
