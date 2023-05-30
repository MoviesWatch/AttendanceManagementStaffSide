import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Input } from "../components/Input";
import { Select } from "../components/Select";
import { fetch } from "../helpers/fetch";
import "./../styles/add.scss";
import AlertConfirm from "react-alert-confirm";
import "react-alert-confirm/lib/style.css";
import { validate } from "../helpers/validateObject";

export const AddSubjects = () => {
  const { state } = useLocation();
  const [isUpdate, setIsUpdate] = useState(false);
  const [toUpdate, setToUpdate] = useState({});
  const [subject, setSubject] = useState(
    state
      ? { ...state }
      : {
          subjectCode: "",
          subject: "",
          subjectAcronym: "",
        }
  );
  const [serverError, setServerError] = useState("");
  useEffect(() => {
    if (!state) return;
    setToUpdate(() => {
      const toUpdate = Object.keys(state).reduce((obj, key) => {
        if (subject[key] != state[key] && subject[key]) {
          obj[key] = subject[key];
        }
        return obj;
      }, {});
      setIsUpdate(Object.keys(toUpdate).length > 0);
      return toUpdate;
    });
  }, [subject]);
  const updateHandler = (ev) => {
    ev.preventDefault();
    ev.target.parentElement.classList.add("active");
    if (document.querySelectorAll(".error.active").length > 0) return;
    fetch({
      url: `/subject/${state.subjectCode}`,
      method: "put",
      body: toUpdate,
      setError: setServerError,
      setResult: AlertConfirm.alert,
    });
  };
  const submitHandler = (ev) => {
    ev.preventDefault();
    ev.target.parentElement.classList.add("active");
    if (document.querySelectorAll(".error.active").length > 0) return;
    fetch({
      url: `/subject`,
      method: "post",
      body: subject,
      setError: setServerError,
      setResult: AlertConfirm.alert,
    });
  };
  return (
    <>
      <div className="add-container">
        <form onSubmit={submitHandler}>
          <Input
            layoutType="inline"
            label="Subject code"
            isField={true}
            type="text"
            readOnly={state}
            pattern={/[a-zA-Z0-9]{6,}/}
            value={subject.subjectCode}
            onChange={(ev) =>
              setSubject({ ...subject, subjectCode: ev.target.value })
            }
          />
          <Input
            layoutType="inline"
            label="Subject name"
            isField={true}
            type="text"
            pattern={/[a-zA-Z0-9]{3,}/}
            value={subject.subject}
            onChange={(ev) =>
              setSubject({ ...subject, subject: ev.target.value })
            }
          />
          <Input
            layoutType="inline"
            label="Subject acronym"
            isField={true}
            pattern={/[a-zA-Z0-9]{2,}/}
            type="text"
            value={subject.subjectAcronym}
            onChange={(ev) =>
              setSubject({ ...subject, subjectAcronym: ev.target.value })
            }
          />
          {state ? (
            <button disabled={!(state && isUpdate)} onClick={updateHandler}>
              Update
            </button>
          ) : (
            <button disabled={!validate(subject)} onClick={submitHandler}>
              Add
            </button>
          )}
        </form>
      </div>
      {serverError && <small className="server-error">{serverError}</small>}
    </>
  );
};
