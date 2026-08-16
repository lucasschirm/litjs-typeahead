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

  test('resets the filter after selecting an item', async () => {
    const el = (await fixture(
      html`<lit-typeahead
        items='["United States", "Canada", "Mexico"]'
      ></lit-typeahead>`
    )) as LitTypeahead;
    await el.updateComplete;

    const input = el.shadowRoot!.querySelector('input')!;
    input.dispatchEvent(new Event('focus'));
    await el.updateComplete;

    // Narrow the list with a query.
    input.value = 'ca';
    input.dispatchEvent(new Event('input', {bubbles: true, composed: true}));
    await el.updateComplete;
    assert.equal(el.shadowRoot!.querySelectorAll('.dropdown li').length, 1);

    // Select the only match.
    const option = el.shadowRoot!.querySelector('.dropdown li') as HTMLElement;
    option.click();
    await el.updateComplete;
    assert.equal(el.value, 'Canada');
    assert.equal(el.shadowRoot!.querySelector('.dropdown'), null);

    // Reopening the dropdown shows the full list, not the stale filter.
    input.dispatchEvent(new Event('focus'));
    await el.updateComplete;
    const options = el.shadowRoot!.querySelectorAll('.dropdown li');
    assert.equal(options.length, 3);
    assert.equal(options[0].textContent?.trim(), 'United States');
    assert.equal(options[2].textContent?.trim(), 'Mexico');
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

  suite('toggle icon', () => {
    test('renders a default triangle SVG inside a named slot', async () => {
      const el = (await fixture(
        html`<lit-typeahead
          items='["United States", "Canada", "Mexico"]'
        ></lit-typeahead>`
      )) as LitTypeahead;
      await el.updateComplete;

      const slot =
        el.shadowRoot!.querySelector<HTMLSlotElement>('slot[name="toggle-icon"]');
      assert.ok(slot, 'toggle-icon slot should exist');
      assert.equal(slot!.name, 'toggle-icon');

      // The default fallback SVG should be present in the shadow before any
      // consumer content is slotted in.
      const defaultIcon = slot!.querySelector('svg.toggle-icon-svg');
      assert.ok(defaultIcon, 'default triangle SVG should render as a slot fallback');
      assert.equal(defaultIcon!.getAttribute('aria-hidden'), 'true');
    });

    test('does not render a toggle icon in native mode', async () => {
      const el = (await fixture(
        html`<lit-typeahead
          use-native
          items='["United States", "Canada", "Mexico"]'
        ></lit-typeahead>`
      )) as LitTypeahead;
      await el.updateComplete;

      assert.equal(
        el.shadowRoot!.querySelector('slot[name="toggle-icon"]'),
        null
      );
    });

    test('marks the wrapper as open when the dropdown is open', async () => {
      const el = (await fixture(
        html`<lit-typeahead
          items='["United States", "Canada", "Mexico"]'
        ></lit-typeahead>`
      )) as LitTypeahead;
      await el.updateComplete;

      const wrapper = el.shadowRoot!.querySelector('.typeahead');
      assert.ok(wrapper);
      assert.equal(wrapper!.classList.contains('is-open'), false);

      const input = el.shadowRoot!.querySelector('input')!;
      input.dispatchEvent(new Event('focus'));
      await el.updateComplete;

      assert.equal(wrapper!.classList.contains('is-open'), true);

      input.dispatchEvent(new Event('blur'));
      await el.updateComplete;

      assert.equal(wrapper!.classList.contains('is-open'), false);
    });

    test('clicking the toggle icon opens the dropdown when closed', async () => {
      const el = (await fixture(
        html`<lit-typeahead
          items='["United States", "Canada", "Mexico"]'
        ></lit-typeahead>`
      )) as LitTypeahead;
      await el.updateComplete;

      const button = el.shadowRoot!.querySelector<HTMLButtonElement>(
        'button.toggle-icon'
      )!;
      assert.ok(button);
      assert.equal(button!.getAttribute('aria-label'), 'Open suggestions');

      // Synthesize a full interaction (mousedown to prevent focus theft, then
      // click) like a user would do in the browser.
      button!.dispatchEvent(new MouseEvent('mousedown', {bubbles: true}));
      button!.click();
      await el.updateComplete;

      assert.ok(el.shadowRoot!.querySelector('.dropdown'));
      assert.equal(button!.getAttribute('aria-label'), 'Close suggestions');
    });

    test('clicking the toggle icon closes the dropdown when open', async () => {
      const el = (await fixture(
        html`<lit-typeahead
          items='["United States", "Canada", "Mexico"]'
        ></lit-typeahead>`
      )) as LitTypeahead;
      await el.updateComplete;

      el.shadowRoot!.querySelector('input')!.dispatchEvent(new Event('focus'));
      await el.updateComplete;
      assert.ok(el.shadowRoot!.querySelector('.dropdown'));

      const button = el.shadowRoot!.querySelector<HTMLButtonElement>(
        'button.toggle-icon'
      )!;
      button!.dispatchEvent(new MouseEvent('mousedown', {bubbles: true}));
      button!.click();
      await el.updateComplete;

      assert.equal(el.shadowRoot!.querySelector('.dropdown'), null);
    });

    test('lets consumers replace the icon via the toggle-icon slot', async () => {
      const el = (await fixture(
        html`<lit-typeahead
          items='["United States", "Canada", "Mexico"]'
        ><span
          slot="toggle-icon"
          class="custom-icon"
          aria-hidden="true"
        >custom</span></lit-typeahead>`
      )) as LitTypeahead;
      // Allow the slotted <span> child (which sits in light DOM) to be assigned
      // into the shadow slot before we query.
      await new Promise((r) => setTimeout(r, 0));
      await el.updateComplete;
      await new Promise((r) => setTimeout(r, 0));

      const slot = el.shadowRoot!.querySelector<HTMLSlotElement>(
        'slot[name="toggle-icon"]'
      );
      assert.ok(slot, 'slot should exist in the shadow DOM');

      // The consumer-supplied light-DOM child should pick up the slot name.
      const slottedChild = el.querySelector<HTMLElement>(
        '[slot="toggle-icon"]'
      );
      assert.ok(slottedChild, 'slotted child should live in light DOM');
      assert.equal(
        slottedChild!.classList.contains('custom-icon'),
        true,
        'slotted child should keep its own class'
      );
      assert.equal(slottedChild!.getAttribute('slot'), 'toggle-icon');
    });
  });
});
