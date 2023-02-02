import { LitElement, html, customElement, property, state } from "lit-element";
import { connect } from "pwa-helpers/connect-mixin.js";
import {
  renewPokemonPool,
  draftPokemon,
  setPendingDraft,
  PokemonI,
} from "../slices/data-slice";
import { nextDraft } from "../slices/setting-slice";
import Store, { RootStoreI } from "../store";
import { CardClickEvent } from "../poke-card-elem/poke-card-elem";

@customElement("poke-draft-elem")
export class PokeDraftElem extends connect(Store)(LitElement) {
  @state()
  private pokemonPool: Array<PokemonI> = [];

  @state()
  private selectedPokemonIndex: number = -2;

  stateChanged(state: RootStoreI) {
    this.pokemonPool = state.dataReducer.pokemonPool;
    this.hidden = state.settingReducer.draftState !== "drafting";
    super.requestUpdate();
  }

  async connectedCallback() {
    super.connectedCallback();
    Store.dispatch(renewPokemonPool());
  }

  cardClick(e: CustomEvent<CardClickEvent>) {
    this.selectedPokemonIndex = e.detail.index;
    Store.dispatch(
      setPendingDraft(this.pokemonPool[this.selectedPokemonIndex])
    );
    this.requestUpdate();
  }

  btnClick(e: PointerEvent) {
    Store.dispatch(draftPokemon());
    Store.dispatch(nextDraft());
    this.selectedPokemonIndex = -2;
  }

  render() {
    return html`
      <style>
        .poke--draft {
          display: flex;
          flex-direction: row;
          padding: 16px;
        }
        .draft--container {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
      </style>
      <div class="draft--container">
        <div class="poke--draft">
          ${this.pokemonPool.map((item, index) => {
            return html`<poke-card-elem
              ?cardSelected=${this.selectedPokemonIndex === index}
              @card-clicked=${this.cardClick}
              pokemonIndex=${index}
              pokemon=${JSON.stringify(item)}
            ></poke-card-elem>`;
          })}
        </div>
        <wired-button @click="${this.btnClick}">Draft</wired-button>
      </div>
    `;
  }
}
