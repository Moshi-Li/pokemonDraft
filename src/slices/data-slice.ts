import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { state } from "lit-element";
import { v4 as uuid } from "uuid";

export interface PokemonBidI {
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
  auctionEndTime: number;
}

const dataDefaultState: DataI = {
  pokemon: [],
  topPokemonBids: [],
  auctionEndTime: 0,
};

const getRandomNumber = (min: number, max: number) => {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const AUCTION_TIME = 10 * 1000 - 1;

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
      state.auctionEndTime = new Date().getTime() + AUCTION_TIME;
    },

    bidPokemon: (state: DataI, action: PayloadAction<PokemonBidI>) => {
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

    renewAuction: (state: DataI, action: PayloadAction<void>) => {
      const nextPokemon = state.pokemon
        .filter((item) => {
          return item.bids.length === 0;
        })
        .map((item) => {
          return { ...item };
        });

      while (nextPokemon.length < 5)
        nextPokemon.push({
          pokemonIndex: getRandomNumber(1, 100),
          pokemonId: uuid(),
          currentHigh: 0,
          bids: [],
        });

      state.pokemon = nextPokemon;
      state.auctionEndTime = new Date().getTime() + AUCTION_TIME;
    },
  },
});

export const { fetchPokemon, bidPokemon, renewAuction } = dataSlice.actions;
export default dataSlice.reducer;
