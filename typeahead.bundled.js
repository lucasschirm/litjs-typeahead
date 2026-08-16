/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,i=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),e=new WeakMap;let o=class{constructor(t,i,e){if(this._$cssResult$=!0,e!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=i}get styleSheet(){let t=this.o;const s=this.t;if(i&&void 0===t){const i=void 0!==s&&1===s.length;i&&(t=e.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&e.set(s,t))}return t}toString(){return this.cssText}};const h=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let i="";for(const s of t.cssRules)i+=s.cssText;return(t=>new o("string"==typeof t?t:t+"",void 0,s))(i)})(t):t,{is:n,defineProperty:r,getOwnPropertyDescriptor:a,getOwnPropertyNames:l,getOwnPropertySymbols:c,getPrototypeOf:d}=Object,u=globalThis,p=u.trustedTypes,f=p?p.emptyScript:"",v=u.reactiveElementPolyfillSupport,g=(t,i)=>t,b={toAttribute(t,i){switch(i){case Boolean:t=t?f:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,i){let s=t;switch(i){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},y=(t,i)=>!n(t,i),m={attribute:!0,type:String,converter:b,reflect:!1,useDefault:!1,hasChanged:y};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),u.litPropertyMetadata??=new WeakMap;let w=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,i=m){if(i.state&&(i.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((i=Object.create(i)).wrapped=!0),this.elementProperties.set(t,i),!i.noAccessor){const s=Symbol(),e=this.getPropertyDescriptor(t,s,i);void 0!==e&&r(this.prototype,t,e)}}static getPropertyDescriptor(t,i,s){const{get:e,set:o}=a(this.prototype,t)??{get(){return this[i]},set(t){this[i]=t}};return{get:e,set(i){const h=e?.call(this);o?.call(this,i),this.requestUpdate(t,h,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??m}static _$Ei(){if(this.hasOwnProperty(g("elementProperties")))return;const t=d(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(g("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(g("properties"))){const t=this.properties,i=[...l(t),...c(t)];for(const s of i)this.createProperty(s,t[s])}const t=this[Symbol.metadata];if(null!==t){const i=litPropertyMetadata.get(t);if(void 0!==i)for(const[t,s]of i)this.elementProperties.set(t,s)}this._$Eh=new Map;for(const[t,i]of this.elementProperties){const s=this._$Eu(t,i);void 0!==s&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const i=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)i.unshift(h(t))}else void 0!==t&&i.push(h(t));return i}static _$Eu(t,i){const s=i.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,i=this.constructor.elementProperties;for(const s of i.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const s=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((s,e)=>{if(i)s.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of e){const e=document.createElement("style"),o=t.litNonce;void 0!==o&&e.setAttribute("nonce",o),e.textContent=i.cssText,s.appendChild(e)}})(s,this.constructor.elementStyles),s}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,i,s){this._$AK(t,s)}_$ET(t,i){const s=this.constructor.elementProperties.get(t),e=this.constructor._$Eu(t,s);if(void 0!==e&&!0===s.reflect){const o=(void 0!==s.converter?.toAttribute?s.converter:b).toAttribute(i,s.type);this._$Em=t,null==o?this.removeAttribute(e):this.setAttribute(e,o),this._$Em=null}}_$AK(t,i){const s=this.constructor,e=s._$Eh.get(t);if(void 0!==e&&this._$Em!==e){const t=s.getPropertyOptions(e),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:b;this._$Em=e;const h=o.fromAttribute(i,t.type);this[e]=h??this._$Ej?.get(e)??h,this._$Em=null}}requestUpdate(t,i,s,e=!1,o){if(void 0!==t){const h=this.constructor;if(!1===e&&(o=this[t]),s??=h.getPropertyOptions(t),!((s.hasChanged??y)(o,i)||s.useDefault&&s.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(h._$Eu(t,s))))return;this.C(t,i,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,i,{useDefault:s,reflect:e,wrapped:o},h){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,h??i??this[t]),!0!==o||void 0!==h)||(this._$AL.has(t)||(this.hasUpdated||s||(i=void 0),this._$AL.set(t,i)),!0===e&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,i]of this._$Ep)this[t]=i;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[i,s]of t){const{wrapped:t}=s,e=this[i];!0!==t||this._$AL.has(i)||void 0===e||this.C(i,void 0,s,e)}}let t=!1;const i=this._$AL;try{t=this.shouldUpdate(i),t?(this.willUpdate(i),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(i)):this._$EM()}catch(i){throw t=!1,this._$EM(),i}t&&this._$AE(i)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[g("elementProperties")]=new Map,w[g("finalized")]=new Map,v?.({ReactiveElement:w}),(u.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const $=globalThis,x=t=>t,S=$.trustedTypes,_=S?S.createPolicy("lit-html",{createHTML:t=>t}):void 0,k="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,A="?"+C,E=`<${A}>`,M=document,O=()=>M.createComment(""),z=t=>null===t||"object"!=typeof t&&"function"!=typeof t,T=Array.isArray,U="[ \t\n\f\r]",I=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,j=/-->/g,N=/>/g,P=RegExp(`>|${U}(?:([^\\s"'>=/]+)(${U}*=${U}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),D=/'/g,R=/"/g,L=/^(?:script|style|textarea|title)$/i,B=(t=>(i,...s)=>({_$litType$:t,strings:i,values:s}))(1),F=Symbol.for("lit-noChange"),H=Symbol.for("lit-nothing"),W=new WeakMap,K=M.createTreeWalker(M,129);function V(t,i){if(!T(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==_?_.createHTML(i):i}const Z=(t,i)=>{const s=t.length-1,e=[];let o,h=2===i?"<svg>":3===i?"<math>":"",n=I;for(let i=0;i<s;i++){const s=t[i];let r,a,l=-1,c=0;for(;c<s.length&&(n.lastIndex=c,a=n.exec(s),null!==a);)c=n.lastIndex,n===I?"!--"===a[1]?n=j:void 0!==a[1]?n=N:void 0!==a[2]?(L.test(a[2])&&(o=RegExp("</"+a[2],"g")),n=P):void 0!==a[3]&&(n=P):n===P?">"===a[0]?(n=o??I,l=-1):void 0===a[1]?l=-2:(l=n.lastIndex-a[2].length,r=a[1],n=void 0===a[3]?P:'"'===a[3]?R:D):n===R||n===D?n=P:n===j||n===N?n=I:(n=P,o=void 0);const d=n===P&&t[i+1].startsWith("/>")?" ":"";h+=n===I?s+E:l>=0?(e.push(r),s.slice(0,l)+k+s.slice(l)+C+d):s+C+(-2===l?i:d)}return[V(t,h+(t[s]||"<?>")+(2===i?"</svg>":3===i?"</math>":"")),e]};class J{constructor({strings:t,_$litType$:i},s){let e;this.parts=[];let o=0,h=0;const n=t.length-1,r=this.parts,[a,l]=Z(t,i);if(this.el=J.createElement(a,s),K.currentNode=this.el.content,2===i||3===i){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(e=K.nextNode())&&r.length<n;){if(1===e.nodeType){if(e.hasAttributes())for(const t of e.getAttributeNames())if(t.endsWith(k)){const i=l[h++],s=e.getAttribute(t).split(C),n=/([.?@])?(.*)/.exec(i);r.push({type:1,index:o,name:n[2],strings:s,ctor:"."===n[1]?X:"?"===n[1]?tt:"@"===n[1]?it:Q}),e.removeAttribute(t)}else t.startsWith(C)&&(r.push({type:6,index:o}),e.removeAttribute(t));if(L.test(e.tagName)){const t=e.textContent.split(C),i=t.length-1;if(i>0){e.textContent=S?S.emptyScript:"";for(let s=0;s<i;s++)e.append(t[s],O()),K.nextNode(),r.push({type:2,index:++o});e.append(t[i],O())}}}else if(8===e.nodeType)if(e.data===A)r.push({type:2,index:o});else{let t=-1;for(;-1!==(t=e.data.indexOf(C,t+1));)r.push({type:7,index:o}),t+=C.length-1}o++}}static createElement(t,i){const s=M.createElement("template");return s.innerHTML=t,s}}function q(t,i,s=t,e){if(i===F)return i;let o=void 0!==e?s._$Co?.[e]:s._$Cl;const h=z(i)?void 0:i._$litDirective$;return o?.constructor!==h&&(o?._$AO?.(!1),void 0===h?o=void 0:(o=new h(t),o._$AT(t,s,e)),void 0!==e?(s._$Co??=[])[e]=o:s._$Cl=o),void 0!==o&&(i=q(t,o._$AS(t,i.values),o,e)),i}class G{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:i},parts:s}=this._$AD,e=(t?.creationScope??M).importNode(i,!0);K.currentNode=e;let o=K.nextNode(),h=0,n=0,r=s[0];for(;void 0!==r;){if(h===r.index){let i;2===r.type?i=new Y(o,o.nextSibling,this,t):1===r.type?i=new r.ctor(o,r.name,r.strings,this,t):6===r.type&&(i=new st(o,this,t)),this._$AV.push(i),r=s[++n]}h!==r?.index&&(o=K.nextNode(),h++)}return K.currentNode=M,e}p(t){let i=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++}}class Y{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,i,s,e){this.type=2,this._$AH=H,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cv=e?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===t?.nodeType&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=q(this,t,i),z(t)?t===H||null==t||""===t?(this._$AH!==H&&this._$AR(),this._$AH=H):t!==this._$AH&&t!==F&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>T(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==H&&z(this._$AH)?this._$AA.nextSibling.data=t:this.T(M.createTextNode(t)),this._$AH=t}$(t){const{values:i,_$litType$:s}=t,e="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=J.createElement(V(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===e)this._$AH.p(i);else{const t=new G(e,this),s=t.u(this.options);t.p(i),this.T(s),this._$AH=t}}_$AC(t){let i=W.get(t.strings);return void 0===i&&W.set(t.strings,i=new J(t)),i}k(t){T(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const o of t)e===i.length?i.push(s=new Y(this.O(O()),this.O(O()),this,this.options)):s=i[e],s._$AI(o),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e)}_$AR(t=this._$AA.nextSibling,i){for(this._$AP?.(!1,!0,i);t!==this._$AB;){const i=x(t).nextSibling;x(t).remove(),t=i}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class Q{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,i,s,e,o){this.type=1,this._$AH=H,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=o,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=H}_$AI(t,i=this,s,e){const o=this.strings;let h=!1;if(void 0===o)t=q(this,t,i,0),h=!z(t)||t!==this._$AH&&t!==F,h&&(this._$AH=t);else{const e=t;let n,r;for(t=o[0],n=0;n<o.length-1;n++)r=q(this,e[s+n],i,n),r===F&&(r=this._$AH[n]),h||=!z(r)||r!==this._$AH[n],r===H?t=H:t!==H&&(t+=(r??"")+o[n+1]),this._$AH[n]=r}h&&!e&&this.j(t)}j(t){t===H?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class X extends Q{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===H?void 0:t}}class tt extends Q{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==H)}}class it extends Q{constructor(t,i,s,e,o){super(t,i,s,e,o),this.type=5}_$AI(t,i=this){if((t=q(this,t,i,0)??H)===F)return;const s=this._$AH,e=t===H&&s!==H||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==H&&(s===H||e);e&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class st{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){q(this,t)}}const et=$.litHtmlPolyfillSupport;et?.(J,Y),($.litHtmlVersions??=[]).push("3.3.3");const ot=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class ht extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const i=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,i,s)=>{const e=s?.renderBefore??i;let o=e._$litPart$;if(void 0===o){const t=s?.renderBefore??null;e._$litPart$=o=new Y(i.insertBefore(O(),t),t,void 0,s??{})}return o._$AI(t),o})(i,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return F}}ht._$litElement$=!0,ht.finalized=!0,ot.litElementHydrateSupport?.({LitElement:ht});const nt=ot.litElementPolyfillSupport;nt?.({LitElement:ht}),(ot.litElementVersions??=[]).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const rt={attribute:!0,type:String,converter:b,reflect:!1,hasChanged:y},at=(t=rt,i,s)=>{const{kind:e,metadata:o}=s;let h=globalThis.litPropertyMetadata.get(o);if(void 0===h&&globalThis.litPropertyMetadata.set(o,h=new Map),"setter"===e&&((t=Object.create(t)).wrapped=!0),h.set(s.name,t),"accessor"===e){const{name:e}=s;return{set(s){const o=i.get.call(this);i.set.call(this,s),this.requestUpdate(e,o,t,!0,s)},init(i){return void 0!==i&&this.C(e,void 0,t,i),i}}}if("setter"===e){const{name:e}=s;return function(s){const o=this[e];i.call(this,s),this.requestUpdate(e,o,t,!0,s)}}throw Error("Unsupported decorator location: "+e)};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function lt(t){return(i,s)=>"object"==typeof s?at(t,i,s):((t,i,s)=>{const e=i.hasOwnProperty(s);return i.constructor.createProperty(s,t),e?Object.getOwnPropertyDescriptor(i,s):void 0})(t,i,s)}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function ct(t){return lt({...t,state:!0,attribute:!1})}
/**
 * @license
 * Copyright 2024 Lucas Schirm
 * SPDX-License-Identifier: Apache-2.0
 */var dt=function(t,i,s,e){for(var o,h=arguments.length,n=h<3?i:null===e?e=Object.getOwnPropertyDescriptor(i,s):e,r=t.length-1;r>=0;r--)(o=t[r])&&(n=(h<3?o(n):h>3?o(i,s,n):o(i,s))||n);return h>3&&n&&Object.defineProperty(i,s,n),n};let ut=0,pt=class extends ht{constructor(){super(...arguments),this.name="",this.items=[],this.placeholder="",this.selectFirst=!1,this.value="",this.useNative=!1,this._isOpen=!1,this._filteredItems=[],this._activeIndex=-1,this._listId="lit-typeahead-list-"+ut++,this._listboxId="lit-typeahead-listbox-"+ut++}willUpdate(t){(t.has("items")||t.has("selectFirst"))&&this.selectFirst&&!this.value&&this.items.length>0&&(this.value=this.items[0]),(t.has("items")||t.has("value")||t.has("selectFirst"))&&(this._filteredItems=this._filterItems(this.value),this._activeIndex>=this._filteredItems.length&&(this._activeIndex=-1),0===this._filteredItems.length&&(this._isOpen=!1)),t.has("useNative")&&this._closeDropdown()}render(){return this.useNative?this._renderNative():this._renderCustom()}_renderNative(){const t=this.id||void 0;return B`
      <input
        type="text"
        id=${t??H}
        name=${this.name||H}
        list=${this._listId}
        placeholder=${this.placeholder||H}
        aria-label=${this.placeholder||this.name||H}
        .value=${this.value}
        @change=${this._handleNativeChange}
      />
      <datalist id=${this._listId}>
        ${this.items.map(t=>B`<option value=${t}></option>`)}
      </datalist>
    `}_renderCustom(){const t=this.id||void 0,i=this._isOpen?"typeahead is-open":"typeahead";return B`
      <div class=${i}>
        <div class="input-wrapper">
          <input
            type="text"
            id=${t??H}
            name=${this.name||H}
            placeholder=${this.placeholder||H}
            aria-label=${this.placeholder||this.name||H}
            role="combobox"
            aria-expanded=${this._isOpen?"true":"false"}
            aria-autocomplete="list"
            aria-controls=${this._isOpen?this._listboxId:H}
            aria-activedescendant=${this._activeIndex>=0?`${this._listboxId}-${this._activeIndex}`:H}
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
            aria-label=${this._isOpen?"Close suggestions":"Open suggestions"}
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
        ${this._isOpen&&this._filteredItems.length>0?B`
              <ul
                class="dropdown"
                id=${this._listboxId}
                role="listbox"
                @mousedown=${this._handleListMouseDown}
              >
                ${this._filteredItems.map((t,i)=>B`
                    <li
                      id=${`${this._listboxId}-${i}`}
                      role="option"
                      aria-selected=${i===this._activeIndex?"true":"false"}
                      class=${i===this._activeIndex?"active":""}
                      @click=${()=>this._selectItem(t)}
                    >
                      ${t}
                    </li>
                  `)}
              </ul>
            `:H}
      </div>
    `}_handleNativeChange(t){const i=t.target;this.value=i.value,this._dispatchChange(this.value),void 0!==this._findMatchingItem(this.value)&&this._dispatchItemSelected(this.value)}_handleInput(t){const i=t.target;this.value=i.value,this._filteredItems=this._filterItems(i.value),this._activeIndex=-1,this._isOpen=this._filteredItems.length>0}_handleCustomChange(t){const i=t.target;this.value=i.value,this._closeDropdown(),this._dispatchChange(this.value)}_handleFocus(){this._openDropdown()}_handleInputClick(){this._isOpen||this._openDropdown()}_handleBlur(){this._closeDropdown()}_handleListMouseDown(t){t.preventDefault()}_handleIconMouseDown(t){t.preventDefault()}_handleIconClick(t){if(t.preventDefault(),this._isOpen)return void this._closeDropdown();this._openDropdown();const i=this.shadowRoot?.querySelector("input");i instanceof HTMLInputElement&&i.focus()}_handleKeydown(t){if("ArrowDown"===t.key&&!this._isOpen)return t.preventDefault(),this._openDropdown(),void(this._isOpen&&(this._activeIndex=0));if(this._isOpen&&0!==this._filteredItems.length)switch(t.key){case"ArrowDown":t.preventDefault(),this._activeIndex=(this._activeIndex+1)%this._filteredItems.length;break;case"ArrowUp":t.preventDefault(),this._activeIndex=this._activeIndex<=0?this._filteredItems.length-1:this._activeIndex-1;break;case"Enter":this._activeIndex>=0&&this._activeIndex<this._filteredItems.length&&(t.preventDefault(),this._selectItem(this._filteredItems[this._activeIndex]));break;case"Escape":t.preventDefault(),this._closeDropdown()}}_selectItem(t){this.value=t,this._closeDropdown(),this._dispatchChange(t),this._dispatchItemSelected(t)}_openDropdown(){0!==this.items.length?(this._filteredItems=this._filterItems(this.value),this._activeIndex=-1,this._isOpen=this._filteredItems.length>0):this._isOpen=!1}_closeDropdown(){this._isOpen=!1,this._activeIndex=-1}_filterItems(t){const i=t.trim().toLowerCase();return""===i?[...this.items]:this.items.filter(t=>t.toLowerCase().includes(i))}_findMatchingItem(t){const i=t.trim().toLowerCase();return this.items.find(t=>t.toLowerCase()===i)}_dispatchChange(t){this.dispatchEvent(new CustomEvent("change",{detail:{value:t},bubbles:!0,composed:!0}))}_dispatchItemSelected(t){this.dispatchEvent(new CustomEvent("item-selected",{detail:{value:t},bubbles:!0,composed:!0}))}};pt.styles=((t,...i)=>{const e=1===t.length?t[0]:i.reduce((i,s,e)=>i+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[e+1],t[0]);return new o(e,t,s)})`
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
      color: var(--typeahead-icon-color, #000);
      cursor: pointer;
      border-radius: 4px;
      transition: background-color 180ms ease;
    }

    .toggle-icon:hover {
      background-color: var(
        --typeahead-icon-background-hover,
        rgba(0, 0, 0, 0.06)
      );
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
      .toggle-icon-svg .chevron,
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
  `,dt([lt({type:String})],pt.prototype,"name",void 0),dt([lt({type:Array})],pt.prototype,"items",void 0),dt([lt({type:String})],pt.prototype,"placeholder",void 0),dt([lt({type:Boolean,attribute:"select-first"})],pt.prototype,"selectFirst",void 0),dt([lt({type:String})],pt.prototype,"value",void 0),dt([lt({type:Boolean,attribute:"use-native"})],pt.prototype,"useNative",void 0),dt([ct()],pt.prototype,"_isOpen",void 0),dt([ct()],pt.prototype,"_filteredItems",void 0),dt([ct()],pt.prototype,"_activeIndex",void 0),pt=dt([(t=>(i,s)=>{void 0!==s?s.addInitializer(()=>{customElements.define(t,i)}):customElements.define(t,i)})("lit-typeahead")],pt);
/**
 * @license
 * Copyright 2024 Lucas Schirm
 * SPDX-License-Identifier: Apache-2.0
 */
var ft=pt;export{pt as LitTypeahead,ft as default};
