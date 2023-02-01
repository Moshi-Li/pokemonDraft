import { LitElement, html, customElement, property, state } from "lit-element";
import { connect } from "pwa-helpers/connect-mixin.js";
import { renewAuction } from "../slices/data-slice";
import Store, { RootStoreI } from "../store";

@customElement("auction-countdown-elem")
export class AuctionCountdownElem extends connect(Store)(LitElement) {
  @state()
  private auctionEndTime: number = 0;

  @state()
  private currentTime: number = new Date().getTime();

  @state()
  private intervalPointer: ReturnType<typeof setInterval> | null = null;

  stateChanged(state: RootStoreI) {
    this.auctionEndTime = state.dataReducer.auctionEndTime;
    this.currentTime = new Date().getTime();
  }

  async connectedCallback() {
    super.connectedCallback();
    if (this.intervalPointer === null) {
      this.intervalPointer = setInterval(() => {
        if (this.auctionEndTime <= this.currentTime) {
          Store.dispatch(renewAuction());
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
          ${this.auctionEndTime && this.auctionEndTime - this.currentTime > 0
            ? ((this.auctionEndTime - this.currentTime) / 1000).toFixed(1)
            : "0.00"}
        </h1>
      </div>
    `;
  }
}
