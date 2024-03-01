import { IUserRes } from "@/types/user/userRes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SystemUserState {
  systemUser: IUserRes | null;
  isLoggedIn: boolean;
}

export const initialState: SystemUserState = {
  systemUser: null,
  isLoggedIn: false,
};

type SystemUserPayload = PayloadAction<Pick<SystemUserState, "systemUser">>;
type SystemIsLooggedPayload = PayloadAction<
  Pick<SystemUserState, "isLoggedIn">
>;

const systemAuthSlice = createSlice({
  name: "systemUserSlices",
  initialState,
  reducers: {
    updateSystemUser: (state, { payload }: SystemUserPayload) => {
      Object.assign(state, payload);
    },
    updateIsLoggedIn: (state, { payload }: SystemIsLooggedPayload) => {
      Object.assign(state, payload);
    },
  },
});

export const systemUserSlicesReducers = systemAuthSlice.reducer;
export const systemUserSlicesActions = systemAuthSlice.actions;
