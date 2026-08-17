/**
 * @license
 * Copyright 2024 Lucas Schirm
 * SPDX-License-Identifier: Apache-2.0
 */

import {LitElement, html, css, nothing, type PropertyValues} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';

/** An item with a display label and a value used for selection. */
export interface TypeaheadItem {
  label: string;
  value: string;
}

/** A list of options; each option can be a plain string or an object. */
export type TypeaheadItems = Array<string | TypeaheadItem>;

let listIdCounter = 0;

/**
 * A typeahead web component.
 *
 * By default it renders an `<input>` with a custom dropdown. Set `use-native`
 * to fall back to the legacy `<input>` + `<datalist>` implementation.
 *
 * The input acts as a search box that is separate from the selection: opening
 * the dropdown clears the input so the user can type, and closing it without
 * selecting an item restores the previous value. The value only changes when
 * an item is selected from the dropdown.
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
 * @fires change - Fired when an item is selected from the custom dropdown, or
 * when the value of the native datalist input changes. The selected value is
 * available on `event.detail.value`. By default the value is a string; when
 * `emit-object` is set, the whole item object (`{label, value}`) is emitted
 * instead.
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
      /* The chevron is a visual indicator, not a button: it stays plain and
         never gains a button-like background on hover. */
      background: transparent;
      border: 0;
      color: var(--typeahead-icon-color, #000);
      cursor: pointer;
    }

    .toggle-icon:focus-visible {
      outline: 2px solid var(--typeahead-focus-outline-color, #0b5fff);
      outline-offset: 2px;
    }

    /*
      The default triangle SVG is provided as the slot's fallback content so
      it can be replaced by the consumer. All default-icon styling targets
      toggle-icon-svg so consumers' slotted content is unaffected.
    */
    .toggle-icon-svg {
      width: var(--typeahead-icon-size, 18px);
      height: var(--typeahead-icon-size, 18px);
      display: block;
      overflow: visible;
    }

    .toggle-icon-svg .chevron {
      fill: currentColor;
      stroke: none;
      /* Rotate around the triangle's centroid so the flip stays in place. */
      transform-origin: 12px 12px;
      transform: rotate(0deg);
      transition: transform 320ms cubic-bezier(0.34, 1.32, 0.64, 1);
    }

    /* When the dropdown is open the triangle flips to point up. */
    .is-open .toggle-icon-svg .chevron {
      transform: rotate(180deg);
    }

    @media (prefers-reduced-motion: reduce) {
      .toggle-icon-svg .chevron {
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
      box-shadow: 0 4px 12px
        var(--typeahead-shadow-color, rgba(0, 0, 0, 0.15));
    }

    .dropdown li {
      padding: var(--typeahead-option-padding, 8px);
      cursor: pointer;
      color: var(--typeahead-text-color, #000);
    }

    .dropdown li.is-selected {
      background-color: var(--typeahead-selected-color, #d3e3fd);
    }

    .dropdown li.active,
    .dropdown li:hover {
      background-color: var(--typeahead-highlight-color, #e6f0ff);
    }
  `;

  /** Name applied to the underlying `<input>`, used when submitting a form. */
  @property({type: String}) name = '';

  /**
   * List of options shown to the user. Each option can be a plain string or
   * an object with `label` and `value` properties. The label is displayed in
   * the dropdown; the value is used for selection.
   */
  @property({type: Array}) items: TypeaheadItems = [];

  /**
   * When true, the `change` event emits the whole selected item object
   * (`{label, value}`) instead of just its value string.
   */
  @property({type: Boolean, attribute: 'emit-object'}) emitObject = false;

  /** Placeholder text shown in the input when it is empty. */
  @property({type: String}) placeholder = '';

  /** When true, the first item is selected by default. */
  @property({type: Boolean, attribute: 'select-first'}) selectFirst = false;

  /**
   * Currently selected value. For object items this is the item's `value`;
   * for string items it is the string itself. Only changes when an item is
   * selected.
   */
  @property({type: String}) value = '';

  /**
   * When true, renders the legacy `<input>` + `<datalist>` implementation.
   * When false (default), renders a custom dropdown.
   */
  @property({type: Boolean, attribute: 'use-native'}) useNative = false;

  @state() private _isOpen = false;
  @state() private _filteredItems: TypeaheadItems = [];
  @state() private _activeIndex = -1;
  /** Transient search text; never part of the value. */
  @state() private _searchText = '';

  private readonly _listId = `lit-typeahead-list-${listIdCounter++}`;
  private readonly _listboxId = `lit-typeahead-listbox-${listIdCounter++}`;

  protected override willUpdate(changed: PropertyValues<this>) {
    if (
      (changed.has('items') || changed.has('selectFirst')) &&
      this.selectFirst &&
      !this.value &&
      this.items.length > 0
    ) {
      this.value = this._itemValue(this.items[0]);
    }

    if (changed.has('items') || changed.has('selectFirst')) {
      this._filteredItems = this._filterItems(this._searchText);
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
        ${this.items.map(
          (item) =>
            html`<option value=${this._itemValue(item)}
              >${this._itemLabel(item)}</option
            >`
        )}
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
            .value=${this._isOpen ? this._searchText : this.value}
            @input=${this._handleInput}
            @keydown=${this._handleKeydown}
            @focus=${this._handleFocus}
            @blur=${this._handleBlur}
            @click=${this._handleInputClick}
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
                fill="currentColor"
                stroke="none"
                aria-hidden="true"
                focusable="false"
              >
                <!--
                  A simple solid black triangle: points down when the dropdown
                  is closed and rotates 180deg (points up) when it is open.
                  The flip is animated entirely with CSS.
                -->
                <path
                  class="chevron"
                  d="M12 15.5 L6.5 8.5 H17.5 Z"
                />
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
                ${this._filteredItems.map((item, index) => {
                  const itemClasses = [
                    index === this._activeIndex ? 'active' : '',
                    this._itemValue(item) === this.value ? 'is-selected' : '',
                  ]
                    .filter(Boolean)
                    .join(' ');
                  return html`
                    <li
                      id=${`${this._listboxId}-${index}`}
                      role="option"
                      aria-selected=${index === this._activeIndex
                        ? 'true'
                        : 'false'}
                      class=${itemClasses}
                      @click=${() => this._selectItem(item)}
                    >
                      ${this._itemLabel(item)}
                    </li>
                  `;
                })}
              </ul>
            `
          : nothing}
      </div>
    `;
  }

  private _handleNativeChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    const matchingItem = this._findMatchingItem(this.value);
    this._dispatchChange(matchingItem ?? this.value);

    if (matchingItem !== undefined) {
      this._dispatchItemSelected(this._itemValue(matchingItem));
    }
  }

  private _handleInput(event: Event) {
    // Typing only drives the search; it never changes the selection.
    const input = event.target as HTMLInputElement;
    this._searchText = input.value;
    this._filteredItems = this._filterItems(input.value);
    this._activeIndex = -1;
    this._isOpen = this._filteredItems.length > 0;
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
        event.preventDefault();
        if (
          this._activeIndex >= 0 &&
          this._activeIndex < this._filteredItems.length
        ) {
          this._selectItem(this._filteredItems[this._activeIndex]);
        } else {
          // No item highlighted: treat Enter as closing without selecting.
          this._closeDropdown();
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

  private _selectItem(item: string | TypeaheadItem) {
    this.value = this._itemValue(item);
    this._closeDropdown();
    this._dispatchChange(item);
    this._dispatchItemSelected(this._itemValue(item));
  }

  private _openDropdown() {
    if (this.items.length === 0) {
      this._isOpen = false;
      return;
    }

    // Opening starts a fresh search: clear the input and show every item so
    // the user can type and arrow through the full list.
    this._searchText = '';
    this._filteredItems = this._filterItems('');
    this._activeIndex = -1;
    this._isOpen = true;

    // Ensure the input is focused so the user can type immediately (mainly
    // needed when the dropdown was opened via the toggle icon).
    const input = this.shadowRoot?.querySelector('input');
    if (input instanceof HTMLInputElement) {
      input.focus();
    }
  }

  private _closeDropdown() {
    this._isOpen = false;
    this._activeIndex = -1;
    // Discard any transient search text and restore the input to the
    // selected value, unless an item was actually selected.
    this._searchText = this.value;
  }

  private _filterItems(value: string): TypeaheadItems {
    const query = value.trim().toLowerCase();
    if (query === '') {
      return [...this.items];
    }
    return this.items.filter((item) =>
      this._itemLabel(item).toLowerCase().includes(query)
    );
  }

  private _findMatchingItem(value: string): string | TypeaheadItem | undefined {
    const query = value.trim().toLowerCase();
    return this.items.find(
      (item) => this._itemValue(item).toLowerCase() === query
    );
  }

  private _itemLabel(item: string | TypeaheadItem): string {
    return typeof item === 'string' ? item : item.label;
  }

  private _itemValue(item: string | TypeaheadItem): string {
    return typeof item === 'string' ? item : item.value;
  }

  private _dispatchChange(value: string | TypeaheadItem) {
    this.dispatchEvent(
      new CustomEvent('change', {
        // By default emit only the value; with emit-object emit the whole
        // item (for string items that is the string itself).
        detail: {value: this.emitObject ? value : this._itemValue(value)},
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
