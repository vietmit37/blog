import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IPostsAndTotalRes } from "@/types/post/postRes";

export interface PostState {
  postUser: IPostsAndTotalRes | null;
}

export const initialState: PostState = {
  postUser: null,
};

type PostPayload = PayloadAction<Pick<PostState, "postUser">>;

const postSlice = createSlice({
  name: "postUserSlices",
  initialState,
  reducers: {
    updatePost: (state, { payload }: PostPayload) => {
      Object.assign(state, payload);
    },
  },
});

export const postSlicesReducers = postSlice.reducer;
export const postSlicesActions = postSlice.actions;
