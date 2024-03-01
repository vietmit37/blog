import { call, put, takeLatest } from "redux-saga/effects";
import axios, { ApiBase, isAxiosResponse } from "@/api-client/axios";
import { postSlicesActions } from "@/redux/reducers/slices/postSlice";
import { PayloadAction } from "@reduxjs/toolkit";
import { IPostsAndTotalRes } from "@/types/post/postRes";
import { postApi } from "@/api-client/post.api";

interface Payload {
  page: number;
  limit?: number;
}
interface Action extends PayloadAction<Payload> {}

const ACTION_NAME = "sagas/post/fetchPostByUser";

export const SYSTEM_AUTH_DONE = "sagas/post/fetchPostByUserDone";
export const fetchPostByUser = (payload: Payload) => ({
  type: ACTION_NAME,
  payload,
});

export const fetchPostByUserDone = () => ({
  type: SYSTEM_AUTH_DONE,
});

function* task(action: Action) {
  try {
    const { page, limit } = action.payload;
    const response: ReturnType<typeof postApi> = yield call(
      postApi,
      page,
      limit,
    );
    if (isAxiosResponse(response) && response.data && response.status === 200) {
      yield put(postSlicesActions.updatePost({ postUser: response.data }));
      yield put(fetchPostByUserDone());
    }
  } catch (error: any) {
    console.log(error);
  }
}

export default function* fetchPostByUserWatcher() {
  yield takeLatest(ACTION_NAME, task);
}
