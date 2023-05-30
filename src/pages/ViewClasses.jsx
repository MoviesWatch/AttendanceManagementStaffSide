import { useEffect, useState } from "react";
import { CustomTable } from "../components/CustomTable";
import { fetch } from "../helpers/fetch";
import "react-alert-confirm/lib/style.css";
import AlertConfirm from "react-alert-confirm";
export const ViewClasses = () => {
  const [classes, setClasses] = useState([]);
  const [serverError, setServerError] = useState("");
  const getHandler = () => {
    fetch({
      url: "/class",
      setResult: setClasses,
      setError: setServerError,
    });
  };
  useEffect(() => {
    getHandler();
  }, []);
  const deleteHandler = async (classID) => {
    const confirmance = await AlertConfirm("Are you sure?");
    if (!confirmance[0]) return;
    fetch({
      url: `/class/${classID}`,
      method: "delete",
      setError: setServerError,
      setResult: AlertConfirm.alert,
    });
    getHandler();
  };
  return (
    <>
      <CustomTable titles={["S.No", "Department", "Semester", "Actions"]}>
        {classes.map((_class, index) => (
          <tr>
            <td>{index + 1}</td>
            <td>{_class.departmentCode}</td>
            <td>{_class.semester}</td>
            <td>
              <button
                className="small"
                onClick={() => deleteHandler(_class.classID)}
              >
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
