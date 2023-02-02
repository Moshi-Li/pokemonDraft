import { configureStore } from "@reduxjs/toolkit";
import dataReducer from "../src/slices/data-slice";
import settingReducer from "../src/slices/setting-slice";

const Store = configureStore({
  reducer: { dataReducer, settingReducer },
});

export type RootStoreI = ReturnType<typeof Store.getState>;
export default Store;
