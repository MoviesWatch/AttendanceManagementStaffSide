import { useEffect } from "react";
import { useState } from "react";
import { CustomTable } from "../components/CustomTable";
import { Select } from "../components/Select";
import { days } from "../helpers/date";
import { fetch } from "../helpers/fetch";
import { session } from "../helpers/getSession";
import "react-alert-confirm/lib/style.css";
import AlertConfirm from "react-alert-confirm";
import { getTimetableReport } from "../helpers/report";
export const ViewTimetable = () => {
  const faculty = session("faculty");
  const [timetable, setTimetable] = useState([]);
  const [classes, setClasses] = useState([]);
  const departments = session("departments");
  const semesters = session("semesters");
  const [selectedClass, setSelectedClass] = useState({
    departmentCode: "",
    semester: "",
  });
  const [serverError, setServerError] = useState("");
  useEffect(() => {
    fetch({
      url: "/class",
      setError: setServerError,
      setResult: setClasses,
    });
  }, []);

  const getHandler = async (ev) => {
    ev.preventDefault();
    const classID = classes.find(
      ({ departmentCode, semester }) =>
        selectedClass.departmentCode == departmentCode &&
        selectedClass.semester == semester
    ).classID;
    fetch({
      url: `/timetable/c/${classID}`,
      setError: setServerError,
      setResult: (result) => {
        setTimetable(result);
        if (result.length == 0) {
          setServerError("Nothing to show");
        } else {
          setServerError("");
        }
      },
    });
  };
  const deleteHandler = async () => {
    const confirmance = await AlertConfirm("Are you sure?");
    if (!confirmance[0]) return;
    fetch({
      method: "delete",
      url: `/timetable`,
      setError: setServerError,
      setResult: AlertConfirm.alert,
    });
    getHandler();
  };

  return (
    <>
      <>
        <form>
          <Select
            label="Department"
            options={departments.map(({ departmentCode, department }) => [
              department,
              departmentCode,
            ])}
            value={selectedClass.departmentCode}
            onChange={(ev) =>
              setSelectedClass({
                ...selectedClass,
                departmentCode: ev.target.value,
              })
            }
          />
          <Select
            label="Semester"
            options={semesters.map((semester) => [semester, semester])}
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
        {timetable.length > 0 && (
          <>
            <button onClick={() => getTimetableReport(timetable)}>
              Download
            </button>
            <CustomTable titles={["Day", "1", "2", "3", "4", "5", "6", "7"]}>
              {[1, 2, 3, 4, 5].map((day) => (
                <tr>
                  <td>{days[day]}</td>
                  {[1, 2, 3, 4, 5, 6, 7].map((hour) => (
                    <td>
                      {(() => {
                        const hours = timetable.filter(
                          (period) => period.day == day && period.hour == hour
                        );
                        return hours
                          .map(({ subjectAcronym }) => subjectAcronym)
                          .join(" / ");
                      })()}
                    </td>
                  ))}
                </tr>
              ))}
            </CustomTable>
            {faculty.accessID == 2 &&
              classes.find(
                ({ departmentCode, semester }) =>
                  selectedClass.departmentCode == departmentCode &&
                  selectedClass.semester == semester
              )?.classID == faculty.classID && (
                <>
                  <button onClick={deleteHandler}>Delete</button>
                </>
              )}
          </>
        )}
      </>
      {serverError && <small className="server-error">{serverError}</small>}
    </>
  );
};
