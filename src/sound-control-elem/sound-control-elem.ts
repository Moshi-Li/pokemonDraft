import { LitElement, html, customElement, state } from "lit-element";
import { connect } from "pwa-helpers/connect-mixin.js";
import Store, { RootStoreI } from "../store";
import { setVolumeValue } from "../slices/setting-slice";

@customElement("sound-control-elem")
export class SoundControlElem extends connect(Store)(LitElement) {
  @state()
  private volumeValue: number = 3;
  stateChanged(state: RootStoreI) {
    this.volumeValue = state.settingReducer.volumeValue;
  }

  volumeControlOnChange(e: InputEvent) {
    const input = e.target as HTMLInputElement;
    const inputValue = parseInt(input.value);

    Store.dispatch(setVolumeValue(inputValue));
  }

  render() {
    const style = html` <style>
      .volume--controller {
        position: fixed;
        left: 6px;
        bottom: 6px;
        display: flex;
        flex-direction: row;
        align-items: center;
      }
      svg {
        margin-right: 6px;
      }
    </style>`;

    return html` ${style}
      <div class="volume--controller">
        <svg
          fill="#000000"
          height="20px"
          width="20px"
          version="1.1"
          id="Layer_1"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 330 330"
          xml:space="preserve"
        >
          <g id="XMLID_531_">
            <path
              id="XMLID_532_"
              d="M255,210h-10c-8.284,0-15,6.716-15,15c0,8.284,6.716,15,15,15h10c8.284,0,15-6.716,15-15
		C270,216.716,263.284,210,255,210z"
            />
            <path
              id="XMLID_533_"
              d="M285,150h-40c-8.284,0-15,6.716-15,15c0,8.284,6.716,15,15,15h40c8.284,0,15-6.716,15-15
		C300,156.716,293.284,150,285,150z"
            />
            <path
              id="XMLID_534_"
              d="M315,90h-70c-8.284,0-15,6.716-15,15s6.716,15,15,15h70c8.284,0,15-6.716,15-15S323.284,90,315,90z"
            />
            <path
              id="XMLID_535_"
              d="M192.078,31.775c-4.878-2.61-10.796-2.324-15.398,0.744L90.459,90H15c-8.284,0-15,6.716-15,15v120
		c0,8.284,6.716,15,15,15h75.459l86.221,57.481c2.51,1.673,5.411,2.519,8.321,2.519c2.427,0,4.859-0.588,7.077-1.775
		c4.877-2.61,7.922-7.693,7.922-13.225V45C200,39.468,196.955,34.385,192.078,31.775z M170,256.972l-66.68-44.453
		C100.856,210.876,97.961,210,95,210H30v-90h65c2.961,0,5.856-0.876,8.32-2.519L170,73.028V256.972z"
            />
          </g>
        </svg>

        <wired-slider
          value="${this.volumeValue}"
          min="0"
          max="10"
          class="wired-rendered"
          @change="${this.volumeControlOnChange}"
        ></wired-slider>
      </div>`;
  }
}
