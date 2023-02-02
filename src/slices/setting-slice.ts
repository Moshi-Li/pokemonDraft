import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SettingI {
  pokeIndexLow: number;
  pokeIndexHigh: number;
  draftCount: number;
  draftState: "drafting" | "ready" | "finished";
}

export interface SettingParamI {
  pokeIndexLow: number;
  pokeIndexHigh: number;
  draftCount: number;
}

const dataDefaultState: SettingI = {
  pokeIndexLow: 0,
  pokeIndexHigh: 100,
  draftCount: 6,
  draftState: "ready",
};

export const settingSlice = createSlice({
  name: "settingSlice",
  initialState: dataDefaultState,
  reducers: {
    startDraft: (state: SettingI, action: PayloadAction<SettingParamI>) => {
      const { pokeIndexLow, pokeIndexHigh, draftCount } = action.payload;

      if (
        pokeIndexHigh <= pokeIndexLow ||
        pokeIndexLow <= 0 ||
        pokeIndexHigh >= 200 ||
        draftCount <= 0
      )
        return;

      state.pokeIndexLow = pokeIndexLow;
      state.pokeIndexHigh = pokeIndexHigh;
      state.draftCount = draftCount;
      state.draftState = "drafting";
    },

    resetDraft: (state: SettingI, action: PayloadAction<void>) => {
      state.draftCount = dataDefaultState.draftCount;
      state.draftState = "ready";
    },

    nextDraft: (state: SettingI, action: PayloadAction<void>) => {
      if (state.draftCount === 1) {
        state.draftState = "finished";
      } else {
        state.draftCount = state.draftCount - 1;
      }
    },
  },
});

export const { startDraft, resetDraft, nextDraft } = settingSlice.actions;
export default settingSlice.reducer;
