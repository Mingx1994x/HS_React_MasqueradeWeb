import { configureStore } from "@reduxjs/toolkit";
import sweetAlertSlice from "./slice/sweetAlertSlice";
import bootstrapToastSlice from "./slice/bootstrapToast";
export const store = configureStore({
  reducer: {
    sweetAlert: sweetAlertSlice,
    bsToast: bootstrapToastSlice
  }
});