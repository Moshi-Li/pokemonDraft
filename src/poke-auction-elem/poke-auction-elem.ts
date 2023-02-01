import { LitElement, html, customElement, property, state } from "lit-element";
import { connect } from "pwa-helpers/connect-mixin.js";
import { fetchPokemon, PokemonI } from "../slices/data-slice";
import Store, { RootStoreI } from "../store";

@customElement("poke-auction-elem")
export class PokeAuctionElem extends connect(Store)(LitElement) {
  @state()
  private pokemon: Array<PokemonI> = [];

  stateChanged(state: RootStoreI) {
    this.pokemon = state.dataReducer.pokemon;
    super.requestUpdate();
  }

  async connectedCallback() {
    super.connectedCallback();
    Store.dispatch(fetchPokemon());
  }

  render() {
    return html`
      <style>
        .poke--auction {
          display: flex;
          flex-direction: row;
          padding: 16px;
          background-color: red;
        }
      </style>

      <div class="poke--auction">
        ${this.pokemon.map(
          (item) =>
            html`<poke-card-elem
              pokemon=${JSON.stringify(item)}
            ></poke-card-elem>`
        )}
      </div>
    `;
  }
}
