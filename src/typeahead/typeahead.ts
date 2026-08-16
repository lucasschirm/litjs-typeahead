/**
 * @license
 * Copyright 2024 Lucas Schirm
 * SPDX-License-Identifier: Apache-2.0
 */

import {LitElement, html, css, nothing, type PropertyValues} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';

let listIdCounter = 0;

/**
 * A typeahead web component.
 *
 * By default it renders an `<input>` with a custom dropdown. Set `use-native`
 * to fall back to the legacy `<input>` + `<datalist>` implementation.
 *
 * The custom dropdown renders a toggle icon to the right of the input. The
 * default icon is an animated chevron that points down when the dropdown is
 * closed and up when it is open. Consumers can replace the icon by slotting
 * their own markup into the `toggle-icon` named slot:
 *
 * ```html
 * <lit-typeahead .items=${items}>
 *   <svg slot="toggle-icon" viewBox="0 0 24 24">…</svg>
 * </lit-typeahead>
 * ```
 *
 * @fires change - Fired when the user selects or types a value. The selected
 * value is available on `event.detail.value`.
 * @fires item-selected - Fired when an item is selected from the custom
 * dropdown, or when the value of the native datalist input matches an item.
 * The selected value is available on `event.detail.value`.
 */
@customElement('lit-typeahead')
export class LitTypeahead extends LitElement {
  static override styles = css`
    :host {
      display: block;
      position: relative;
    }

    .typeahead {
      position: relative;
    }

    .input-wrapper {
      position: relative;
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
      /* Reserve room for the toggle icon on the right edge. */
      padding-right: calc(
        var(--typeahead-padding, 8px) + var(--typeahead-icon-size, 18px) + 14px
      );
    }

    input:focus-visible {
      outline: 2px solid var(--typeahead-focus-outline-color, #0b5fff);
      outline-offset: 2px;
    }

    .toggle-icon {
      position: absolute;
      top: 50%;
      right: 4px;
      /* Vertically center regardless of border height. */
      transform: translateY(-50%);
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 4px;
      margin: 0;
      width: calc(var(--typeahead-icon-size, 18px) + 10px);
      height: calc(var(--typeahead-icon-size, 18px) + 10px);
      /* Keep the icon visually anchored but allow the cursor to reach it. */
      background: transparent;
      border: 0;
      color: var(--typeahead-icon-color, #5a5a5a);
      cursor: pointer;
      border-radius: 4px;
      transition: color 180ms ease, background-color 180ms ease;
    }

    .toggle-icon:hover {
      color: var(--typeahead-icon-color-hover, #0b5fff);
      background-color: var(
        --typeahead-icon-background-hover,
        rgba(11, 95, 255, 0.08)
      );
    }

    .toggle-icon:focus-visible {
      outline: 2px solid var(--typeahead-focus-outline-color, #0b5fff);
      outline-offset: 2px;
    }

    /*
      The default chevron SVG is provided as the slot's fallback content so it
      can be replaced by the consumer. All default-icon styling targets
      toggle-icon-svg so consumers' slotted content is unaffected.
    */
    .toggle-icon-svg {
      width: var(--typeahead-icon-size, 18px);
      height: var(--typeahead-icon-size, 18px);
      display: block;
      overflow: visible;
    }

    .toggle-icon-svg .chevron-frame {
      /* This rect rotates around its own center (12,12) when the dropdown
         opens, giving the icon a "swivel" feel. */
      transform-origin: 12px 12px;
      transform: rotate(0deg);
      transition: transform 380ms cubic-bezier(0.34, 1.2, 0.64, 1);
    }

    .toggle-icon-svg .chevron-main,
    .toggle-icon-svg .chevron-echo {
      transform-origin: 12px 13px;
      transition:
        transform 320ms cubic-bezier(0.34, 1.32, 0.64, 1),
        opacity 280ms ease;
    }

    /*
     * When open: chevron points up (rotated 180deg), the rotated frame keeps
     * the visual balanced, the "echo" trail appears, and the pulse dot lights
     * up so the user sees the dropdown is now "broadcasting" upward.
     */
    .is-open .toggle-icon-svg .chevron-frame {
      transform: rotate(180deg);
    }

    .is-open .toggle-icon-svg .chevron-main {
      transform: rotate(180deg);
    }

    .is-open .toggle-icon-svg .chevron-echo {
      transform: rotate(180deg) translateY(-2px);
      opacity: 0.55;
      animation-duration: 1s;
    }

    .toggle-icon-svg .chevron-echo {
      opacity: 0;
      animation: typeahead-echo-glow 1.8s ease-in-out infinite;
    }

    .toggle-icon-svg .pulse-dot {
      fill: currentColor;
      stroke: none;
      opacity: 0;
      transform-origin: 12px 6px;
      transition: opacity 220ms ease, transform 320ms ease-out;
      animation: typeahead-pulse 1.8s ease-in-out infinite;
    }

    .is-open .toggle-icon-svg .pulse-dot {
      opacity: 0.75;
      transform: translateY(-1px) scale(1.1);
    }

    @keyframes typeahead-echo-glow {
      0%,
      100% {
        opacity: 0;
      }
      50% {
        opacity: 0.4;
      }
    }

    @keyframes typeahead-pulse {
      0%,
      100% {
        opacity: 0;
        transform: scale(0.6);
      }
      50% {
        opacity: 0.9;
        transform: scale(1.4);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .toggle-icon-svg .chevron-frame,
      .toggle-icon-svg .chevron-main,
      .toggle-icon-svg .chevron-echo,
      .toggle-icon-svg .pulse-dot,
      .toggle-icon {
        animation: none;
        transition: none;
      }
    }

    .dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      z-index: 10;
      box-sizing: border-box;
      margin: 4px 0 0;
      padding: 4px 0;
      list-style: none;
      max-height: var(--typeahead-max-height, 240px);
      overflow-y: auto;
      background-color: var(--typeahead-background-color, #fff);
      border: 1px solid var(--typeahead-border-color, #767676);
      border-radius: var(--typeahead-border-radius, 4px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .dropdown li {
      padding: var(--typeahead-option-padding, 8px);
      cursor: pointer;
      color: var(--typeahead-text-color, #000);
    }

    .dropdown li.active,
    .dropdown li:hover {
      background-color: var(--typeahead-highlight-color, #e6f0ff);
    }
  `;

