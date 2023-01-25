import { LitElement, html, customElement, property, state } from "lit-element";
import Store, { RootStoreI } from "../store";
import { PokemonI, bidPokemon } from "../slices/data-slice";
import Axios from "axios";

interface PokeStateI {
  key: string;
  value: any;
}

@customElement("poke-card-elem")
export class PokeCardElem extends LitElement {
  @state()
  private imageLink: string = "0";
  @state()
  private pokeStats: Array<PokeStateI> = [];

  @state()
  private bidInputValue: string = "";

  @property({ type: Object }) pokemon: PokemonI = {
    pokemonIndex: 0,
    pokemonId: "",
    currentHigh: 0,
    bids: [],
  };

  async load() {
    try {
      const response = await Axios.get(
        `https://pokeapi.co/api/v2/pokemon/${this.pokemon.pokemonIndex}`
      );

      const { name, stats, id } = response.data;

      const nextPokeStats = [
        { key: "name", value: name },
        { key: "id", value: id },
      ];

      stats.forEach((state: any) => {
        nextPokeStats.push({ key: state.stat.name, value: state.base_stat });
      });

      this.imageLink = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${this.pokemon.pokemonIndex}.png`;
      this.pokeStats = nextPokeStats;
    } catch (e) {
      console.log("error while loading");
    }
  }

  async connectedCallback() {
    super.connectedCallback();
    await this.load();
  }

  private bidClick() {
    const bidPrice = parseInt(this.bidInputValue);
    if (typeof bidPrice !== "number" || bidPrice <= this.pokemon.currentHigh)
      return;

    Store.dispatch(
      bidPokemon({
        price: bidPrice,
        userId: "Unknown",
        pokemonId: this.pokemon.pokemonId,
        pokemonIndex: this.pokemon.pokemonIndex,
      })
    );
  }

  private updateBidInputValue(e: InputEvent) {
    const input = e.target as HTMLInputElement;
    this.bidInputValue = input.value;
  }

  render() {
    return html`
      <style>
        .pokemon--card {
          background-color: transparent;
          width: 250px;
          padding: 20px;
          border: 1px solid black;
        }
        .pokemon--card img {
          width: 80%;
          background-color: white;
        }

        .pokemon--info--container {
          width: 100%;
          margin-top: 6px;
          border: 1px solid black;
          padding: 6px;

          display: flex;
          flex-direction: column;

          justify-content: space-between;
        }
        .pokemon--info--stat {
          width: 70%;
          margin: 4px;
        }

        .pokemon--bid--section {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
        }

        .pokemon--bid--section button {
          cursor: pointer;
        }

        .pokemon--bid--section p {
          margin: 6px 0;
        }
        .pokemon--bid--section input {
          width: 100px;
          margin: 6px 0;
        }
      </style>

      <div class="pokemon--element">
        <div class="pokemon--card">
          <img src="${this.imageLink}" />

          <div class="pokemon--info--container">
            ${this.pokeStats.map(
              (state: PokeStateI) => html`<div class="pokemon--info--stat">
                <span>${state.key}: </span><span>${state.value}</span>
              </div>`
            )}
          </div>
        </div>
        <div class="pokemon--bid--section">
          <p>current price: ${this.pokemon.currentHigh}</p>
          <input
            value="${this.bidInputValue}"
            @change="${this.updateBidInputValue}"
          />

          <button class="pokemon" @click="${this.bidClick}">Bid</button>
        </div>
      </div>
    `;
  }
}
