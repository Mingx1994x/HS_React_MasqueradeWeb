import { configureStore } from "@reduxjs/toolkit";
import sweetAlertSlice from "./slice/sweetAlertSlice";

export const store = configureStore({
  reducer: {
    sweetAlert: sweetAlertSlice
  }
});