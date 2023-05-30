import { Input } from "../components/Input";
import { Brand } from "../components/Brand";
import { Password } from "../components/Password";
import "./../styles/login.scss";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Select } from "../components/Select";
import { fetch } from "../helpers/fetch";
export const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    facultyID: "",
    password: "",
    accessID: "",
    academicSemester: "",
  });
  const [academicSemesters, setAcademicSemesters] = useState([]);
  const accesses = [
    [1, "Faculty"],
    [2, "Faculty advisor"],
    [3, "Head of the department (S&H)"],
    [4, "Head of the department"],
    [5, "Principal"],
  ];
  const [serverError, setServerError] = useState("");
  useEffect(() => {
    fetch({
      url: "/academicSemester",
      setResult: setAcademicSemesters,
      setError: setServerError,
    });
  }, []);
  const handleSubmit = async (ev) => {
    ev.preventDefault();
    ev.target.classList.add("active");
    if (
      !(
        credentials.facultyID &&
        credentials.password &&
        credentials.accessID &&
        credentials.academicSemester
      )
    )
      return;
    const semesterType = academicSemesters.find(
      (academicSemester) =>
        academicSemester.databaseName == credentials.academicSemester
    ).semesterType;
    await fetch({
      url: "/login",
      method: "post",
      body: credentials,
      setError: setServerError,
      setResult: (result) => {
        sessionStorage.setItem("faculty", JSON.stringify(result));
        sessionStorage.setItem(
          "semesters",
          JSON.stringify(semesterType == 0 ? [1, 3, 5, 7] : [2, 4, 6, 8])
        );
        sessionStorage.setItem("accesses", JSON.stringify(accesses));
        fetch({
          url: "/department",
          setResult: (result) => {
            sessionStorage.setItem("departments", JSON.stringify(result));
          },
        });
        navigate("/");
      },
    });
  };
  return (
    <div className="login-container">
      <form action="" onSubmit={handleSubmit}>
        <Brand />
        <Input
          type="text"
          label="username"
          layoutType="block"
          isField={true}
          pattern={/^\d{3,}/}
          onChange={(ev) =>
            setCredentials({ ...credentials, facultyID: ev.target.value })
          }
          value={credentials.facultyID}
        />
        <Password
          layoutType="block"
          isField={true}
          label="Password"
          pattern={/^\d{4,}/}
          onChange={(ev) =>
            setCredentials({
              ...credentials,
              password: ev.target.value,
            })
          }
          value={credentials.password}
        />
        <Select
          options={accesses.map(([accessID, access]) => [access, accessID])}
          label="Access"
          layoutType="block"
          pattern={/^\d{1}/}
          isField={true}
          value={credentials.accessID}
          onChange={(ev) =>
            setCredentials({ ...credentials, accessID: ev.target.value })
          }
        />
        <Select
          options={academicSemesters.map(({ databaseName, name }) => [
            name,
            databaseName,
          ])}
          label="Academic semester"
          layoutType="block"
          pattern={/^.{5,}/}
          isField={true}
          value={credentials.academicSemester}
          onChange={(ev) =>
            setCredentials({
              ...credentials,
              academicSemester: ev.target.value,
            })
          }
        />
        <button>Login</button>
      </form>
      {serverError && <small className="server-error">{serverError}</small>}
    </div>
  );
};
