import { LitElement, html, customElement, state } from "lit-element";
import { connect } from "pwa-helpers/connect-mixin.js";
import Store, { RootStoreI } from "./store";

import "./poke-card-elem/poke-card-elem";
import "./poke-draft-elem/poke-draft-elem";
import "./draft-countdown-elem/draft-countdown-elem";
import "./landing-elem/landing-elem";
import "./draft-result-elem/draft-result-elem";
import "./sound-control-elem/sound-control-elem";

@customElement("app-x")
export class AppX extends connect(Store)(LitElement) {
  @state()
  private draftState: "drafting" | "ready" | "finished" = "ready";
  stateChanged(state: RootStoreI) {
    this.draftState = state.settingReducer.draftState;
  }

  render() {
    const style = html` <style>
      .container {
        display: flex;
        justify-content: center;
        height: 100vh;
        align-items: center;
        flex-direction: column;
        font-family: "Gloria Hallelujah", cursive;
      }
    </style>`;

    return this.draftState === "ready"
      ? html`
          ${style}
          <div class="container">
            <landing-elem></landing-elem>
            <draft-result-elem></draft-result-elem>
            <sound-control-elem></sound-control-elem>
          </div>
        `
      : this.draftState === "drafting"
      ? html`
          ${style}
          <div class="container">
            <draft-countdown-elem></draft-countdown-elem>
            <poke-draft-elem></poke-draft-elem>
            <sound-control-elem></sound-control-elem>
          </div>
        `
      : html`
          ${style}
          <div class="container">
            <draft-result-elem></draft-result-elem>
            <sound-control-elem></sound-control-elem>
          </div>
        `;
  }
}
