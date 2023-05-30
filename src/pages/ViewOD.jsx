import { useEffect } from "react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { CustomTable } from "../components/CustomTable";
import { fetch } from "../helpers/fetch";
import { session } from "../helpers/getSession";
import "react-alert-confirm/lib/style.css";
import AlertConfirm from "react-alert-confirm";
export const ViewOD = () => {
  const faculty = session("faculty");
  const [ods, setods] = useState([]);
  const [serverError, setServerError] = useState("");
  const statusRef = {
    1: "Pending",
    2: "Approved",
    3: "Rejected",
  };
  const getHandler = () => {
    let url;
    if (faculty.accessID == 2) {
      url = "odRequest/f";
    } else if (faculty.accessID == 3) {
      url = "odRequest/shh";
    } else if (faculty.accessID == 4) {
      url = "odRequest/h";
    }
    fetch({
      url: url,
      setResult: (result) => {
        setods(result);
        if (result.length == 0) {
          setServerError("Nothing to show");
        } else {
          setServerError("");
        }
      },
      setError: setServerError,
    });
  };
  useEffect(() => {
    getHandler();
  }, []);
  const deleteHandler = async (odID) => {
    const confirmance = await AlertConfirm("Are you sure?");
    if (!confirmance[0]) return;
    fetch({
      url: `/odRequest/${odID}`,
      method: "delete",
      setError: setServerError,
      setResult: AlertConfirm.alert,
    });
    getHandler();
  };
  const updateHandler = async (odId, statusID) => {
    const confirmance = await AlertConfirm("Are you sure?");
    if (!confirmance[0]) return;
    fetch({
      url: `odRequest/${odId}`,
      method: "put",
      setError: setServerError,
      setResult: AlertConfirm.alert,
      body: {
        statusID,
      },
    });
    getHandler();
  };
  if (!(faculty.classID || faculty.departmentCode)) return;
  return (
    <>
      {ods.length > 0 && (
        <CustomTable
          titles={["S.No", "Request ID", "Status", "Attatchment", "Actions"]}
        >
          {ods.map((od, index) => (
            <tr>
              <td>{index + 1}</td>
              <td>{od.odID}</td>
              <td>{statusRef[od.statusID]}</td>
              <td>
                <a href={od.attachment} download>
                  Attachment
                </a>
              </td>
              <td>
                <NavLink to="/od/viewDetails" state={od.odID}>
                  Details
                </NavLink>
                {faculty.accessID == 2 && od.statusID != 2 && (
                  <button
                    className="small"
                    onClick={() => deleteHandler(od.odID)}
                  >
                    Remove
                  </button>
                )}
                {(faculty.accessID == 3 || faculty.accessID == 4) &&
                  od.statusID == 1 && (
                    <>
                      <button
                        className="small"
                        onClick={() => updateHandler(od.odID, 2)}
                      >
                        Approve
                      </button>
                      <button
                        className="small"
                        onClick={() => updateHandler(od.odID, 3)}
                      >
                        Reject
                      </button>
                    </>
                  )}
              </td>
            </tr>
          ))}
        </CustomTable>
      )}
      {serverError && <small className="server-error">{serverError}</small>}
    </>
  );
};
