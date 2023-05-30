import { useEffect, useState } from "react";
import Papa from "papaparse";
import { Input } from "../components/Input";
import "./../styles/addMoreStudents.scss";
import { fetch } from "../helpers/fetch";
import { session } from "../helpers/getSession";
export const AddMoreSubjects = () => {
  const faculty = session("faculty");
  const [serverError, setServerError] = useState("");
  const [serverMessage, setServerMessage] = useState("");
  const [file, setFile] = useState("");
  const [data, setData] = useState([]);
  const keys = ["subjectCode", "subject", "subjectAcronym"];
  let addedRow = 1;
  useEffect(() => {
    (async () => {
      for (let i = addedRow; i < data.length; i++) {
        if (serverError) break;
        setServerError("");
        setServerMessage("");
        fetch({
          url: "/subject",
          method: "post",
          body: data[i],
          setResult: (result) => {
            addedRow++;
            setServerMessage("Added Row: " + addedRow);
          },
          setError: (error) => {
            setServerError(error + " caused by row " + addedRow);
          },
        });
        // try {
        //   await axios.post("/student", data[i]);
        //   setServerMessage("Added Row: " + addedRow);
        //   addedRow++;
        // } catch (error) {
        //   error.response &&
        //     setServerError(
        //       error.response.data.code === 406
        //         ? `Row ${addedRow} already in the server`
        //         : `Row ${addedRow} caused error`
        //     );
        //   break;
        // }
      }
    })();
  }, [data]);
  const submitHandler = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const file = formData.get("subjects");
    Papa.parse(file, {
      complete: async function (results) {
        setData(
          results.data.map((subject) => {
            const subjectObj = subject.reduce((obj, value, index) => {
              obj[keys[index]] = value;
              return obj;
            }, {});
            return subjectObj;
          })
        );
      },
    });
  };
  if (!faculty.accessID == 4) return;
  return (
    <>
      <form onSubmit={submitHandler} className="add-more-students-form">
        <Input
          label="Subjects file"
          type="file"
          name="subjects"
          layoutType="block"
          id="file"
          value={file}
          onChange={(e) => {
            setFile(e.target.value);
          }}
        />
        <a href="/faculty/files/subjects.csv">Download template here</a>
        <button type="submit" disabled={!file.includes(".csv")}>
          Upload
        </button>
      </form>
      {serverMessage && (
        <small className="server-message">{serverMessage}</small>
      )}
      {serverError && <small className="server-error">{serverError}</small>}
    </>
  );
};
