import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: []
}
const bootstrapToast = createSlice({
  name: 'bsToast',
  initialState,
  reducers: {
    addToastMessage: (state, action) => {
      const { status, mode, title, content } = action.payload;
      state.messages.unshift({
        id: Date.now(),
        status,
        mode,
        title,
        content
      })
    },
    removeToastMessage: (state, action) => {
      const currentId = action.payload;
      console.log(currentId);

      const removeIndex = state.messages.findIndex(message => message.id === currentId);
      if (removeIndex !== -1) state.messages.splice(removeIndex, 1);
    }
  }
})

export default bootstrapToast.reducer;
export const { addToastMessage, removeToastMessage } = bootstrapToast.actions;