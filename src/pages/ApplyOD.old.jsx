import { useState } from "react";
import { Input } from "../components/Input";
import { Select } from "../components/Select";
import { CustomTable } from "../components/CustomTable";
import { dateFormatter } from "../helpers/Date";
import "./../styles/applyOD.scss";
export const ApplyOD = () => {
  const [deptAndSem, setDeptAndSem] = useState({
    department: "",
    semester: "",
  });
  const [workingDays, setWorkingDays] = useState([]);
  const [students, setStudents] = useState([]);
  const [values, setValues] = useState({
    days: [],
    regNos: [],
    periods: [],
  });
  const [ODData, setODData] = useState([]);
  const getHandler = (ev) => {
    ev.preventDefault();
    setWorkingDays(["2022-12-08", "2022-12-09", "2022-12-10", "2022-12-11"]);
    setStudents(["1914019", "1914020", "1914021", "1914023"]);
  };
  const changeHandler = (checked, key, value) => {
    if (checked) {
      values[key].push(value);
    } else {
      values[key].splice(values[key].indexOf(value), 1);
    }
    setValues({ ...values });
  };
  const addHandler = () => {
    const { days, regNos, periods } = values;
    days.forEach((day) => {
      regNos.forEach((regNo) => {
        periods.forEach((period) => {
          const alreadyIn = ODData.find(
            (od) => day === od.day && regNo === od.regNo && period === od.period
          );
          if (alreadyIn) return;
          ODData.push({
            day,
            regNo,
            period,
            department: deptAndSem.department,
            semester: deptAndSem.semester,
          });
        });
      });
    });
    ODData.sort((obj1, obj2) => {
      return (
        obj1.day > obj2.day ||
        (obj1.day === obj2.day &&
          (obj1.period > obj2.period ||
            (obj1.period === obj2.period && obj1.regNo > obj2.regNo)))
      );
    });
    setODData([...ODData]);
  };
  const removeHandler = (OD) => {
    ODData.splice(ODData.indexOf(OD), 1);
    console.log(ODData);
    setODData([...ODData]);
  };
  return (
    <>
      <form>
        <Select
          layoutType="inline"
          label="Department"
          options={[
            [1, 1],
            [2, 2],
            [3, 3],
            [4, 4],
          ]}
          value={deptAndSem.department}
          onChange={(ev) => {
            setDeptAndSem({ ...deptAndSem, department: ev.target.value });
          }}
        />
        <Select
          layoutType="inline"
          label="Semester"
          options={[
            [1, 1],
            [2, 2],
            [3, 3],
            [4, 4],
          ]}
          value={deptAndSem.semester}
          onChange={(ev) => {
            setDeptAndSem({ ...deptAndSem, semester: ev.target.value });
          }}
        />
        <button onClick={getHandler}>Proceed</button>
      </form>
      <div className="fill-od-container">
        <div className="working-days-container">
          <p>Working days</p>
          {workingDays.map((day) => (
            <Input
              label={dateFormatter(day)}
              type="checkbox"
              layoutType="inline"
              checked={values.days.includes(day)}
              onChange={(ev) => changeHandler(ev.target.checked, "days", day)}
            />
          ))}
        </div>
        <div className="students-container">
          <p>Reg No</p>
          {students.map((regNo) => (
            <Input
              label={regNo}
              type="checkbox"
              layoutType="inline"
              checked={values.regNos.includes(regNo)}
              onChange={(ev) =>
                changeHandler(ev.target.checked, "regNos", regNo)
              }
            />
          ))}
        </div>
        <div className="periods-container">
          <p>Periods</p>
          {[1, 2, 3, 4, 5, 6, 7].map((period) => (
            <Input
              label={period}
              type="checkbox"
              layoutType="inline"
              checked={values.periods.includes(period)}
              onChange={(ev) =>
                changeHandler(ev.target.checked, "periods", period)
              }
            />
          ))}
        </div>
        <button onClick={addHandler}>Add</button>
      </div>
      {ODData.length != 0 && (
        <div className="od-result-container">
          <CustomTable titles={["S.No", "Date", "Period", "Reg No", "Actions"]}>
            {ODData.map((OD, index) => (
              <tr>
                <td>{index + 1}</td>
                <td>{dateFormatter(OD.day)}</td>
                <td>{OD.period}</td>
                <td>{OD.regNo}</td>
                <td>
                  <button className="small" onClick={() => removeHandler(OD)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </CustomTable>
          <Input type="file" label="Attatchement" layoutType="block" />
          <button>Submit</button>
        </div>
      )}
    </>
  );
};
