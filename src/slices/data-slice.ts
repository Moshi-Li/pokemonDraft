import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { state } from "lit-element";
import { v4 as uuid } from "uuid";

export interface PokemonI {
  pokemonIndex: number;
  pokemonId: string;
}

export interface DataI {
  pokemonPool: Array<PokemonI>;
  draftedPokemon: Array<PokemonI>;
  draftEndTime: number;
  pendingDraft: PokemonI | null;
}

const dataDefaultState: DataI = {
  pokemonPool: [],
  draftedPokemon: [],
  draftEndTime: 0,
  pendingDraft: null,
};

const getRandomNumber = (min: number, max: number) => {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const DRAFT_TIME = 10 * 1000 - 1;

export const dataSlice = createSlice({
  name: "dataSlice",
  initialState: dataDefaultState,
  reducers: {
    renewPokemonPool: (state: DataI, action: PayloadAction<void>) => {
      const nextPokemonPool: Array<PokemonI> = new Array(5).fill(0).map(() => {
        return {
          pokemonIndex: getRandomNumber(1, 100),
          pokemonId: uuid(),
          currentHigh: 0,
          bids: [],
        };
      });
      state.pokemonPool = nextPokemonPool;
      state.draftEndTime = new Date().getTime() + DRAFT_TIME;
    },

    draftPokemon: (state: DataI, action: PayloadAction<void>) => {
      if (state.pendingDraft === null) {
        state.draftedPokemon.push(state.pokemonPool[0]);
      } else {
        state.draftedPokemon.push(state.pendingDraft);
      }

      const nextPokemonPool: Array<PokemonI> = new Array(5).fill(0).map(() => {
        return {
          pokemonIndex: getRandomNumber(1, 100),
          pokemonId: uuid(),
          currentHigh: 0,
          bids: [],
        };
      });

      state.pokemonPool = nextPokemonPool;
      state.draftEndTime = new Date().getTime() + DRAFT_TIME;
    },

    setPendingDraft: (state: DataI, action: PayloadAction<PokemonI>) => {
      state.pendingDraft = { ...action.payload };
    },

    resetDataReducer: (state: DataI, action: PayloadAction<void>) => {
      console.log("resetDataReducer");
      state.pokemonPool = [];
      state.draftedPokemon = [];
      state.draftEndTime = 0;
      state.pendingDraft = null;
    },
  },
});

export const {
  renewPokemonPool,
  draftPokemon,
  setPendingDraft,
  resetDataReducer,
} = dataSlice.actions;
export default dataSlice.reducer;
