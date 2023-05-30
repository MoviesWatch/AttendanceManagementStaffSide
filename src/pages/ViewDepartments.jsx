import axios from "axios";
import { useEffect, useState } from "react";
import { CustomTable } from "../components/CustomTable";
import { fetch } from "../helpers/fetch";
import "react-alert-confirm/lib/style.css";
import AlertConfirm from "react-alert-confirm";
export const ViewDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [serverError, setServerError] = useState("");
  const getHandler = () => {
    fetch({
      url: "/department",
      setError: setServerError,
      setResult: (result) => {
        setDepartments(result);
        if (result.length == 0) {
          serverError("Nothing to show");
        } else {
          setServerError("");
        }
      },
    });
  };
  useEffect(() => {
    getHandler();
  }, []);
  const deleteHandler = async (departmentCode) => {
    const confirmance = await AlertConfirm("Are you sure?");
    if (!confirmance[0]) return;
    fetch({
      url: `/department/${departmentCode}`,
      method: "delete",
      setError: setServerError,
      setResult: AlertConfirm.alert,
    });
    getHandler();
  };
  return (
    <>
      {departments.length > 0 && (
        <CustomTable
          titles={["S.No", "Department code", "Department", "Actions"]}
        >
          {departments.map((department, index) => (
            <tr>
              <td>{index + 1}</td>
              <td>{department.departmentCode}</td>
              <td>{department.department}</td>
              <td>
                <button
                  className="small"
                  onClick={() => deleteHandler(department.departmentCode)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </CustomTable>
      )}
      {serverError && <small className="server-error">{serverError}</small>}
    </>
  );
};
