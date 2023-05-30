import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CustomTable } from "../components/CustomTable";
import { fetch } from "../helpers/fetch";

export const ViewODDetails = () => {
  const { state: odID } = useLocation();
  const navigate = useNavigate();
  if (!odID) {
    navigate("/od/view");
  }
  const [serverError, setServerError] = useState("");
  const [odDetails, setOdDetails] = useState([]);
  useEffect(() => {
    fetch({
      url: `/odDetail/${odID}`,
      setError: setServerError,
      setResult: (result) => {
        setOdDetails(result);
        if (result.length == 0) {
          setServerError("Nothing to show");
        } else {
          setServerError("");
        }
      },
    });
  }, [odID]);
  return (
    <>
      {odDetails.length > 0 && (
        <CustomTable titles={["S.No", "Reg No", "Semester", "Date", "Period"]}>
          {odDetails.map((odDetail, index) => (
            <tr>
              <td>{index + 1}</td>
              <td>{odDetail.regNo}</td>
              <td>{odDetail.semester}</td>
              <td>{odDetail.date}</td>
              <td>{odDetail.hour}</td>
            </tr>
          ))}
        </CustomTable>
      )}
      {serverError && <small className="server-error">{serverError}</small>}
    </>
  );
};
