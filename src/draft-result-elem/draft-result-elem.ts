import { LitElement, html, customElement, property, state } from "lit-element";
import { connect } from "pwa-helpers/connect-mixin.js";

import { resetDataReducer, PokemonI } from "../slices/data-slice";
import { resetDraft } from "../slices/setting-slice";

import { CardClickEvent } from "../poke-card-elem/poke-card-elem";

import Store, { RootStoreI } from "../store";

@customElement("draft-result-elem")
export class DraftResultElem extends connect(Store)(LitElement) {
  @state()
  private draftedPokemon: Array<PokemonI> = [];

  @state()
  private selectedPokemonIndex: number = -2;

  stateChanged(state: RootStoreI) {
    this.draftedPokemon = state.dataReducer.draftedPokemon;
    this.hidden = state.settingReducer.draftState !== "finished";
  }

  cardClick(e: CustomEvent<CardClickEvent>) {
    this.selectedPokemonIndex = e.detail.index;

    this.requestUpdate();
  }

  btnClick(e: PointerEvent) {
    Store.dispatch(resetDataReducer());
    Store.dispatch(resetDraft());
  }

  render() {
    return html`
      <style>
        .result--container {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .poke--draft {
          display: flex;
          flex-direction: row;
          padding: 16px;
        }
      </style>

      <div class="result--container">
        <wire-card><h2>Draft Result</h2></wire-card>
        <div class="poke--draft">
          ${this.draftedPokemon.map((item, index) => {
            return html`<poke-card-elem
              ?cardSelected=${this.selectedPokemonIndex === index}
              @card-clicked=${this.cardClick}
              pokemonIndex=${index}
              pokemon=${JSON.stringify(item)}
            ></poke-card-elem>`;
          })}
        </div>

        <wired-button @click="${this.btnClick}">Back to Menu</wired-button>
      </div>
    `;
  }
}
