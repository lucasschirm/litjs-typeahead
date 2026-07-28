---
layout: page.11ty.cjs
title: <lit-typeahead> ⌲ Home
---

# &lt;lit-typeahead>

`<lit-typeahead>` is an awesome element. It's a great introduction to building web components with LitElement, with nice documentation site as well.

## As easy as HTML

<section class="columns">
  <div>

`<lit-typeahead>` is just an HTML element. You can it anywhere you can use HTML!

```html
<lit-typeahead></lit-typeahead>
```

  </div>
  <div>

<lit-typeahead></lit-typeahead>

  </div>
</section>

## Configure with attributes

<section class="columns">
  <div>

`<lit-typeahead>` can be configured with attributed in plain HTML.

```html
<lit-typeahead name="HTML"></lit-typeahead>
```

  </div>
  <div>

<lit-typeahead name="HTML"></lit-typeahead>

  </div>
</section>

## Declarative rendering

<section class="columns">
  <div>

`<lit-typeahead>` can be used with declarative rendering libraries like Angular, React, Vue, and lit-html

```js
import {html, render} from 'lit-html';

const name = 'lit-html';

render(
  html`
    <h2>This is a &lt;lit-typeahead&gt;</h2>
    <lit-typeahead .name=${name}></lit-typeahead>
  `,
  document.body
);
```

  </div>
  <div>

<h2>This is a &lt;lit-typeahead&gt;</h2>
<lit-typeahead name="lit-html"></lit-typeahead>

  </div>
</section>
