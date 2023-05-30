import axios from "axios";
import { useState } from "react";
import AlertConfirm from "react-alert-confirm";
import "react-alert-confirm/lib/style.css";
import { Input } from "../components/Input";
import { fetch } from "../helpers/fetch";
import { validate } from "../helpers/validateObject";

export const AddDepartments = () => {
  const [department, setDepartment] = useState({
    departmentCode: "",
    department: "",
  });
  const [serverError, setServerError] = useState("");

  const addHandler = async (ev) => {
    ev.preventDefault();
    if (document.querySelectorAll(".error.active").length > 0) return;
    fetch({
      url: "/department",
      method: "post",
      body: department,
      setError: setServerError,
      setResult: AlertConfirm.alert,
    });
    // try {
    //   const { data: result } = await axios.post("/department", department);
    //   window.alert(result);
    // } catch (error) {
    //   setErrorFromServer(error.response.data.msg);
    // }
  };
  return (
    <>
      <form action="">
        <Input
          type="text"
          label="Department code"
          layoutType="inline"
          isField={true}
          pattern={/\w{3,}/}
          value={department.departmentCode}
          onChange={(ev) =>
            setDepartment({ ...department, departmentCode: ev.target.value })
          }
        />
        <Input
          type="text"
          label="Department name"
          layoutType="inline"
          pattern={/\w{5,}/}
          isField={true}
          value={department.department}
          onChange={(ev) =>
            setDepartment({ ...department, department: ev.target.value })
          }
        />
        <button disabled={!validate(department)} onClick={addHandler}>
          Add
        </button>
      </form>
      {serverError && <small className="server-error">{serverError}</small>}
    </>
  );
};
