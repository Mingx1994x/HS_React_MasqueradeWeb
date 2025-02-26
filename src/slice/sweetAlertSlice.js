import { createSlice } from "@reduxjs/toolkit";

const sweetAlertSlice = createSlice({
  name: 'sweetAlertSlice',
  initialState: {
    toastState: {}
  },
  reducers: {
    activeSwalToast: (state, action) => {
      console.log(action);
      const { status, content } = action.payload
      state.toastState = {
        id: Date.now(),
        status,
        content
      }
    }
  }
})

export default sweetAlertSlice.reducer;
export const { activeSwalToast } = sweetAlertSlice.actions;

