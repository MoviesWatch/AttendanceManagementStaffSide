import "./App.css";

import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ProtectedRoute } from "./helpers/ProtectedRoute";
import { Attendance } from "./pages/Attendance";
import { Timetable } from "./pages/Timetable";
import { Students } from "./pages/Students";
import { Staffs } from "./pages/Staffs";
import { Subjects } from "./pages/Subjects";
import { StaffsAndSubjects } from "./pages/StaffsAndSubjects";
import { OD } from "./pages/OD";
import { ViewStudents } from "./pages/ViewStudents";
import { MarkAttendence } from "./pages/MarkAttendance";
import { ViewAttendance } from "./pages/ViewAttendance";
import { ViewSubjects } from "./pages/ViewSubjects";
import { AddSubjects } from "./pages/AddSubjects";
import { ViewTimetable } from "./pages/ViewTimetable";
import { AddTimeTable } from "./pages/AddTimetable";
import { ViewStaffs } from "./pages/ViewStaffs";
import { AddStaffs } from "./pages/AddStaffs";
import { AddStudents } from "./pages/AddStudents";
import { ViewStaffsAndSubjects } from "./pages/ViewStaffsAndSubjects";
import { AddStaffsAndSubjects } from "./pages/AddStaffsAndSubjects";
import { AddMoreStudents } from "./pages/AddMoreStudents";
import { ViewOverallAttendance } from "./pages/ViewOverallAttendance";
import { ClassesAndSubjects } from "./pages/ClassesAndSubjects";
import { ViewClassesAndSubjects } from "./pages/ViewClassesAndSubjects";
import { AddClassesAndSubjects } from "./pages/AddClassesAndSubjects";
import { ViewOD } from "./pages/ViewOD";
import { ApplyOD } from "./pages/ApplyOD";
import { ViewODDetails } from "./pages/ViewODDetails";
import { WorkingDays } from "./pages/WorkingDays";
import { ViewWorkingDays } from "./pages/ViewWorkingDays";
import { AddWorkingDays } from "./pages/AddWorkingDays";
import { AddMoreWorkingDays } from "./pages/AddMoreWorkingDays";
import { Departments } from "./pages/Departments";
import { ViewDepartments } from "./pages/ViewDepartments";
import { AddDepartments } from "./pages/AddDepartments";
import { CreateSemester } from "./pages/CreateSemester";
import axios, { Axios } from "axios";
import { ViewMyTimetable } from "./pages/ViewMyTimetable";
import { Semester } from "./pages/Semester";
import { ViewSemesters } from "./pages/ViewSemesters";
import { AddSemester } from "./pages/AddSemester";
import { StudentsAndSubjects } from "./pages/StudentsAndSubjects";
import { ViewStudentsAndSubjects } from "./pages/ViewStudentsAndSubjects";
import { AddStudentsAndSubjects } from "./pages/AddStudentsAndSubjects";
import { Classes } from "./pages/Classes";
import { ViewClasses } from "./pages/ViewClasses";
import { AddClasses } from "./pages/AddClasses";
import { ChangePassword } from "./pages/ChangePassword";
import { ViewOverallAttendanceDetails } from "./pages/ViewOverallAttendanceDetails";
import { ViewAttendanceDetails } from "./pages/ViewAttendanceDetails";
import { AddMoreSubjects } from "./pages/AddMoreSubjects";

function App() {
  axios.defaults.baseURL = "/faculty/api";
  const router = createBrowserRouter(
    [
      {
        path: "/",
        element: <ProtectedRoute route={<Home />} />,
        children: [
          {
            path: "attendance",
            element: <Attendance />,
            children: [
              { path: "view", element: <ViewAttendance /> },
              {
                path: "viewOverall",
                element: <ViewOverallAttendance />,
              },
              {
                path: "viewOverallDetails",
                element: <ViewOverallAttendanceDetails />,
              },
              {
                path: "viewDetails",
                element: <ViewAttendanceDetails />,
              },
              {
                path: "mark",
                element: <MarkAttendence />,
              },
            ],
          },
          {
            path: "timetable",
            element: <Timetable />,
            children: [
              { path: "view", element: <ViewTimetable /> },
              { path: "viewMyTimetable", element: <ViewMyTimetable /> },
              {
                path: "add",
                element: <AddTimeTable />,
              },
            ],
          },
          {
            path: "students",
            element: <Students />,
            children: [
              { path: "view", element: <ViewStudents /> },
              { path: "edit", element: <AddStudents /> },
              {
                path: "add",
                element: <AddStudents />,
              },
              {
                path: "addMore",
                element: <AddMoreStudents />,
              },
            ],
          },
          {
            path: "faculties",
            element: <Staffs />,
            children: [
              { path: "view", element: <ViewStaffs /> },
              { path: "edit", element: <AddStaffs /> },
              { path: "add", element: <AddStaffs /> },
            ],
          },
          {
            path: "subjects",
            element: <Subjects />,
            children: [
              { path: "view", element: <ViewSubjects /> },
              {
                path: "add",
                element: <AddSubjects />,
              },
              {
                path: "edit",
                element: <AddSubjects />,
              },
              {
                path: "addMore",
                element: <AddMoreSubjects />,
              },
            ],
          },
          {
            path: "classesAndSubjects",
            element: <ClassesAndSubjects />,
            children: [
              { path: "view", element: <ViewClassesAndSubjects /> },
              {
                path: "add",
                element: <AddClassesAndSubjects />,
              },
              {
                path: "edit",
                element: <AddClassesAndSubjects />,
              },
            ],
          },
          {
            path: "facultiesAndSubjects",
            element: <StaffsAndSubjects />,
            children: [
              { path: "view", element: <ViewStaffsAndSubjects /> },
              { path: "add", element: <AddStaffsAndSubjects /> },
            ],
          },
          {
            path: "workingDays",
            element: <WorkingDays />,
            children: [
              { path: "view", element: <ViewWorkingDays /> },
              { path: "add", element: <AddWorkingDays /> },
              { path: "addMore", element: <AddMoreWorkingDays /> },
            ],
          },
          {
            path: "od",
            element: <OD />,
            children: [
              { path: "view", element: <ViewOD /> },
              { path: "viewDetails", element: <ViewODDetails /> },
              { path: "apply", element: <ApplyOD /> },
            ],
          },
          {
            path: "departments",
            element: <Departments />,
            children: [
              { path: "view", element: <ViewDepartments /> },
              { path: "add", element: <AddDepartments /> },
            ],
          },
          {
            path: "studentsAndSubjects",
            element: <StudentsAndSubjects />,
            children: [
              {
                path: "view",
                element: <ViewStudentsAndSubjects />,
              },
              {
                path: "add",
                element: <AddStudentsAndSubjects />,
              },
            ],
          },
          {
            path: "changePassword",
            element: <ChangePassword />,
          },
          {
            path: "changeStudentPassword",
            element: <ChangePassword />,
          },
          {
            path: "changeFacultyPassword",
            element: <ChangePassword />,
          },
        ],
      },
      {
        path: "/login",
        element: <ProtectedRoute route={<Login />} login={true} />,
      },
    ],
    {
      basename: "/faculty",
    }
  );
  return <RouterProvider router={router} />;
}

export default App;
