import { LitElement, html, customElement, property, state } from "lit-element";
import Store, { RootStoreI } from "../store";
import { PokemonI } from "../slices/data-slice";
import Axios from "axios";

interface PokeStateI {
  key: string;
  value: any;
}

export interface CardClickEvent {
  index: number;
}

@customElement("poke-card-elem")
export class PokeCardElem extends LitElement {
  @state()
  private pokeStats: Array<PokeStateI> = [];

  @property({ type: Number }) pokemonIndex: number = -1;

  @property({ type: Boolean }) cardSelected: boolean = false;

  @property({ type: Object }) pokemon: PokemonI = {
    pokemonIndex: 0,
    pokemonId: "",
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

      this.pokeStats = nextPokeStats;
    } catch (e) {
      console.log("error while loading");
    }
  }

  async connectedCallback() {
    super.connectedCallback();
    await this.load();
  }

  cardClick() {
    this.dispatchEvent(
      new CustomEvent<CardClickEvent>("card-clicked", {
        bubbles: true,
        detail: {
          index: this.pokemonIndex,
        },
      })
    );
  }

  render() {
    return html`
      <style>
        .pokemon--element {
          margin: 6px;
          cursor: pointer;
        }

        .pokemon--element--selected {
          transform: translateY(-10px);
        }

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
        }

        .pokemon--info--stat {
          display: flex;
          flex-direction: row;
          padding: 6px;
        }

        .pokemon--info--img {
          display: flex;
          align-items: center;
          flex-direction: column;
        }
      </style>

      <div class="pokemon--element" @click="${this.cardClick}">
        <wired-card
          elevation="${this.cardSelected ? "10" : "1"}"
          class="${this.cardSelected ? "pokemon--element--selected" : ""}"
        >
          <div class="pokemon--card">
            <wired-image
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${this
                .pokemon.pokemonIndex}.png"
              class="pokemon--info--img"
            ></wired-image>

            <wired-card class="pokemon--info--container">
              ${this.pokeStats.map(
                (state: PokeStateI) => html`<div class="pokemon--info--stat">
                  <span>${state.key}: </span><span>${state.value}</span>
                </div>`
              )}</wired-card
            >
          </div></wired-card
        >
      </div>
    `;
  }
}
