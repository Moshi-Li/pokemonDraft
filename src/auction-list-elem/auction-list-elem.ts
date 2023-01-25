import { LitElement, html, customElement, property, state } from "lit-element";
import { connect } from "pwa-helpers/connect-mixin.js";
import { PokemonBidI, bidPokemon } from "../slices/data-slice";
import Store, { RootStoreI } from "../store";

@customElement("auction-list-elem")
export class AuctionListElem extends connect(Store)(LitElement) {
  @state()
  private bidsList: Array<PokemonBidI> = [];

  stateChanged(state: RootStoreI) {
    this.bidsList = state.dataReducer.topPokemonBids;
  }
  render() {
    return html` <style>
        .pokemon--auction--list {
          display: flex;
          flex-direction: column;
          border: 1px solid black;
          height: 200px;
          width: 700px;
          padding: 6px;
          margin-bottom: 16px;
          overflow-y: scroll;

          text-align: center;
        }
        .pokemon--auction--item {
          margin: 2px 0;
        }
      </style>

      <div class="pokemon--auction--list">
        <h3>Latest High Bids</h3>
        ${this.bidsList.map(
          (item) =>
            html`<div class="pokemon--auction--item">
              <p>
                User ${item.userId} just bid ${item.pokemonId} for amount of
                ${item.price}
              </p>
            </div>`
        )}
      </div>`;
  }
}
