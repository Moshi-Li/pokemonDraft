import { LitElement, html, customElement, property, state } from "lit-element";
import { connect } from "pwa-helpers/connect-mixin.js";
import { startDraft } from "../slices/setting-slice";

import Store, { RootStoreI } from "../store";

@customElement("landing-elem")
export class LandingElem extends connect(Store)(LitElement) {
  @state()
  private pokeIndexHigh: number = 100;

  @state()
  private pokeIndexLow: number = 1;

  @state()
  private draftCount: number = 6;

  stateChanged(state: RootStoreI) {
    this.hidden = state.settingReducer.draftState !== "ready";
  }

  connectedCallback(): void {
    super.connectedCallback();
  }

  btnClick(e: PointerEvent) {
    Store.dispatch(
      startDraft({
        pokeIndexLow: this.pokeIndexLow,
        pokeIndexHigh: this.pokeIndexHigh,
        draftCount: this.draftCount,
      })
    );
  }

  inputPokeIndexLowOnChange(e: InputEvent) {
    const input = e.target as HTMLInputElement;
    this.pokeIndexLow = parseInt(input.value);
  }

  inputPokeIndexHighOnChange(e: InputEvent) {
    const input = e.target as HTMLInputElement;
    this.pokeIndexHigh = parseInt(input.value);
  }

  inputDraftCountOnChange(e: InputEvent) {
    const input = e.target as HTMLInputElement;
    this.draftCount = parseInt(input.value);
  }

  render() {
    return html`
      <style>
        .landing--container {
          width: 400px;
        }
      </style>

      <div class="landing">
        <wired-card class="landing--container">
          <h1>Landing</h1>
          <wired-card>
            <wired-input
              type="number"
              value="${this.pokeIndexLow}"
              @change="${this.inputPokeIndexLowOnChange}"
            ></wired-input>
            <wired-input
              type="number"
              value="${this.pokeIndexHigh}"
              @change="${this.inputPokeIndexHighOnChange}"
            ></wired-input>
            <wired-input
              type="number"
              value="${this.draftCount}"
              @change="${this.inputDraftCountOnChange}"
            ></wired-input>
          </wired-card>
          <wired-button @click="${this.btnClick}"
            >Start</wired-button
          ></wired-card
        >
      </div>
    `;
  }
}
