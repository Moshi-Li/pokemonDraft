import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { state } from "lit-element";
import { v4 as uuid } from "uuid";

interface PokemonBidI {
  price: number;
  userId: string;
  pokemonId: string;
  pokemonIndex: number;
}

export interface PokemonI {
  pokemonIndex: number;
  pokemonId: string;
  currentHigh: number;
  bids: Array<PokemonBidI>;
}

export interface DataI {
  pokemon: Array<PokemonI>;
  topPokemonBids: Array<PokemonBidI>;
}

const dataDefaultState: DataI = {
  pokemon: [],
  topPokemonBids: [],
};

const getRandomNumber = (min: number, max: number) => {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const dataSlice = createSlice({
  name: "dataSlice",
  initialState: dataDefaultState,
  reducers: {
    fetchPokemon: (state: DataI, action: PayloadAction<void>) => {
      const nextPokemon: Array<PokemonI> = new Array(5).fill(0).map(() => {
        return {
          pokemonIndex: getRandomNumber(1, 100),
          pokemonId: uuid(),
          currentHigh: 0,
          bids: [],
        };
      });
      state.pokemon = nextPokemon;
    },
    bidPokemon: (state: DataI, action: PayloadAction<PokemonBidI>) => {
      console.log("==== Bid ===");
      console.log(action.payload);
      const { pokemonId, price } = action.payload;

      state.pokemon.forEach((item) => {
        if (item.pokemonId === pokemonId && item.currentHigh < price) {
          item.bids.unshift(action.payload);
          item.currentHigh = price;
          state.topPokemonBids.push({ ...action.payload });
          state.topPokemonBids.sort((a, b) => a.price - b.price);
        }
      });
    },
  },
});

export const { fetchPokemon, bidPokemon } = dataSlice.actions;
export default dataSlice.reducer;
