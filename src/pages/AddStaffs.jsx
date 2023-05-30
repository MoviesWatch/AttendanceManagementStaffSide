import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Input } from "../components/Input";
import { Password } from "../components/Password";
import { Select } from "../components/Select";
import { fetch } from "../helpers/fetch";
import { validate } from "../helpers/validateObject";
import "./../styles/add.scss";
import AlertConfirm from "react-alert-confirm";
import "react-alert-confirm/lib/style.css";
import { session } from "../helpers/getSession";
export const AddStaffs = () => {
  const { state } = useLocation();
  const departments = session("departments");
  const semesters = session("semesters");
  const [classes, setClasses] = useState([]);
  const [accesses, setAccesses] = useState([]);
  const [faculty, setFaculty] = useState(
    state
      ? { ...state }
      : {
          facultyID: "",
          mobile: "",
          email: "",
          name: "",
          departmentCode: null,
          classID: null,
          accessID: "",
        }
  );

  const [serverError, setServerError] = useState("");
  const excludes = ["mobile", "email", "departmentCode", "classID"];
  const excludesHandler = (accessID) => {
    const classIDExcluded = excludes.indexOf("classID") !== -1;
    const deptExcluded = excludes.indexOf("departmentCode") !== -1;
    if (accessID == 2) {
      if (classIDExcluded) {
        excludes.splice(excludes.indexOf("classID"), 1);
      }
    } else if (!classIDExcluded) {
      excludes.push("classID");
    }
    if (accessID == 3) {
      if (deptExcluded) {
        excludes.splice(excludes.indexOf("departmentCode"), 1);
      }
    } else if (!deptExcluded) {
      excludes.push("departmentCode");
    }
  };
  useEffect(() => {
    fetch({
      url: "/class",
      setError: setServerError,
      setResult: (result) => {
        setClasses(
          result.filter(({ semester }) => semesters.includes(semester))
        );
      },
    });
    fetch({
      url: "/facultyAccess",
      setError: setServerError,
      setResult: setAccesses,
    });
  }, []);

  const [isUpdate, setIsUpdate] = useState(false);
  const [toUpdate, setToUpdate] = useState({});

  useEffect(() => {
    if (!state) return;
    setToUpdate(() => {
      const toUpdate = Object.keys(state).reduce((obj, key) => {
        if (faculty[key] != state[key] && faculty[key]) {
          obj[key] = faculty[key];
        }
        return obj;
      }, {});
      setIsUpdate(Object.keys(toUpdate).length > 0);
      return toUpdate;
    });
  }, [faculty]);
  const updateHandler = (ev) => {
    ev.preventDefault();
    ev.target.parentElement.classList.add("active");
    if (document.querySelectorAll(".error.active").length > 0) return;
    if (state) {
      //update here
      fetch({
        url: `/faculty/${state.facultyID}`,
        method: "put",
        setResult: AlertConfirm.alert,
        setError: setServerError,
        body: toUpdate,
      });
    }
  };
  const submitHandler = (ev) => {
    ev.preventDefault();
    ev.target.parentElement.classList.add("active");
    if (document.querySelectorAll(".error.active").length > 0) return;
    //post here
    fetch({
      url: "/faculty",
      body: faculty,
      method: "post",
      setResult: AlertConfirm.alert,
      setError: setServerError,
    });
  };

  return (
    <>
      <div className="add-container">
        <form>
          <Input
            type="text"
            layoutType="inline"
            isField={true}
            label="Faculty ID"
            pattern={/^\d{4,}/}
            readOnly={state}
            value={faculty.facultyID}
            onChange={(ev) =>
              setFaculty({ ...faculty, facultyID: ev.target.value })
            }
          />
          <Input
            type="text"
            layoutType="inline"
            isField={true}
            label="Name"
            pattern={/[a-zA-Z]{2,}/}
            value={faculty.name}
            onChange={(ev) => setFaculty({ ...faculty, name: ev.target.value })}
          />
          <Input
            type="email"
            layoutType="inline"
            isField={true}
            label="Email"
            pattern={/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}|^/}
            value={faculty.email}
            onChange={(ev) =>
              setFaculty({ ...faculty, email: ev.target.value })
            }
          />
          <Input
            type="phone"
            layoutType="inline"
            isField={true}
            label="Mobile"
            pattern={/^\d{10}|^/}
            value={faculty.mobile}
            onChange={(ev) =>
              setFaculty({ ...faculty, mobile: ev.target.value })
            }
          />
          <Select
            options={accesses.map(({ accessID, access }) => [access, accessID])}
            label="Access"
            pattern={/^\d{1}/}
            value={faculty.accessID}
            onChange={(ev) => {
              const value = ev.target.value;
              excludesHandler(value);
              if (value != 2) {
                faculty.classID = null;
              }
              if (value != 4) {
                faculty.departmentCode = null;
              }
              setFaculty({ ...faculty, accessID: value });
            }}
          />
          <Select
            options={departments.map(({ departmentCode, department }) => [
              department,
              departmentCode,
            ])}
            disabled={!(faculty.accessID == 4)}
            pattern={/^\w{3,}|^/}
            value={faculty.departmentCode || ""}
            onChange={(ev) =>
              setFaculty({ ...faculty, departmentCode: ev.target.value })
            }
            label="Department"
          />
          <Select
            options={classes.map(({ departmentCode, semester, classID }) => [
              departmentCode + " - " + semester,
              classID,
            ])}
            pattern={/^\d{1,}|^/}
            disabled={!(faculty.accessID == 2)}
            value={faculty.classID || ""}
            onChange={(ev) =>
              setFaculty({ ...faculty, classID: ev.target.value })
            }
            label="Class"
          />
          {state ? (
            <button disabled={!(state && isUpdate)} onClick={updateHandler}>
              Update
            </button>
          ) : (
            <button
              disabled={!validate(faculty, excludes)}
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
