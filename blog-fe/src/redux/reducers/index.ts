import { combineReducers } from "redux";
import {
  systemUserSlicesReducers,
  SystemUserState,
} from "@/redux/reducers/slices/systemAuthSlice";
import {
  postSlicesReducers,
  PostState,
} from "@/redux/reducers/slices/postSlice";

export interface GlobalState {
  authState: SystemUserState;
  postState: PostState;
}
export const rootReducer = combineReducers({
  authState: systemUserSlicesReducers,
  postState: postSlicesReducers,
});

export type RootState = ReturnType<typeof rootReducer>;
