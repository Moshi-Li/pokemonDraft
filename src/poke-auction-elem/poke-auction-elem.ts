import { LitElement, html, customElement, property, state } from "lit-element";

@customElement("poke-auction-elem")
export class PokeAuctionElem extends LitElement {
  @state()
  private pokeIndexNumbers: Array<Number> = [];

  async connectedCallback() {
    super.connectedCallback();
    const getFiveRandomNumber = (min: number, max: number) => {
      // min and max included
      return new Array(5)
        .fill(0)
        .map(() => Math.floor(Math.random() * (max - min + 1) + min));
    };

    this.pokeIndexNumbers = getFiveRandomNumber(1, 100);
    console.log(this.pokeIndexNumbers);
  }
  render() {
    return html`
      <style>
        .poke--auction {
          display: flex;
          flex-direction: row;
        }
      </style>

      <div class="poke--auction">
        ${this.pokeIndexNumbers.map(
          (index) =>
            html` <poke-card-elem pokeIndexNumber=${index}></poke-card-elem>`
        )}
      </div>
    `;
  }
}
