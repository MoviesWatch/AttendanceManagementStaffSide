import { useEffect, useState } from "react";
import { CustomTable } from "../components/CustomTable";
import { fetch } from "../helpers/fetch";
import "react-alert-confirm/lib/style.css";
import AlertConfirm from "react-alert-confirm";
export const ViewSemesters = () => {
  const [semesters, setSemesters] = useState([]);
  const [serverError, setServerError] = useState("");
  const getHandler = () => {
    fetch({
      url: "/semester",
      setResult: setSemesters,
      setError: setServerError,
    });
  };
  useEffect(() => {
    getHandler();
  }, []);
  const deleteHandler = async (semester) => {
    const confirmance = await AlertConfirm("Are you sure?");
    if (!confirmance[0]) return;
    fetch({
      url: `/semester/${semester}`,
      method: "delete",
      setError: setServerError,
      setResult: AlertConfirm.alert,
    });
    getHandler();
  };
  return (
    <>
      <CustomTable titles={["Semester", "Actions"]}>
        {semesters.map(({ semester }) => (
          <tr>
            <td>{semester}</td>
            <td>
              <button className="small" onClick={() => deleteHandler(semester)}>
                Remove
              </button>
            </td>
          </tr>
        ))}
      </CustomTable>
      {serverError && <small className="server-error">{serverError}</small>}
    </>
  );
};
