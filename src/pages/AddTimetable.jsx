import { useEffect, useState } from "react";
import { CustomTable } from "../components/CustomTable";
import { Input } from "../components/Input";
import { Select } from "../components/Select";
import { days } from "../helpers/date";
import { fetch } from "../helpers/fetch";
import { session } from "../helpers/getSession";
import "./../styles/timetable.scss";
import AlertConfirm from "react-alert-confirm";
export const AddTimeTable = () => {
  const faculty = session("faculty");
  const [serverError, setServerError] = useState("");
  const [subjects, setSubjects] = useState([]);
  useEffect(() => {
    fetch({
      url: `/classAndSubject/${faculty.classID}`,
      setError: setServerError,
      setResult: setSubjects,
    });
  }, []);
  const submitHandler = () => {
    const timetableData = [];
    if (timetable.length < 35) return;
    timetable.forEach((period) => {
      period.subjects.forEach((subject) => {
        timetableData.push({
          day: period.day,
          hour: period.hour,
          classSubjectID: subject.classSubjectID,
        });
      });
    });
    fetch({
      url: `/timetable/addMore`,
      method: "post",
      body: timetableData,
      setError: setServerError,
      setResult: AlertConfirm.alert,
    });
  };
  const [values, setValues] = useState({
    day: "",
    hour: "",
    subjects: [],
  });
  const [timetable, setTimetable] = useState([]);

  const addPeriod = (ev) => {
    ev.preventDefault();
    const period = timetable.find(
      (period) => period.day === values.day && period.hour === values.hour
    );
    if (period) {
      period.subjects = values.subjects.map((subject) => JSON.parse(subject));
      setTimetable([...timetable]);
    } else {
      timetable.push({
        day: values.day,
        hour: values.hour,
        subjects: values.subjects.map((subject) => JSON.parse(subject)),
      });
      setTimetable([...timetable]);
    }
    setValues({
      day: "",
      hour: "",
      subjects: [],
    });
  };
  if (!faculty.classID) return;
  return (
    <>
      {subjects.length > 0 && (
        <form action="">
          <Select
            layoutType="inline"
            label="Day"
            options={Object.entries(days).map((day) => day.reverse())}
            value={values.day}
            onChange={(ev) =>
              setValues((values) => ({ ...values, day: ev.target.value }))
            }
          />
          <Select
            layoutType="inline"
            label="Period"
            options={[
              [1, 1],
              [2, 2],
              [3, 3],
              [4, 4],
              [5, 5],
              [6, 6],
              [7, 7],
            ]}
            value={values.hour}
            onChange={(ev) =>
              setValues((values) => ({ ...values, hour: ev.target.value }))
            }
          />
          <div className="subjects-container">
            <p>Subjects</p>
            <div className="subjects">
              {subjects.map((subject) => (
                <Input
                  type="checkbox"
                  label={subject.subjectAcronym}
                  isField={false}
                  checked={values.subjects.includes(JSON.stringify(subject))}
                  onChange={() => {
                    setValues((values) => {
                      return {
                        ...values,
                        subjects: [...document.getElementsByName("subjects")]
                          .filter((el) => el.checked)
                          .map((el) => el.value),
                      };
                    });
                  }}
                  name="subjects"
                  value={JSON.stringify(subject)}
                />
              ))}
            </div>
          </div>
          <button onClick={addPeriod}>Add</button>
        </form>
      )}
      {timetable.length > 0 && (
        <>
          <CustomTable titles={["Day", "1", "2", "3", "4", "5", "6", "7"]}>
            {[1, 2, 3, 4, 5].map((day) => (
              <tr>
                <td>{days[day]}</td>
                {[1, 2, 3, 4, 5, 6, 7].map((hour) => {
                  return (
                    <td>
                      {timetable
                        .find(
                          (period) => period.day == day && period.hour == hour
                        )
                        ?.subjects.map((subject) => subject.subjectAcronym)
                        .join(" / ")}
                    </td>
                  );
                })}
              </tr>
            ))}
          </CustomTable>
          <button onClick={submitHandler} disabled={timetable.length < 35}>
            Submit
          </button>
        </>
      )}
      {serverError && <small className="server-error">{serverError}</small>}
    </>
  );
};
