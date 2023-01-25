import { configureStore } from "@reduxjs/toolkit";
import dataReducer from "../src/slices/data-slice";

const Store = configureStore({
  reducer: { dataReducer },
});

export type RootStoreI = ReturnType<typeof Store.getState>;
export default Store;
