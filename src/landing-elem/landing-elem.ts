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
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .landing--header {
          flex-grow: 100%;
        }

        .landing--form {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          padding: 20px;
        }
      </style>

      <wired-card>
        <div class="landing--container">
          <h1>Pokemon Draft</h1>

          <wire-card>
            <div class="landing--form">
              <div class="landing--row">
                <span>Pokemon Index Left Bound (1-150) : </span>
                <wired-input
                  type="number"
                  value="${this.pokeIndexLow}"
                  @change="${this.inputPokeIndexLowOnChange}"
                ></wired-input>
              </div>

              <div class="landing--row">
                <span>Pokemon Index Right Bound (1-150) : </span>
                <wired-input
                  type="number"
                  value="${this.pokeIndexHigh}"
                  @change="${this.inputPokeIndexHighOnChange}"
                ></wired-input>
              </div>

              <div class="landing--row">
                <span># of Pokemon to be Drafted : </span>
                <wired-input
                  type="number"
                  value="${this.draftCount}"
                  @change="${this.inputDraftCountOnChange}"
                >
                </wired-input>
              </div></div
          ></wire-card>

          <wired-button @click="${this.btnClick}">Start</wired-button>
        </div>
      </wired-card>
    `;
  }
}
