import { Outlet } from "react-router";
import Navbar from "../components/Navbar";

export default function FrontLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
