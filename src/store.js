import { configureStore } from "@reduxjs/toolkit";
import bootstrapToastSlice from "./slice/bootstrapToast";
export const store = configureStore({
  reducer: {
    bsToast: bootstrapToastSlice
  }
});