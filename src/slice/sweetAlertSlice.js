import { createSlice } from "@reduxjs/toolkit";

export const sweetAlertSlice = createSlice({
  name: 'sweetAlertSlice',
  initialState: {
    toastState: {
      created_time: '',
      status: 'success',
      content: '成功加到購物車'
    }
  },
  reducers: {
    activeSwalToast: (state, action) => {
      console.log(action);
      const { status, content } = action.payload
      state.toastState = {
        created_time: Date.now(),
        status,
        content
      }
    }
  }
})

export default sweetAlertSlice.reducer;
export const { activeSwalToast } = sweetAlertSlice.actions;