  /** Name applied to the underlying `<input>`, used when submitting a form. */
  @property({type: String}) name = '';

  /** List of options shown to the user. */
  @property({type: Array}) items: string[] = [];

  /** Placeholder text shown in the input when it is empty. */
  @property({type: String}) placeholder = '';

  /** When true, the first item is selected by default. */
  @property({type: Boolean, attribute: 'select-first'}) selectFirst = false;

  /** Current value of the input. */
  @property({type: String}) value = '';

  /**
   * When true, renders the legacy `<input>` + `<datalist>` implementation.
   * When false (default), renders a custom dropdown.
   */
  @property({type: Boolean, attribute: 'use-native'}) useNative = false;

  @state() private _isOpen = false;
  @state() private _filteredItems: string[] = [];
  @state() private _activeIndex = -1;

  private readonly _listId = `lit-typeahead-list-${listIdCounter++}`;
  private readonly _listboxId = `lit-typeahead-listbox-${listIdCounter++}`;

  protected override willUpdate(changed: PropertyValues<this>) {
    if (
      (changed.has('items') || changed.has('selectFirst')) &&
      this.selectFirst &&
      !this.value &&
      this.items.length > 0
    ) {
      this.value = this.items[0];
    }

    if (
      changed.has('items') ||
      changed.has('value') ||
      changed.has('selectFirst')
    ) {
      this._filteredItems = this._filterItems(this.value);
      if (this._activeIndex >= this._filteredItems.length) {
        this._activeIndex = -1;
      }
      if (this._filteredItems.length === 0) {
        this._isOpen = false;
      }
    }

    if (changed.has('useNative')) {
      this._closeDropdown();
    }
  }

  override render() {
    return this.useNative ? this._renderNative() : this._renderCustom();
  }

