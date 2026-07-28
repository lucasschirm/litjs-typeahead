/**
 * @license
 * Copyright 2024 Lucas Schirm
 * SPDX-License-Identifier: Apache-2.0
 */

import {LitElement, html, css} from 'lit';
import {customElement} from 'lit/decorators.js';

/**
 * A typeahead web component.
 *
 * @slot - Content to render inside the typeahead
 */
@customElement('lit-typeahead')
export class LitTypeahead extends LitElement {
  static override styles = css`
    :host {
      display: block;
    }
  `;

  override render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lit-typeahead': LitTypeahead;
  }
}
