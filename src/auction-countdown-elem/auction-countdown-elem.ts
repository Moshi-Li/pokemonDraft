import { LitElement, html, customElement, property, state } from "lit-element";
import { connect } from "pwa-helpers/connect-mixin.js";

import { draftPokemon } from "../slices/data-slice";
import { nextDraft } from "../slices/setting-slice";
import Store, { RootStoreI } from "../store";

@customElement("auction-countdown-elem")
export class AuctionCountdownElem extends connect(Store)(LitElement) {
  @state()
  private draftEndTime: number = 0;

  @state()
  private currentTime: number = new Date().getTime();

  @state()
  private intervalPointer: ReturnType<typeof setInterval> | null = null;

  stateChanged(state: RootStoreI) {
    this.draftEndTime = state.dataReducer.draftEndTime;
    this.currentTime = new Date().getTime();
    this.hidden = state.settingReducer.draftState !== "drafting";
  }

  async connectedCallback() {
    super.connectedCallback();
    if (this.intervalPointer === null) {
      this.intervalPointer = setInterval(() => {
        if (this.draftEndTime <= this.currentTime && !this.hidden) {
          Store.dispatch(draftPokemon());
          Store.dispatch(nextDraft());
        } else {
          this.currentTime = new Date().getTime();
        }
      }, 100);
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this.intervalPointer !== null) clearInterval(this.intervalPointer);
    this.intervalPointer = null;
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

      <div class="countdown--container">
        <h1>
          ${this.draftEndTime && this.draftEndTime - this.currentTime > 0
            ? ((this.draftEndTime - this.currentTime) / 1000).toFixed(1)
            : "0.00"}
        </h1>
      </div>
    `;
  }
}
