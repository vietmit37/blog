import { call, put, takeLatest } from "redux-saga/effects";
import { systemUserSlicesActions } from "@/redux/reducers/slices/systemAuthSlice";
import { authApi } from "@/api-client/auth/auth.api";
import { isAxiosResponse } from "@/api-client/axios";

const ACTION_NAME = "sagas/auth/systemAuth";

export const SYSTEM_AUTH_DONE = "sagas/auth/systemAuthDone";
export const fetchSystemAuth = () => ({
  type: ACTION_NAME,
});

export const systemAuthDone = () => ({
  type: SYSTEM_AUTH_DONE,
});

function* task() {
  try {
    const response: ReturnType<typeof authApi> = yield call(authApi);
    if (isAxiosResponse(response) && response.data && response.status === 200) {
      yield put(
        systemUserSlicesActions.updateSystemUser({ systemUser: response.data }),
      );
      yield put(
        systemUserSlicesActions.updateIsLoggedIn({
          isLoggedIn: true,
        }),
      );
      yield put(systemAuthDone());
    }
  } catch (error: any) {
    console.log(error);
  }
}

export default function* systemAuthWatcher() {
  yield takeLatest(ACTION_NAME, task);
}
