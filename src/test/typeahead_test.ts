/**
 * @license
 * Copyright 2024 Lucas Schirm
 * SPDX-License-Identifier: Apache-2.0
 */

import {LitTypeahead} from '../typeahead/typeahead.js';
import '../typeahead/index.js';

import {fixture, assert} from '@open-wc/testing';
import {html} from 'lit/static-html.js';

suite('lit-typeahead', () => {
  test('is defined', () => {
    const el = document.createElement('lit-typeahead');
    assert.instanceOf(el, LitTypeahead);
  });

  test('renders an input and a datalist when use-native is set', async () => {
    const el = (await fixture(
      html`<lit-typeahead
        name="country"
        use-native
        items='["United States", "Canada", "Mexico"]'
      ></lit-typeahead>`
    )) as LitTypeahead;
    await el.updateComplete;

    const input = el.shadowRoot!.querySelector('input')!;
    const options = el.shadowRoot!.querySelectorAll('datalist option');

    assert.equal(input.name, 'country');
    assert.equal(options.length, 3);
    assert.equal(options[0].getAttribute('value'), 'United States');
    assert.equal(
      input.getAttribute('list'),
      el.shadowRoot!.querySelector('datalist')!.id
    );
  });

  test('renders a custom input without a datalist by default', async () => {
    const el = (await fixture(
      html`<lit-typeahead
        items='["United States", "Canada", "Mexico"]'
      ></lit-typeahead>`
    )) as LitTypeahead;
    await el.updateComplete;

    const input = el.shadowRoot!.querySelector('input')!;
    assert.equal(input.getAttribute('list'), null);
    assert.equal(el.shadowRoot!.querySelector('datalist'), null);
  });

  test('has display block', async () => {
    const el = (await fixture(
      html`<lit-typeahead></lit-typeahead>`
    )) as LitTypeahead;
    await el.updateComplete;
    assert.equal(getComputedStyle(el).display, 'block');
  });

  test('uses the placeholder attribute on the input', async () => {
    const el = (await fixture(
      html`<lit-typeahead placeholder="Select a country"></lit-typeahead>`
    )) as LitTypeahead;
    await el.updateComplete;

    const input = el.shadowRoot!.querySelector('input')!;
    assert.equal(input.placeholder, 'Select a country');
  });

  test('selects the first item when select-first is set', async () => {
    const el = (await fixture(
      html`<lit-typeahead
        items='["United States", "Canada", "Mexico"]'
        select-first
      ></lit-typeahead>`
    )) as LitTypeahead;
    await el.updateComplete;

    assert.equal(el.value, 'United States');
    const input = el.shadowRoot!.querySelector('input')!;
    assert.equal(input.value, 'United States');
  });

  test('uses the provided initial value', async () => {
    const el = (await fixture(
      html`<lit-typeahead
        items='["United States", "Canada", "Mexico"]'
        value="Canada"
      ></lit-typeahead>`
    )) as LitTypeahead;
    await el.updateComplete;

    const input = el.shadowRoot!.querySelector('input')!;
    assert.equal(input.value, 'Canada');
  });

  test('emits a change event with the selected value', async () => {
    const el = (await fixture(
      html`<lit-typeahead
        items='["United States", "Canada", "Mexico"]'
      ></lit-typeahead>`
    )) as LitTypeahead;
    await el.updateComplete;

    const input = el.shadowRoot!.querySelector('input')!;
    const changePromise = new Promise<CustomEvent>((resolve) => {
      el.addEventListener('change', (event) => resolve(event as CustomEvent));
    });

    input.value = 'Mexico';
    input.dispatchEvent(new Event('change', {bubbles: true}));

    const event = await changePromise;
    assert.equal(event.detail.value, 'Mexico');
    assert.equal(el.value, 'Mexico');
  });

  test('opens the dropdown and shows all items on focus', async () => {
    const el = (await fixture(
      html`<lit-typeahead
        items='["United States", "Canada", "Mexico"]'
      ></lit-typeahead>`
    )) as LitTypeahead;
    await el.updateComplete;

    const input = el.shadowRoot!.querySelector('input')!;
    input.dispatchEvent(new Event('focus'));
    await el.updateComplete;

    const options = el.shadowRoot!.querySelectorAll('.dropdown li');
    assert.equal(options.length, 3);
    assert.equal(options[0].textContent?.trim(), 'United States');
  });

  test('filters items case-insensitively while typing', async () => {
    const el = (await fixture(
      html`<lit-typeahead
        items='["United States", "Canada", "Mexico"]'
      ></lit-typeahead>`
    )) as LitTypeahead;
    await el.updateComplete;

    const input = el.shadowRoot!.querySelector('input')!;
    input.dispatchEvent(new Event('focus'));
    await el.updateComplete;

    input.value = 'ca';
    input.dispatchEvent(new Event('input', {bubbles: true, composed: true}));
    await el.updateComplete;

    const options = el.shadowRoot!.querySelectorAll('.dropdown li');
    assert.equal(options.length, 1);
    assert.equal(options[0].textContent?.trim(), 'Canada');
  });

  test('supports arrow keys and Enter selection in the custom dropdown', async () => {
    const el = (await fixture(
      html`<lit-typeahead
        items='["United States", "Canada", "Mexico"]'
      ></lit-typeahead>`
    )) as LitTypeahead;
    await el.updateComplete;

    const input = el.shadowRoot!.querySelector('input')!;
    input.dispatchEvent(new Event('focus'));
    await el.updateComplete;

    const selectedPromise = new Promise<CustomEvent>((resolve) => {
      el.addEventListener('item-selected', (event) =>
        resolve(event as CustomEvent)
      );
    });

    input.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'ArrowDown',
        bubbles: true,
        composed: true,
      })
    );
    await el.updateComplete;
    assert.equal(
      el.shadowRoot!.querySelector('.dropdown li.active')?.textContent?.trim(),
      'United States'
    );

    input.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'ArrowDown',
        bubbles: true,
        composed: true,
      })
    );
    await el.updateComplete;
    assert.equal(
      el.shadowRoot!.querySelector('.dropdown li.active')?.textContent?.trim(),
      'Canada'
    );

    input.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
        composed: true,
      })
    );
    await el.updateComplete;

    const event = await selectedPromise;
    assert.equal(event.detail.value, 'Canada');
    assert.equal(el.value, 'Canada');
    assert.equal(el.shadowRoot!.querySelector('.dropdown'), null);
  });

  test('selects an item when clicked', async () => {
    const el = (await fixture(
      html`<lit-typeahead
        items='["United States", "Canada", "Mexico"]'
      ></lit-typeahead>`
    )) as LitTypeahead;
    await el.updateComplete;

    const input = el.shadowRoot!.querySelector('input')!;
    input.dispatchEvent(new Event('focus'));
    await el.updateComplete;

    const selectedPromise = new Promise<CustomEvent>((resolve) => {
      el.addEventListener('item-selected', (event) =>
        resolve(event as CustomEvent)
      );
    });

    const option = el.shadowRoot!.querySelectorAll('.dropdown li')[2] as HTMLElement;
    option.click();
    await el.updateComplete;

    const event = await selectedPromise;
    assert.equal(event.detail.value, 'Mexico');
    assert.equal(el.value, 'Mexico');
    assert.equal(el.shadowRoot!.querySelector('.dropdown'), null);
  });

  test('closes the dropdown on blur', async () => {
    const el = (await fixture(
      html`<lit-typeahead
        items='["United States", "Canada", "Mexico"]'
      ></lit-typeahead>`
    )) as LitTypeahead;
    await el.updateComplete;

    const input = el.shadowRoot!.querySelector('input')!;
    input.dispatchEvent(new Event('focus'));
    await el.updateComplete;
    assert.ok(el.shadowRoot!.querySelector('.dropdown'));

    input.dispatchEvent(new Event('blur'));
    await el.updateComplete;
    assert.equal(el.shadowRoot!.querySelector('.dropdown'), null);
  });

  test('emits item-selected when the native value matches an item', async () => {
    const el = (await fixture(
      html`<lit-typeahead
        use-native
        items='["United States", "Canada", "Mexico"]'
      ></lit-typeahead>`
    )) as LitTypeahead;
    await el.updateComplete;

    const input = el.shadowRoot!.querySelector('input')!;
    const selectedPromise = new Promise<CustomEvent>((resolve) => {
      el.addEventListener('item-selected', (event) =>
        resolve(event as CustomEvent)
      );
    });

    input.value = 'Canada';
    input.dispatchEvent(new Event('change', {bubbles: true}));

    const event = await selectedPromise;
    assert.equal(event.detail.value, 'Canada');
    assert.equal(el.value, 'Canada');
  });

  test('does not emit item-selected in native mode for a non-matching value', async () => {
    const el = (await fixture(
      html`<lit-typeahead
        use-native
        items='["United States", "Canada", "Mexico"]'
      ></lit-typeahead>`
    )) as LitTypeahead;
    await el.updateComplete;

    const input = el.shadowRoot!.querySelector('input')!;
    let selected = false;
    el.addEventListener('item-selected', () => {
      selected = true;
    });

    input.value = 'Unknown';
    input.dispatchEvent(new Event('change', {bubbles: true}));
    await el.updateComplete;

    assert.equal(selected, false);
  });
});
