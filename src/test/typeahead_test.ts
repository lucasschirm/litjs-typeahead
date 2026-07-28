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

  test('renders an input and a datalist with the given items', async () => {
    const el = (await fixture(
      html`<lit-typeahead
        name="country"
        items='["United States", "Canada", "Mexico"]'
      ></lit-typeahead>`
    )) as LitTypeahead;
    await el.updateComplete;

    const input = el.shadowRoot!.querySelector('input')!;
    const options = el.shadowRoot!.querySelectorAll('datalist option');

    assert.equal(input.name, 'country');
    assert.equal(options.length, 3);
    assert.equal(options[0].getAttribute('value'), 'United States');
    assert.equal(input.getAttribute('list'), el.shadowRoot!.querySelector('datalist')!.id);
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
});
