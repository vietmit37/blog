import { all } from "redux-saga/effects";
import systemAuthWatcher from "@/redux/sagas/auth/systemAuth";
import fecthPostByUserWatcher from "@/redux/sagas/post/fetchPostByUser";

export default function* rootSaga() {
  yield all([systemAuthWatcher(), fecthPostByUserWatcher()]);
}
