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

  test('renders with default values', async () => {
    const el = await fixture(html`<lit-typeahead></lit-typeahead>`);
    assert.shadowDom.equal(
      el,
      `
      <slot></slot>
    `
    );
  });

  test('has display block', async () => {
    const el = (await fixture(
      html`<lit-typeahead></lit-typeahead>`
    )) as LitTypeahead;
    await el.updateComplete;
    assert.equal(getComputedStyle(el).display, 'block');
  });
});