  private _renderNative() {
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
        @change=${this._handleNativeChange}
      />
      <datalist id=${this._listId}>
        ${this.items.map((item) => html`<option value=${item}></option>`)}
      </datalist>
    `;
  }

  private _renderCustom() {
    const id = this.id || undefined;
    const wrapperClasses = this._isOpen ? 'typeahead is-open' : 'typeahead';
    return html`
      <div class=${wrapperClasses}>
        <div class="input-wrapper">
          <input
            type="text"
            id=${id ?? nothing}
            name=${this.name || nothing}
            placeholder=${this.placeholder || nothing}
            aria-label=${this.placeholder || this.name || nothing}
            role="combobox"
            aria-expanded=${this._isOpen ? 'true' : 'false'}
            aria-autocomplete="list"
            aria-controls=${this._isOpen ? this._listboxId : nothing}
            aria-activedescendant=${this._activeIndex >= 0
              ? `${this._listboxId}-${this._activeIndex}`
              : nothing}
            .value=${this.value}
            @input=${this._handleInput}
            @keydown=${this._handleKeydown}
            @focus=${this._handleFocus}
            @blur=${this._handleBlur}
            @click=${this._handleInputClick}
            @change=${this._handleCustomChange}
          />
          <button
            type="button"
            class="toggle-icon"
            data-testid="toggle-icon"
            aria-label=${this._isOpen
              ? 'Close suggestions'
              : 'Open suggestions'}
            tabindex="-1"
            @mousedown=${this._handleIconMouseDown}
            @click=${this._handleIconClick}
          >
            <slot name="toggle-icon">
              <svg
                viewBox="0 0 24 24"
                class="toggle-icon-svg"
                fill="none"
                stroke="currentColor"
                stroke-width="1.75"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
                focusable="false"
              >
                <!--
                  A unique "carousel" chevron: an outlined rotated frame around
                  a primary chevron, with a secondary "echo" chevron below it
                  and a pulse dot at the top. The frame and chevron rotate
                  180deg on open; the echo glows on its own @keyframes loop;
                  the pulse dot fades in on open to give a subtle "broadcast"
                  feel. The frame rotation is purely decorative and is part of
                  the icon's identity, not just a transition trick.
                -->
                <rect
                  class="chevron-frame"
                  x="3.25"
                  y="6.25"
                  width="17.5"
                  height="11.5"
                  rx="5.75"
                  stroke-opacity="0.18"
                />
                <path
                  class="chevron-main"
                  d="M7 9.5 L12 14.5 L17 9.5"
                />
                <path
                  class="chevron-echo"
                  d="M7 13 L12 18 L17 13"
                />
                <circle class="pulse-dot" cx="12" cy="5.5" r="1.1" />
              </svg>
            </slot>
          </button>
        </div>
        ${this._isOpen && this._filteredItems.length > 0
          ? html`
              <ul
                class="dropdown"
                id=${this._listboxId}
                role="listbox"
                @mousedown=${this._handleListMouseDown}
              >
                ${this._filteredItems.map(
                  (item, index) => html`
                    <li
                      id=${`${this._listboxId}-${index}`}
                      role="option"
                      aria-selected=${index === this._activeIndex
                        ? 'true'
                        : 'false'}
                      class=${index === this._activeIndex ? 'active' : ''}
                      @click=${() => this._selectItem(item)}
                    >
                      ${item}
                    </li>
                  `
                )}
              </ul>
            `
          : nothing}
      </div>
    `;
  }

  private _handleNativeChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this._dispatchChange(this.value);

    if (this._findMatchingItem(this.value) !== undefined) {
      this._dispatchItemSelected(this.value);
    }
  }

  private _handleInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this._filteredItems = this._filterItems(input.value);
    this._activeIndex = -1;
    this._isOpen = this._filteredItems.length > 0;
  }

  private _handleCustomChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this._closeDropdown();
    this._dispatchChange(this.value);
  }

  private _handleFocus() {
    this._openDropdown();
  }

  private _handleInputClick() {
    if (!this._isOpen) {
      this._openDropdown();
    }
  }

  private _handleBlur() {
    this._closeDropdown();
  }

  private _handleListMouseDown(event: MouseEvent) {
    // Keep focus on the input so the dropdown can handle option clicks
    // before the input's blur handler runs.
    event.preventDefault();
  }

  private _handleIconMouseDown(event: MouseEvent) {
    // Stop the icon's mousedown from stealing focus from the input. Without
    // this the input's blur handler would close the dropdown before the
    // click handler runs.
    event.preventDefault();
  }

  private _handleIconClick(event: MouseEvent) {
    event.preventDefault();
    if (this._isOpen) {
      this._closeDropdown();
      return;
    }
    this._openDropdown();
    // Move focus into the input so the user can immediately type after
    // clicking the icon (the input typically already has focus in the real
    // browser, so this is a no-op there).
    const input = this.shadowRoot?.querySelector('input');
    if (input instanceof HTMLInputElement) {
      input.focus();
    }
  }

  private _handleKeydown(event: KeyboardEvent) {
    if (event.key === 'ArrowDown' && !this._isOpen) {
      event.preventDefault();
      this._openDropdown();
      if (this._isOpen) {
        this._activeIndex = 0;
      }
      return;
    }

    if (!this._isOpen || this._filteredItems.length === 0) {
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this._activeIndex =
          (this._activeIndex + 1) % this._filteredItems.length;
        break;
      case 'ArrowUp':
        event.preventDefault();
        this._activeIndex =
          this._activeIndex <= 0
            ? this._filteredItems.length - 1
            : this._activeIndex - 1;
        break;
      case 'Enter':
        if (
          this._activeIndex >= 0 &&
          this._activeIndex < this._filteredItems.length
        ) {
          event.preventDefault();
          this._selectItem(this._filteredItems[this._activeIndex]);
        }
        break;
      case 'Escape':
        event.preventDefault();
        this._closeDropdown();
        break;
      default:
        break;
    }
  }

  private _selectItem(item: string) {
    this.value = item;
    this._closeDropdown();
    this._dispatchChange(item);
    this._dispatchItemSelected(item);
  }

  private _openDropdown() {
    if (this.items.length === 0) {
      this._isOpen = false;
      return;
    }

    this._filteredItems = this._filterItems(this.value);
    this._activeIndex = -1;
    this._isOpen = this._filteredItems.length > 0;
  }

  private _closeDropdown() {
    this._isOpen = false;
    this._activeIndex = -1;
  }

  private _filterItems(value: string): string[] {
    const query = value.trim().toLowerCase();
    if (query === '') {
      return [...this.items];
    }
    return this.items.filter((item) => item.toLowerCase().includes(query));
  }

  private _findMatchingItem(value: string): string | undefined {
    const query = value.trim().toLowerCase();
    return this.items.find((item) => item.toLowerCase() === query);
  }

  private _dispatchChange(value: string) {
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: {value},
        bubbles: true,
        composed: true,
      })
    );
  }

  private _dispatchItemSelected(value: string) {
    this.dispatchEvent(
      new CustomEvent('item-selected', {
        detail: {value},
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
