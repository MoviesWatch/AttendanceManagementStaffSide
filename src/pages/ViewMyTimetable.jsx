import { useEffect } from "react";
import { useState } from "react";
import { CustomTable } from "../components/CustomTable";
import { days } from "../helpers/date";
import { fetch } from "../helpers/fetch";
import { session } from "../helpers/getSession";
import { getTimetableReport } from "../helpers/report";
export const ViewMyTimetable = () => {
  const [timetable, setTimetable] = useState([]);
  const faculty = session("faculty");
  const [serverError, setServerError] = useState("");
  useEffect(() => {
    fetch({
      url: `/timetable/f/${faculty.facultyID}`,
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
  }, []);

  //generateReport(timetable);
  return (
    <>
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
                      return (
                        hours
                          .map(
                            ({ subjectAcronym, departmentCode, semester }) =>
                              subjectAcronym +
                              " (" +
                              departmentCode +
                              " - " +
                              semester +
                              ")"
                          )
                          .join(" / ") || "-"
                      );
                    })()}
                  </td>
                ))}
              </tr>
            ))}
          </CustomTable>
        </>
      )}
      {serverError && <small className="server-error">{serverError}</small>}
    </>
  );
};
