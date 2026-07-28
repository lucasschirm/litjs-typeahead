---
layout: example.11ty.cjs
title: <lit-typeahead> ⌲ Examples ⌲ Placeholder & Select First
tags: example
name: Placeholder & Select First
description: Setting the placeholder and select-first properties
---

<lit-typeahead
  id="country-placeholder"
  name="country"
  items='["United States", "Canada", "Mexico"]'
  placeholder="Select a country"
></lit-typeahead>

<lit-typeahead
  id="country-select-first"
  name="country"
  items='["United States", "Canada", "Mexico"]'
  select-first
></lit-typeahead>

<h3>HTML</h3>

```html
<lit-typeahead
  id="country-placeholder"
  name="country"
  items='["United States", "Canada", "Mexico"]'
  placeholder="Select a country"
></lit-typeahead>

<lit-typeahead
  id="country-select-first"
  name="country"
  items='["United States", "Canada", "Mexico"]'
  select-first
></lit-typeahead>
```
