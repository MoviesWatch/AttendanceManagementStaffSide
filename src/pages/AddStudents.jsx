import { Input } from "../components/Input";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./../styles/add.scss";
import { Select } from "../components/Select";
import { fetch } from "../helpers/fetch";
import { session } from "../helpers/getSession";
import { validate } from "../helpers/validateObject";
import AlertConfirm from "react-alert-confirm";
import "react-alert-confirm/lib/style.css";
export const AddStudents = () => {
  const faculty = session("faculty");
  const { state } = useLocation();
  const [student, setStudent] = useState(
    state
      ? { ...state }
      : {
          regNo: "",
          name: "",
          dateOfBirth: "",
          mobile: "",
          email: "",
          parentName: "",
          parentMobile: "",
          gender: "",
          dateJoined: "",
        }
  );
  const [isUpdate, setIsUpdate] = useState(false);
  const [toUpdate, setToUpdate] = useState({});
  const [serverError, setServerError] = useState("");
  useEffect(() => {
    if (!state) return;
    setToUpdate(() => {
      const toUpdate = Object.keys(state).reduce((obj, key) => {
        if (student[key] != state[key] && student[key]) {
          obj[key] = student[key];
        }
        return obj;
      }, {});
      setIsUpdate(Object.keys(toUpdate).length > 0);
      return toUpdate;
    });
  }, [student]);
  const updateHandler = (ev) => {
    ev.preventDefault();
    ev.target.parentElement.classList.add("active");
    if (document.querySelectorAll(".error.active").length > 0) return;
    fetch({
      url: `/student/${state.regNo}`,
      method: "put",
      body: toUpdate,
      setError: setServerError,
      setResult: AlertConfirm.alert,
    });
  };
  const submitHandler = async (ev) => {
    ev.preventDefault();
    //post here
    ev.target.parentElement.classList.add("active");
    if (document.querySelectorAll(".error.active").length > 0) return;
    student.classID = faculty.classID;
    fetch({
      url: "/student",
      method: "post",
      body: student,
      setError: setServerError,
      setResult: AlertConfirm.alert,
    });
  };
  if (!faculty.classID) return;

  return (
    <>
      <div className="add-container">
        <form action="">
          <Input
            label="Reg No"
            type="text"
            pattern={/[0-9a-zA-Z]{6,}/}
            readOnly={state}
            value={student.regNo}
            onChange={(ev) =>
              setStudent({ ...student, regNo: ev.target.value })
            }
            layoutType="inline"
            isField={true}
          />
          <Input
            label="Name"
            type="text"
            value={student.name}
            pattern={/[a-zA-Z]{2,}/}
            onChange={(ev) => setStudent({ ...student, name: ev.target.value })}
            layoutType="inline"
            isField={true}
          />
          <Input
            label="Date of birth"
            type="date"
            pattern={/\d{4}-\d{2}-\d{2}/}
            value={student.dateOfBirth}
            onChange={(ev) =>
              setStudent({ ...student, dateOfBirth: ev.target.value })
            }
            layoutType="inline"
            isField={true}
          />
          <Input
            type="text"
            label="Mobile"
            pattern={/\d{10}|^/}
            value={student.mobile}
            onChange={(ev) =>
              setStudent({ ...student, mobile: ev.target.value })
            }
            layoutType="inline"
            isField={true}
          />
          <Input
            label="Email"
            type="text"
            pattern={/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$|^/}
            value={student.email}
            onChange={(ev) =>
              setStudent({ ...student, email: ev.target.value })
            }
            layoutType="inline"
            isField={true}
          />
          <Input
            label="Parent name"
            type="text"
            pattern={/[a-zA-Z]{2}|^/}
            value={student.parentName}
            onChange={(ev) =>
              setStudent({ ...student, parentName: ev.target.value })
            }
            layoutType="inline"
            isField={true}
          />
          <Input
            label="Parent mobile"
            type="text"
            pattern={/\d{10}|^/}
            value={student.parentMobile}
            onChange={(ev) =>
              setStudent({ ...student, parentMobile: ev.target.value })
            }
            layoutType="inline"
            isField={true}
          />
          <Input
            label="Joined Date"
            type="date"
            value={student.dateJoined}
            pattern={/\d{4}-\d{2}-\d{2}/}
            onChange={(ev) =>
              setStudent({ ...student, dateJoined: ev.target.value })
            }
            layoutType="inline"
            isField={true}
          />
          <Select
            label="Gender"
            options={[
              ["Male", "M"],
              ["Female", "F"],
            ]}
            pattern={/\w/}
            layoutType="inline"
            value={student.gender}
            onChange={(ev) =>
              setStudent({ ...student, gender: ev.target.value })
            }
          />
          {state ? (
            <button disabled={!(state && isUpdate)} onClick={updateHandler}>
              Update
            </button>
          ) : (
            <button
              disabled={
                !validate(student, [
                  "parentName",
                  "parentMobile",
                  "email",
                  "mobile",
                ])
              }
              onClick={submitHandler}
            >
              Add
            </button>
          )}
        </form>
      </div>
      {serverError && <small className="server-error">{serverError}</small>}
    </>
  );
};
