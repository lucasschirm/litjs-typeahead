/**
 * @license
 * Copyright 2024 Lucas Schirm
 * SPDX-License-Identifier: Apache-2.0
 */

import {LitElement, html, css, nothing, type PropertyValues} from 'lit';
import {customElement, property} from 'lit/decorators.js';

let listIdCounter = 0;

/**
 * A typeahead web component backed by a native `<input>` +
 * `<datalist>` pair.
 *
 * @fires change - Fired when the user selects or types a value. The
 * selected value is available on `event.detail.value`.
 */
@customElement('lit-typeahead')
export class LitTypeahead extends LitElement {
  static override styles = css`
    :host {
      display: block;
    }

    input {
      box-sizing: border-box;
      width: 100%;
      font: inherit;
      color: var(--typeahead-text-color, #000);
      background-color: var(--typeahead-background-color, #fff);
      border: 1px solid var(--typeahead-border-color, #767676);
      border-radius: var(--typeahead-border-radius, 4px);
      padding: var(--typeahead-padding, 8px);
    }

    input:focus-visible {
      outline: 2px solid var(--typeahead-focus-outline-color, #0b5fff);
      outline-offset: 2px;
    }
  `;

  /** Name applied to the underlying `<input>`, used when submitting a form. */
  @property({type: String}) name = '';

  /** List of options shown to the user in the datalist. */
  @property({type: Array}) items: string[] = [];

  /** Placeholder text shown in the input when it is empty. */
  @property({type: String}) placeholder = '';

  /** When true, the first item is selected by default. */
  @property({type: Boolean, attribute: 'select-first'}) selectFirst = false;

  /** Current value of the input. */
  @property({type: String}) value = '';

  private readonly _listId = `lit-typeahead-list-${listIdCounter++}`;

  protected override willUpdate(changed: PropertyValues<this>) {
    if (
      (changed.has('items') || changed.has('selectFirst')) &&
      this.selectFirst &&
      !this.value &&
      this.items.length > 0
    ) {
      this.value = this.items[0];
    }
  }

  override render() {
    const id = this.id || undefined;
    return html`
      <input
        type="text"
        id=${id ?? nothing}
        name=${this.name || nothing}
        list=${this._listId}
        placeholder=${this.placeholder || nothing}
        aria-label=${this.placeholder || this.name || nothing}
        .value=${this.value}
        @change=${this._handleChange}
      />
      <datalist id=${this._listId}>
        ${this.items.map((item) => html`<option value=${item}></option>`)}
      </datalist>
    `;
  }

  private _handleChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: {value: this.value},
        bubbles: true,
        composed: true,
      })
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lit-typeahead': LitTypeahead;
  }
}
