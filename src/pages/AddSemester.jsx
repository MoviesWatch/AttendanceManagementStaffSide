import { useState } from "react";
import { Input } from "../components/Input";
import { fetch } from "../helpers/fetch";
import AlertConfirm from "react-alert-confirm";
import "react-alert-confirm/lib/style.css";
export const AddSemester = () => {
  const [semester, setSemester] = useState("");
  const [serverError, setServerError] = useState("");
  const addHandler = (ev) => {
    ev.preventDefault();
    if (!semester) return;
    fetch({
      url: "/semester",
      method: "post",
      body: {
        semester,
      },
      setError: setServerError,
      setResult: AlertConfirm.alert,
    });
  };
  return (
    <>
      <form>
        <Input
          label="Semester"
          isField={true}
          type="number"
          min="1"
          max="8"
          value={semester}
          onChange={(ev) => setSemester(ev.target.value)}
        />
        <button
          disabled={!(semester && semester > 0 && semester < 9)}
          onClick={addHandler}
        >
          Add
        </button>
      </form>
      {serverError && <small className="server-error">{serverError}</small>}
    </>
  );
};
