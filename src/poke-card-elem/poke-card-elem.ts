import { LitElement, html, customElement, property, state } from "lit-element";
import { PokemonI } from "../slices/data-slice";
import Axios from "axios";

interface PokeStateI {
  key: string;
  value: any;
}

@customElement("poke-card-elem")
export class PokeCardElem extends LitElement {
  @state()
  private imageLink: string = "";
  @state()
  private pokeStats: Array<PokeStateI> = [];
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

  render() {
    return html`
      <style>
        .poke--card {
          background-color: transparent;
          width: 250px;
          padding: 20px;
          border: 1px solid black;
        }
        .poke--card img {
          width: 80%;
          background-color: white;
        }

        .poke--info--container {
          width: 100%;
          margin-top: 6px;
          border: 1px solid black;
          padding: 6px;

          display: flex;
          flex-direction: column;

          justify-content: space-between;
        }
        .poke--info--stat {
          width: 70%;
          margin: 4px;
        }
      </style>

      <div class="poke--card">
        <img src="${this.imageLink}" />

        <div class="poke--info--container">
          ${this.pokeStats.map(
            (state: PokeStateI) => html`<div class="poke--info--stat">
              <span>${state.key}: </span><span>${state.value}</span>
            </div>`
          )}
        </div>
      </div>
    `;
  }
}
