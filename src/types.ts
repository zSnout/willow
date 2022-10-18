/**
 * Based on JSX types for Surplus.
 *
 * https://github.com/adamhaile/surplus/blob/master/index.d.ts
 */

import { StandardProperties } from "csstype";
import { MaybeAccessors } from "./accessors.js";
import { EffectScope, Setter, ValueOrAccessor } from "./primitives.js";

declare global {
  interface Node {
    willowScopes?: Set<EffectScope>;
  }

  namespace JSX {
    interface Element extends ChildNode {}

    interface ElementChildrenAttribute {
      children: {};
    }

    interface IntrinsicAttributes {
      use?: Setter<Node>;
    }

    interface ElementTagNameMap {
      // HTML
      a: HTMLAttributes<HTMLAnchorElement>;
      abbr: HTMLAttributes<HTMLElement>;
      address: HTMLAttributes<HTMLElement>;
      area: HTMLAttributes<HTMLAreaElement>;
      article: HTMLAttributes<HTMLElement>;
      aside: HTMLAttributes<HTMLElement>;
      audio: HTMLAttributes<HTMLAudioElement>;
      b: HTMLAttributes<HTMLElement>;
      base: HTMLAttributes<HTMLBaseElement>;
      bdi: HTMLAttributes<HTMLElement>;
      bdo: HTMLAttributes<HTMLElement>;
      big: HTMLAttributes<HTMLElement>;
      blockquote: HTMLAttributes<HTMLElement>;
      body: HTMLAttributes<HTMLBodyElement>;
      br: HTMLAttributes<HTMLBRElement>;
      button: HTMLAttributes<HTMLButtonElement>;
      canvas: HTMLAttributes<HTMLCanvasElement>;
      caption: HTMLAttributes<HTMLElement>;
      cite: HTMLAttributes<HTMLElement>;
      code: HTMLAttributes<HTMLElement>;
      col: HTMLAttributes<HTMLTableColElement>;
      colgroup: HTMLAttributes<HTMLTableColElement>;
      data: HTMLAttributes<HTMLElement>;
      datalist: HTMLAttributes<HTMLDataListElement>;
      dd: HTMLAttributes<HTMLElement>;
      del: HTMLAttributes<HTMLElement>;
      details: HTMLAttributes<HTMLElement>;
      dfn: HTMLAttributes<HTMLElement>;
      dialog: HTMLAttributes<HTMLElement>;
      div: HTMLAttributes<HTMLDivElement>;
      dl: HTMLAttributes<HTMLDListElement>;
      dt: HTMLAttributes<HTMLElement>;
      em: HTMLAttributes<HTMLElement>;
      embed: HTMLAttributes<HTMLEmbedElement>;
      fieldset: HTMLAttributes<HTMLFieldSetElement>;
      figcaption: HTMLAttributes<HTMLElement>;
      figure: HTMLAttributes<HTMLElement>;
      footer: HTMLAttributes<HTMLElement>;
      form: HTMLAttributes<HTMLFormElement>;
      h1: HTMLAttributes<HTMLHeadingElement>;
      h2: HTMLAttributes<HTMLHeadingElement>;
      h3: HTMLAttributes<HTMLHeadingElement>;
      h4: HTMLAttributes<HTMLHeadingElement>;
      h5: HTMLAttributes<HTMLHeadingElement>;
      h6: HTMLAttributes<HTMLHeadingElement>;
      head: HTMLAttributes<HTMLHeadElement>;
      header: HTMLAttributes<HTMLElement>;
      hgroup: HTMLAttributes<HTMLElement>;
      hr: HTMLAttributes<HTMLHRElement>;
      html: HTMLAttributes<HTMLHtmlElement>;
      i: HTMLAttributes<HTMLElement>;
      iframe: HTMLAttributes<HTMLIFrameElement>;
      img: HTMLAttributes<HTMLImageElement>;
      input: HTMLAttributes<HTMLInputElement>;
      ins: HTMLAttributes<HTMLModElement>;
      kbd: HTMLAttributes<HTMLElement>;
      keygen: HTMLAttributes<HTMLElement>;
      label: HTMLAttributes<HTMLLabelElement>;
      legend: HTMLAttributes<HTMLLegendElement>;
      li: HTMLAttributes<HTMLLIElement>;
      link: HTMLAttributes<HTMLLinkElement>;
      main: HTMLAttributes<HTMLElement>;
      map: HTMLAttributes<HTMLMapElement>;
      mark: HTMLAttributes<HTMLElement>;
      menu: HTMLAttributes<HTMLElement>;
      menuitem: HTMLAttributes<HTMLElement>;
      meta: HTMLAttributes<HTMLMetaElement>;
      meter: HTMLAttributes<HTMLElement>;
      nav: HTMLAttributes<HTMLElement>;
      noindex: HTMLAttributes<HTMLElement>;
      noscript: HTMLAttributes<HTMLElement>;
      object: HTMLAttributes<HTMLObjectElement>;
      ol: HTMLAttributes<HTMLOListElement>;
      optgroup: HTMLAttributes<HTMLOptGroupElement>;
      option: HTMLAttributes<HTMLOptionElement>;
      output: HTMLAttributes<HTMLElement>;
      p: HTMLAttributes<HTMLParagraphElement>;
      param: HTMLAttributes<HTMLParamElement>;
      picture: HTMLAttributes<HTMLElement>;
      pre: HTMLAttributes<HTMLPreElement>;
      progress: HTMLAttributes<HTMLProgressElement>;
      q: HTMLAttributes<HTMLQuoteElement>;
      rp: HTMLAttributes<HTMLElement>;
      rt: HTMLAttributes<HTMLElement>;
      ruby: HTMLAttributes<HTMLElement>;
      s: HTMLAttributes<HTMLElement>;
      samp: HTMLAttributes<HTMLElement>;
      script: HTMLAttributes<HTMLElement>;
      section: HTMLAttributes<HTMLElement>;
      select: HTMLAttributes<HTMLSelectElement>;
      slot: HTMLAttributes<HTMLSlotElement>;
      small: HTMLAttributes<HTMLElement>;
      source: HTMLAttributes<HTMLSourceElement>;
      span: HTMLAttributes<HTMLSpanElement>;
      strong: HTMLAttributes<HTMLElement>;
      style: HTMLAttributes<HTMLStyleElement>;
      sub: HTMLAttributes<HTMLElement>;
      summary: HTMLAttributes<HTMLElement>;
      sup: HTMLAttributes<HTMLElement>;
      table: HTMLAttributes<HTMLTableElement>;
      tbody: HTMLAttributes<HTMLTableSectionElement>;
      /** @deprecated */
      td: HTMLAttributes<HTMLTableDataCellElement>;
      textarea: HTMLAttributes<HTMLTextAreaElement>;
      tfoot: HTMLAttributes<HTMLTableSectionElement>;
      /** @deprecated */
      th: HTMLAttributes<HTMLTableHeaderCellElement>;
      thead: HTMLAttributes<HTMLTableSectionElement>;
      time: HTMLAttributes<HTMLElement>;
      title: HTMLAttributes<HTMLTitleElement>;
      tr: HTMLAttributes<HTMLTableRowElement>;
      track: HTMLAttributes<HTMLTrackElement>;
      u: HTMLAttributes<HTMLElement>;
      ul: HTMLAttributes<HTMLUListElement>;
      var: HTMLAttributes<HTMLElement>;
      video: HTMLAttributes<HTMLVideoElement>;
      wbr: HTMLAttributes<HTMLElement>;

      // SVG
      svg: SVGAttributes<SVGElement>;

      animate: SVGAttributes<SVGElement>;
      animateTransform: SVGAttributes<SVGElement>;
      circle: SVGAttributes<SVGElement>;
      clipPath: SVGAttributes<SVGElement>;
      defs: SVGAttributes<SVGElement>;
      desc: SVGAttributes<SVGElement>;
      ellipse: SVGAttributes<SVGElement>;
      feBlend: SVGAttributes<SVGElement>;
      feColorMatrix: SVGAttributes<SVGElement>;
      feComponentTransfer: SVGAttributes<SVGElement>;
      feComposite: SVGAttributes<SVGElement>;
      feConvolveMatrix: SVGAttributes<SVGElement>;
      feDiffuseLighting: SVGAttributes<SVGElement>;
      feDisplacementMap: SVGAttributes<SVGElement>;
      feDistantLight: SVGAttributes<SVGElement>;
      feFlood: SVGAttributes<SVGElement>;
      feFuncA: SVGAttributes<SVGElement>;
      feFuncB: SVGAttributes<SVGElement>;
      feFuncG: SVGAttributes<SVGElement>;
      feFuncR: SVGAttributes<SVGElement>;
      feGaussianBlur: SVGAttributes<SVGElement>;
      feImage: SVGAttributes<SVGElement>;
      feMerge: SVGAttributes<SVGElement>;
      feMergeNode: SVGAttributes<SVGElement>;
      feMorphology: SVGAttributes<SVGElement>;
      feOffset: SVGAttributes<SVGElement>;
      fePointLight: SVGAttributes<SVGElement>;
      feSpecularLighting: SVGAttributes<SVGElement>;
      feSpotLight: SVGAttributes<SVGElement>;
      feTile: SVGAttributes<SVGElement>;
      feTurbulence: SVGAttributes<SVGElement>;
      filter: SVGAttributes<SVGElement>;
      foreignObject: SVGAttributes<SVGElement>;
      g: SVGAttributes<SVGElement>;
      image: SVGAttributes<SVGElement>;
      line: SVGAttributes<SVGElement>;
      linearGradient: SVGAttributes<SVGElement>;
      marker: SVGAttributes<SVGElement>;
      mask: SVGAttributes<SVGElement>;
      metadata: SVGAttributes<SVGElement>;
      path: SVGAttributes<SVGElement>;
      pattern: SVGAttributes<SVGElement>;
      polygon: SVGAttributes<SVGElement>;
      polyline: SVGAttributes<SVGElement>;
      radialGradient: SVGAttributes<SVGElement>;
      rect: SVGAttributes<SVGElement>;
      stop: SVGAttributes<SVGElement>;
      switch: SVGAttributes<SVGElement>;
      symbol: SVGAttributes<SVGElement>;
      text: SVGAttributes<SVGElement>;
      textPath: SVGAttributes<SVGElement>;
      tspan: SVGAttributes<SVGElement>;
      use: SVGAttributes<SVGElement>;
      view: SVGAttributes<SVGElement>;
    }

    interface IntrinsicElements extends ElementTagNameMap {}

    interface EventHandler<T, E extends Event> {
      (e: E & { currentTarget: T }): void;
    }

    interface BaseAttributes<T> extends BindableFor<T> {
      use?: Setter<T>;
    }

    type Child =
      | string
      | number
      | boolean
      | Node
      | Child[]
      | (() => unknown)
      | null
      | undefined;

    interface DOMAttributes<T> extends BaseAttributes<T> {
      "children"?: Child;
      "classList"?: Record<string, ValueOrAccessor<boolean>>;

      // Clipboard Events
      "on:copy"?: EventHandler<T, ClipboardEvent>;
      "oncapture:copy"?: EventHandler<T, ClipboardEvent>;
      "on:cut"?: EventHandler<T, ClipboardEvent>;
      "oncapture:cut"?: EventHandler<T, ClipboardEvent>;
      "on:paste"?: EventHandler<T, ClipboardEvent>;
      "oncapture:paste"?: EventHandler<T, ClipboardEvent>;

      // Composition Events
      "on:compositionend"?: EventHandler<T, CompositionEvent>;
      "oncapture:compositionend"?: EventHandler<T, CompositionEvent>;
      "on:compositionstart"?: EventHandler<T, CompositionEvent>;
      "oncapture:compositionstart"?: EventHandler<T, CompositionEvent>;
      "on:compositionupdate"?: EventHandler<T, CompositionEvent>;
      "oncapture:compositionupdate"?: EventHandler<T, CompositionEvent>;

      // Focus Events
      "on:focus"?: EventHandler<T, FocusEvent>;
      "oncapture:focus"?: EventHandler<T, FocusEvent>;
      "on:blur"?: EventHandler<T, FocusEvent>;
      "oncapture:blur"?: EventHandler<T, FocusEvent>;

      // Form Events
      "on:change"?: EventHandler<T, Event>;
      "oncapture:change"?: EventHandler<T, Event>;
      "on:input"?: EventHandler<T, Event>;
      "oncapture:input"?: EventHandler<T, Event>;
      "on:reset"?: EventHandler<T, Event>;
      "oncapture:reset"?: EventHandler<T, Event>;
      "on:submit"?: EventHandler<T, Event>;
      "oncapture:submit"?: EventHandler<T, Event>;

      // Image Events
      "on:load"?: EventHandler<T, Event>;
      "oncapture:load"?: EventHandler<T, Event>;
      "on:error"?: EventHandler<T, Event>; // also a Media Event
      "oncapture:error"?: EventHandler<T, Event>; // also a Media Event

      // Keyboard Events
      "on:keydown"?: EventHandler<T, KeyboardEvent>;
      "oncapture:keydown"?: EventHandler<T, KeyboardEvent>;
      "on:keypress"?: EventHandler<T, KeyboardEvent>;
      "oncapture:keypress"?: EventHandler<T, KeyboardEvent>;
      "on:keyup"?: EventHandler<T, KeyboardEvent>;
      "oncapture:keyup"?: EventHandler<T, KeyboardEvent>;

      // Media Events
      "on:abort"?: EventHandler<T, Event>;
      "oncapture:abort"?: EventHandler<T, Event>;
      "on:canplay"?: EventHandler<T, Event>;
      "oncapture:canplay"?: EventHandler<T, Event>;
      "on:canplaythrough"?: EventHandler<T, Event>;
      "oncapture:canplaythrough"?: EventHandler<T, Event>;
      "on:durationchange"?: EventHandler<T, Event>;
      "oncapture:durationchange"?: EventHandler<T, Event>;
      "on:emptied"?: EventHandler<T, Event>;
      "oncapture:emptied"?: EventHandler<T, Event>;
      "on:encrypted"?: EventHandler<T, Event>;
      "oncapture:encrypted"?: EventHandler<T, Event>;
      "on:ended"?: EventHandler<T, Event>;
      "oncapture:ended"?: EventHandler<T, Event>;
      "on:loadeddata"?: EventHandler<T, Event>;
      "oncapture:loadeddata"?: EventHandler<T, Event>;
      "on:loadedmetadata"?: EventHandler<T, Event>;
      "oncapture:loadedmetadata"?: EventHandler<T, Event>;
      "on:loadstart"?: EventHandler<T, Event>;
      "oncapture:loadstart"?: EventHandler<T, Event>;
      "on:pause"?: EventHandler<T, Event>;
      "oncapture:pause"?: EventHandler<T, Event>;
      "on:play"?: EventHandler<T, Event>;
      "oncapture:play"?: EventHandler<T, Event>;
      "on:playing"?: EventHandler<T, Event>;
      "oncapture:playing"?: EventHandler<T, Event>;
      "on:progress"?: EventHandler<T, Event>;
      "oncapture:progress"?: EventHandler<T, Event>;
      "on:ratechange"?: EventHandler<T, Event>;
      "oncapture:ratechange"?: EventHandler<T, Event>;
      "on:seeked"?: EventHandler<T, Event>;
      "oncapture:seeked"?: EventHandler<T, Event>;
      "on:seeking"?: EventHandler<T, Event>;
      "oncapture:seeking"?: EventHandler<T, Event>;
      "on:stalled"?: EventHandler<T, Event>;
      "oncapture:stalled"?: EventHandler<T, Event>;
      "on:suspend"?: EventHandler<T, Event>;
      "oncapture:suspend"?: EventHandler<T, Event>;
      "on:timeupdate"?: EventHandler<T, Event>;
      "oncapture:timeupdate"?: EventHandler<T, Event>;
      "on:volumechange"?: EventHandler<T, Event>;
      "oncapture:volumechange"?: EventHandler<T, Event>;
      "on:waiting"?: EventHandler<T, Event>;
      "oncapture:waiting"?: EventHandler<T, Event>;

      // MouseEvents
      "on:click"?: EventHandler<T, MouseEvent>;
      "oncapture:click"?: EventHandler<T, MouseEvent>;
      "on:contextmenu"?: EventHandler<T, MouseEvent>;
      "oncapture:contextmenu"?: EventHandler<T, MouseEvent>;
      "on:doubleclick"?: EventHandler<T, MouseEvent>;
      "oncapture:doubleclick"?: EventHandler<T, MouseEvent>;
      "on:drag"?: EventHandler<T, DragEvent>;
      "oncapture:drag"?: EventHandler<T, DragEvent>;
      "on:dragend"?: EventHandler<T, DragEvent>;
      "oncapture:dragend"?: EventHandler<T, DragEvent>;
      "on:dragenter"?: EventHandler<T, DragEvent>;
      "oncapture:dragenter"?: EventHandler<T, DragEvent>;
      "on:dragexit"?: EventHandler<T, DragEvent>;
      "oncapture:dragexit"?: EventHandler<T, DragEvent>;
      "on:dragleave"?: EventHandler<T, DragEvent>;
      "oncapture:dragleave"?: EventHandler<T, DragEvent>;
      "on:dragover"?: EventHandler<T, DragEvent>;
      "oncapture:dragover"?: EventHandler<T, DragEvent>;
      "on:dragstart"?: EventHandler<T, DragEvent>;
      "oncapture:dragstart"?: EventHandler<T, DragEvent>;
      "on:drop"?: EventHandler<T, DragEvent>;
      "oncapture:drop"?: EventHandler<T, DragEvent>;
      "on:mousedown"?: EventHandler<T, MouseEvent>;
      "oncapture:mousedown"?: EventHandler<T, MouseEvent>;
      "on:mouseenter"?: EventHandler<T, MouseEvent>;
      "on:mouseleave"?: EventHandler<T, MouseEvent>;
      "on:mousemove"?: EventHandler<T, MouseEvent>;
      "oncapture:mousemove"?: EventHandler<T, MouseEvent>;
      "on:mouseout"?: EventHandler<T, MouseEvent>;
      "oncapture:mouseout"?: EventHandler<T, MouseEvent>;
      "on:mouseover"?: EventHandler<T, MouseEvent>;
      "oncapture:mouseover"?: EventHandler<T, MouseEvent>;
      "on:mouseup"?: EventHandler<T, MouseEvent>;
      "oncapture:mouseup"?: EventHandler<T, MouseEvent>;

      // Selection Events
      "on:select"?: EventHandler<T, Event>;
      "oncapture:select"?: EventHandler<T, Event>;

      // Touch Events
      "on:touchcancel"?: EventHandler<T, TouchEvent>;
      "oncapture:touchcancel"?: EventHandler<T, TouchEvent>;
      "on:touchend"?: EventHandler<T, TouchEvent>;
      "oncapture:touchend"?: EventHandler<T, TouchEvent>;
      "on:touchmove"?: EventHandler<T, TouchEvent>;
      "oncapture:touchmove"?: EventHandler<T, TouchEvent>;
      "on:touchstart"?: EventHandler<T, TouchEvent>;
      "oncapture:touchstart"?: EventHandler<T, TouchEvent>;

      // UI Events
      "on:scroll"?: EventHandler<T, UIEvent>;
      "oncapture:scroll"?: EventHandler<T, UIEvent>;

      // Wheel Events
      "on:wheel"?: EventHandler<T, WheelEvent>;
      "oncapture:wheel"?: EventHandler<T, WheelEvent>;

      // Animation Events
      "on:animationstart"?: EventHandler<T, AnimationEvent>;
      "oncapture:animationstart"?: EventHandler<T, AnimationEvent>;
      "on:animationend"?: EventHandler<T, AnimationEvent>;
      "oncapture:animationend"?: EventHandler<T, AnimationEvent>;
      "on:animationiteration"?: EventHandler<T, AnimationEvent>;
      "oncapture:animationiteration"?: EventHandler<T, AnimationEvent>;

      // Transition Events
      "on:transitionend"?: EventHandler<T, TransitionEvent>;
      "oncapture:transitionend"?: EventHandler<T, TransitionEvent>;
    }

    interface HTMLAttributes<T> extends DOMAttributes<T> {
      // Standard HTML Attributes
      accept?: ValueOrAccessor<string | undefined>;
      acceptCharset?: ValueOrAccessor<string | undefined>;
      accessKey?: ValueOrAccessor<string | undefined>;
      action?: ValueOrAccessor<string | undefined>;
      allowFullScreen?: ValueOrAccessor<boolean | undefined>;
      allowTransparency?: ValueOrAccessor<boolean | undefined>;
      alt?: ValueOrAccessor<string | undefined>;
      async?: ValueOrAccessor<boolean | undefined>;
      autoComplete?: ValueOrAccessor<string | undefined>;
      autoFocus?: ValueOrAccessor<boolean | undefined>;
      autoPlay?: ValueOrAccessor<boolean | undefined>;
      capture?: ValueOrAccessor<boolean | undefined>;
      cellPadding?: ValueOrAccessor<number | string | undefined>;
      cellSpacing?: ValueOrAccessor<number | string | undefined>;
      charSet?: ValueOrAccessor<string | undefined>;
      challenge?: ValueOrAccessor<string | undefined>;
      checked?: ValueOrAccessor<boolean | undefined>;
      classID?: ValueOrAccessor<string | undefined>;
      className?: ValueOrAccessor<string | undefined>;
      class?: ValueOrAccessor<string | undefined>;
      cols?: ValueOrAccessor<number | undefined>;
      colSpan?: ValueOrAccessor<number | undefined>;
      content?: ValueOrAccessor<string | undefined>;
      contentEditable?: ValueOrAccessor<boolean | undefined>;
      contextMenu?: ValueOrAccessor<string | undefined>;
      controls?: ValueOrAccessor<boolean | undefined>;
      coords?: ValueOrAccessor<string | undefined>;
      crossOrigin?: ValueOrAccessor<string | undefined>;
      data?: ValueOrAccessor<string | undefined>;
      dateTime?: ValueOrAccessor<string | undefined>;
      default?: ValueOrAccessor<boolean | undefined>;
      defer?: ValueOrAccessor<boolean | undefined>;
      dir?: ValueOrAccessor<string | undefined>;
      disabled?: ValueOrAccessor<boolean | undefined>;
      download?: ValueOrAccessor<any | undefined>;
      draggable?: ValueOrAccessor<boolean | undefined>;
      encType?: ValueOrAccessor<string | undefined>;
      form?: ValueOrAccessor<string | undefined>;
      formAction?: ValueOrAccessor<string | undefined>;
      formEncType?: ValueOrAccessor<string | undefined>;
      formMethod?: ValueOrAccessor<string | undefined>;
      formNoValidate?: ValueOrAccessor<boolean | undefined>;
      formTarget?: ValueOrAccessor<string | undefined>;
      frameBorder?: ValueOrAccessor<number | string | undefined>;
      headers?: ValueOrAccessor<string | undefined>;
      height?: ValueOrAccessor<number | string | undefined>;
      hidden?: ValueOrAccessor<boolean | undefined>;
      high?: ValueOrAccessor<number | undefined>;
      href?: ValueOrAccessor<string | undefined>;
      hrefLang?: ValueOrAccessor<string | undefined>;
      htmlFor?: ValueOrAccessor<string | undefined>;
      for?: ValueOrAccessor<string | undefined>;
      httpEquiv?: ValueOrAccessor<string | undefined>;
      id?: ValueOrAccessor<string | undefined>;
      innerText?: ValueOrAccessor<string | number | undefined>;
      inputMode?: ValueOrAccessor<string | undefined>;
      integrity?: ValueOrAccessor<string | undefined>;
      is?: ValueOrAccessor<string | undefined>;
      keyParams?: ValueOrAccessor<string | undefined>;
      keyType?: ValueOrAccessor<string | undefined>;
      kind?: ValueOrAccessor<string | undefined>;
      label?: ValueOrAccessor<string | undefined>;
      lang?: ValueOrAccessor<string | undefined>;
      list?: ValueOrAccessor<string | undefined>;
      loop?: ValueOrAccessor<boolean | undefined>;
      low?: ValueOrAccessor<number | undefined>;
      manifest?: ValueOrAccessor<string | undefined>;
      marginHeight?: ValueOrAccessor<number | undefined>;
      marginWidth?: ValueOrAccessor<number | undefined>;
      max?: ValueOrAccessor<number | string | undefined>;
      maxLength?: ValueOrAccessor<number | undefined>;
      media?: ValueOrAccessor<string | undefined>;
      mediaGroup?: ValueOrAccessor<string | undefined>;
      method?: ValueOrAccessor<string | undefined>;
      min?: ValueOrAccessor<number | string | undefined>;
      minLength?: ValueOrAccessor<number | undefined>;
      multiple?: ValueOrAccessor<boolean | undefined>;
      muted?: ValueOrAccessor<boolean | undefined>;
      name?: ValueOrAccessor<string | undefined>;
      nonce?: ValueOrAccessor<string | undefined>;
      noValidate?: ValueOrAccessor<boolean | undefined>;
      open?: ValueOrAccessor<boolean | undefined>;
      optimum?: ValueOrAccessor<number | undefined>;
      pattern?: ValueOrAccessor<string | undefined>;
      placeholder?: ValueOrAccessor<string | undefined>;
      playsInline?: ValueOrAccessor<boolean | undefined>;
      poster?: ValueOrAccessor<string | undefined>;
      preload?: ValueOrAccessor<string | undefined>;
      radioGroup?: ValueOrAccessor<string | undefined>;
      readOnly?: ValueOrAccessor<boolean | undefined>;
      rel?: ValueOrAccessor<string | undefined>;
      required?: ValueOrAccessor<boolean | undefined>;
      reversed?: ValueOrAccessor<boolean | undefined>;
      role?: ValueOrAccessor<string | undefined>;
      rows?: ValueOrAccessor<number | undefined>;
      rowSpan?: ValueOrAccessor<number | undefined>;
      sandbox?: ValueOrAccessor<string | undefined>;
      scope?: ValueOrAccessor<string | undefined>;
      scoped?: ValueOrAccessor<boolean | undefined>;
      scrolling?: ValueOrAccessor<string | undefined>;
      seamless?: ValueOrAccessor<boolean | undefined>;
      selected?: ValueOrAccessor<boolean | undefined>;
      shape?: ValueOrAccessor<string | undefined>;
      size?: ValueOrAccessor<number | undefined>;
      sizes?: ValueOrAccessor<string | undefined>;
      span?: ValueOrAccessor<number | undefined>;
      spellCheck?: ValueOrAccessor<boolean | undefined>;
      src?: ValueOrAccessor<string | undefined>;
      srcDoc?: ValueOrAccessor<string | undefined>;
      srcLang?: ValueOrAccessor<string | undefined>;
      srcSet?: ValueOrAccessor<string | undefined>;
      start?: ValueOrAccessor<number | undefined>;
      step?: ValueOrAccessor<number | string | undefined>;
      style?: Partial<MaybeAccessors<StandardProperties>> | string;
      summary?: ValueOrAccessor<string | undefined>;
      tabIndex?: ValueOrAccessor<number | undefined>;
      target?: ValueOrAccessor<string | undefined>;
      title?: ValueOrAccessor<string | undefined>;
      type?: ValueOrAccessor<string | undefined>;
      useMap?: ValueOrAccessor<string | undefined>;
      value?: ValueOrAccessor<string | string[] | number | undefined>;
      width?: ValueOrAccessor<number | string | undefined>;
      wmode?: ValueOrAccessor<string | undefined>;
      wrap?: ValueOrAccessor<string | undefined>;

      // RDFa Attributes
      about?: ValueOrAccessor<string | undefined>;
      datatype?: ValueOrAccessor<string | undefined>;
      inlist?: ValueOrAccessor<any | undefined>;
      prefix?: ValueOrAccessor<string | undefined>;
      property?: ValueOrAccessor<string | undefined>;
      resource?: ValueOrAccessor<string | undefined>;
      typeof?: ValueOrAccessor<string | undefined>;
      vocab?: ValueOrAccessor<string | undefined>;

      // Non-standard Attributes
      autoCapitalize?: ValueOrAccessor<string | undefined>;
      autoCorrect?: ValueOrAccessor<string | undefined>;
      autoSave?: ValueOrAccessor<string | undefined>;
      color?: ValueOrAccessor<string | undefined>;
      itemProp?: ValueOrAccessor<string | undefined>;
      itemScope?: ValueOrAccessor<boolean | undefined>;
      itemType?: ValueOrAccessor<string | undefined>;
      itemID?: ValueOrAccessor<string | undefined>;
      itemRef?: ValueOrAccessor<string | undefined>;
      results?: ValueOrAccessor<number | undefined>;
      security?: ValueOrAccessor<string | undefined>;
      unselectable?: ValueOrAccessor<boolean | undefined>;
    }

    interface SVGAttributes<T> extends HTMLAttributes<T> {
      accentHeight?: ValueOrAccessor<number | string | undefined>;
      accumulate?: ValueOrAccessor<"none" | "sum" | undefined>;
      additive?: ValueOrAccessor<"replace" | "sum" | undefined>;
      alignmentBaseline?: ValueOrAccessor<
        | "auto"
        | "baseline"
        | "before-edge"
        | "text-before-edge"
        | "middle"
        | "central"
        | "after-edge"
        | "text-after-edge"
        | "ideographic"
        | "alphabetic"
        | "hanging"
        | "mathematical"
        | "inherit"
        | undefined
      >;
      allowReorder?: ValueOrAccessor<"no" | "yes" | undefined>;
      alphabetic?: ValueOrAccessor<number | string | undefined>;
      amplitude?: ValueOrAccessor<number | string | undefined>;
      arabicForm?: ValueOrAccessor<
        "initial" | "medial" | "terminal" | "isolated" | undefined
      >;
      ascent?: ValueOrAccessor<number | string | undefined>;
      attributeName?: ValueOrAccessor<string | undefined>;
      attributeType?: ValueOrAccessor<string | undefined>;
      autoReverse?: ValueOrAccessor<number | string | undefined>;
      azimuth?: ValueOrAccessor<number | string | undefined>;
      baseFrequency?: ValueOrAccessor<number | string | undefined>;
      baselineShift?: ValueOrAccessor<number | string | undefined>;
      baseProfile?: ValueOrAccessor<number | string | undefined>;
      bbox?: ValueOrAccessor<number | string | undefined>;
      begin?: ValueOrAccessor<number | string | undefined>;
      bias?: ValueOrAccessor<number | string | undefined>;
      by?: ValueOrAccessor<number | string | undefined>;
      calcMode?: ValueOrAccessor<number | string | undefined>;
      capHeight?: ValueOrAccessor<number | string | undefined>;
      clip?: ValueOrAccessor<number | string | undefined>;
      clipPath?: ValueOrAccessor<string | undefined>;
      clipPathUnits?: ValueOrAccessor<number | string | undefined>;
      clipRule?: ValueOrAccessor<number | string | undefined>;
      colorInterpolation?: ValueOrAccessor<number | string | undefined>;
      colorInterpolationFilters?: ValueOrAccessor<
        "auto" | "sRGB" | "linearRGB" | "inherit" | undefined
      >;
      colorProfile?: ValueOrAccessor<number | string | undefined>;
      colorRendering?: ValueOrAccessor<number | string | undefined>;
      contentScriptType?: ValueOrAccessor<number | string | undefined>;
      contentStyleType?: ValueOrAccessor<number | string | undefined>;
      cursor?: ValueOrAccessor<number | string | undefined>;
      cx?: ValueOrAccessor<number | string | undefined>;
      cy?: ValueOrAccessor<number | string | undefined>;
      d?: ValueOrAccessor<string | undefined>;
      decelerate?: ValueOrAccessor<number | string | undefined>;
      descent?: ValueOrAccessor<number | string | undefined>;
      diffuseConstant?: ValueOrAccessor<number | string | undefined>;
      direction?: ValueOrAccessor<number | string | undefined>;
      display?: ValueOrAccessor<number | string | undefined>;
      divisor?: ValueOrAccessor<number | string | undefined>;
      dominantBaseline?: ValueOrAccessor<number | string | undefined>;
      dur?: ValueOrAccessor<number | string | undefined>;
      dx?: ValueOrAccessor<number | string | undefined>;
      dy?: ValueOrAccessor<number | string | undefined>;
      edgeMode?: ValueOrAccessor<number | string | undefined>;
      elevation?: ValueOrAccessor<number | string | undefined>;
      enableBackground?: ValueOrAccessor<number | string | undefined>;
      end?: ValueOrAccessor<number | string | undefined>;
      exponent?: ValueOrAccessor<number | string | undefined>;
      externalResourcesRequired?: ValueOrAccessor<number | string | undefined>;
      fill?: ValueOrAccessor<string | undefined>;
      fillOpacity?: ValueOrAccessor<number | string | undefined>;
      fillRule?: ValueOrAccessor<"nonzero" | "evenodd" | "inherit" | undefined>;
      filter?: ValueOrAccessor<string | undefined>;
      filterRes?: ValueOrAccessor<number | string | undefined>;
      filterUnits?: ValueOrAccessor<number | string | undefined>;
      floodColor?: ValueOrAccessor<number | string | undefined>;
      floodOpacity?: ValueOrAccessor<number | string | undefined>;
      focusable?: ValueOrAccessor<number | string | undefined>;
      fontFamily?: ValueOrAccessor<string | undefined>;
      fontSize?: ValueOrAccessor<number | string | undefined>;
      fontSizeAdjust?: ValueOrAccessor<number | string | undefined>;
      fontStretch?: ValueOrAccessor<number | string | undefined>;
      fontStyle?: ValueOrAccessor<number | string | undefined>;
      fontVariant?: ValueOrAccessor<number | string | undefined>;
      fontWeight?: ValueOrAccessor<number | string | undefined>;
      format?: ValueOrAccessor<number | string | undefined>;
      from?: ValueOrAccessor<number | string | undefined>;
      fx?: ValueOrAccessor<number | string | undefined>;
      fy?: ValueOrAccessor<number | string | undefined>;
      g1?: ValueOrAccessor<number | string | undefined>;
      g2?: ValueOrAccessor<number | string | undefined>;
      glyphName?: ValueOrAccessor<number | string | undefined>;
      glyphOrientationHorizontal?: ValueOrAccessor<number | string | undefined>;
      glyphOrientationVertical?: ValueOrAccessor<number | string | undefined>;
      glyphRef?: ValueOrAccessor<number | string | undefined>;
      gradientTransform?: ValueOrAccessor<string | undefined>;
      gradientUnits?: ValueOrAccessor<string | undefined>;
      hanging?: ValueOrAccessor<number | string | undefined>;
      horizAdvX?: ValueOrAccessor<number | string | undefined>;
      horizOriginX?: ValueOrAccessor<number | string | undefined>;
      ideographic?: ValueOrAccessor<number | string | undefined>;
      imageRendering?: ValueOrAccessor<number | string | undefined>;
      in2?: ValueOrAccessor<number | string | undefined>;
      in?: ValueOrAccessor<string | undefined>;
      intercept?: ValueOrAccessor<number | string | undefined>;
      k1?: ValueOrAccessor<number | string | undefined>;
      k2?: ValueOrAccessor<number | string | undefined>;
      k3?: ValueOrAccessor<number | string | undefined>;
      k4?: ValueOrAccessor<number | string | undefined>;
      k?: ValueOrAccessor<number | string | undefined>;
      kernelMatrix?: ValueOrAccessor<number | string | undefined>;
      kernelUnitLength?: ValueOrAccessor<number | string | undefined>;
      kerning?: ValueOrAccessor<number | string | undefined>;
      keyPoints?: ValueOrAccessor<number | string | undefined>;
      keySplines?: ValueOrAccessor<number | string | undefined>;
      keyTimes?: ValueOrAccessor<number | string | undefined>;
      lengthAdjust?: ValueOrAccessor<number | string | undefined>;
      letterSpacing?: ValueOrAccessor<number | string | undefined>;
      lightingColor?: ValueOrAccessor<number | string | undefined>;
      limitingConeAngle?: ValueOrAccessor<number | string | undefined>;
      local?: ValueOrAccessor<number | string | undefined>;
      markerEnd?: ValueOrAccessor<string | undefined>;
      markerHeight?: ValueOrAccessor<number | string | undefined>;
      markerMid?: ValueOrAccessor<string | undefined>;
      markerStart?: ValueOrAccessor<string | undefined>;
      markerUnits?: ValueOrAccessor<number | string | undefined>;
      markerWidth?: ValueOrAccessor<number | string | undefined>;
      mask?: ValueOrAccessor<string | undefined>;
      maskContentUnits?: ValueOrAccessor<number | string | undefined>;
      maskUnits?: ValueOrAccessor<number | string | undefined>;
      mathematical?: ValueOrAccessor<number | string | undefined>;
      mode?: ValueOrAccessor<number | string | undefined>;
      numOctaves?: ValueOrAccessor<number | string | undefined>;
      offset?: ValueOrAccessor<number | string | undefined>;
      opacity?: ValueOrAccessor<number | string | undefined>;
      operator?: ValueOrAccessor<number | string | undefined>;
      order?: ValueOrAccessor<number | string | undefined>;
      orient?: ValueOrAccessor<number | string | undefined>;
      orientation?: ValueOrAccessor<number | string | undefined>;
      origin?: ValueOrAccessor<number | string | undefined>;
      overflow?: ValueOrAccessor<number | string | undefined>;
      overlinePosition?: ValueOrAccessor<number | string | undefined>;
      overlineThickness?: ValueOrAccessor<number | string | undefined>;
      paintOrder?: ValueOrAccessor<number | string | undefined>;
      panose1?: ValueOrAccessor<number | string | undefined>;
      pathLength?: ValueOrAccessor<number | string | undefined>;
      patternContentUnits?: ValueOrAccessor<string | undefined>;
      patternTransform?: ValueOrAccessor<number | string | undefined>;
      patternUnits?: ValueOrAccessor<string | undefined>;
      pointerEvents?: ValueOrAccessor<number | string | undefined>;
      points?: ValueOrAccessor<string | undefined>;
      pointsAtX?: ValueOrAccessor<number | string | undefined>;
      pointsAtY?: ValueOrAccessor<number | string | undefined>;
      pointsAtZ?: ValueOrAccessor<number | string | undefined>;
      preserveAlpha?: ValueOrAccessor<number | string | undefined>;
      preserveAspectRatio?: ValueOrAccessor<string | undefined>;
      primitiveUnits?: ValueOrAccessor<number | string | undefined>;
      r?: ValueOrAccessor<number | string | undefined>;
      radius?: ValueOrAccessor<number | string | undefined>;
      refX?: ValueOrAccessor<number | string | undefined>;
      refY?: ValueOrAccessor<number | string | undefined>;
      renderingIntent?: ValueOrAccessor<number | string | undefined>;
      repeatCount?: ValueOrAccessor<number | string | undefined>;
      repeatDur?: ValueOrAccessor<number | string | undefined>;
      requiredExtensions?: ValueOrAccessor<number | string | undefined>;
      requiredFeatures?: ValueOrAccessor<number | string | undefined>;
      restart?: ValueOrAccessor<number | string | undefined>;
      result?: ValueOrAccessor<string | undefined>;
      rotate?: ValueOrAccessor<number | string | undefined>;
      rx?: ValueOrAccessor<number | string | undefined>;
      ry?: ValueOrAccessor<number | string | undefined>;
      scale?: ValueOrAccessor<number | string | undefined>;
      seed?: ValueOrAccessor<number | string | undefined>;
      shapeRendering?: ValueOrAccessor<number | string | undefined>;
      slope?: ValueOrAccessor<number | string | undefined>;
      spacing?: ValueOrAccessor<number | string | undefined>;
      specularConstant?: ValueOrAccessor<number | string | undefined>;
      specularExponent?: ValueOrAccessor<number | string | undefined>;
      speed?: ValueOrAccessor<number | string | undefined>;
      spreadMethod?: ValueOrAccessor<string | undefined>;
      startOffset?: ValueOrAccessor<number | string | undefined>;
      stdDeviation?: ValueOrAccessor<number | string | undefined>;
      stemh?: ValueOrAccessor<number | string | undefined>;
      stemv?: ValueOrAccessor<number | string | undefined>;
      stitchTiles?: ValueOrAccessor<number | string | undefined>;
      stopColor?: ValueOrAccessor<string | undefined>;
      stopOpacity?: ValueOrAccessor<number | string | undefined>;
      strikethroughPosition?: ValueOrAccessor<number | string | undefined>;
      strikethroughThickness?: ValueOrAccessor<number | string | undefined>;
      string?: ValueOrAccessor<number | string | undefined>;
      stroke?: ValueOrAccessor<string | undefined>;
      strokeDasharray?: ValueOrAccessor<string | number | undefined>;
      strokeDashoffset?: ValueOrAccessor<string | number | undefined>;
      strokeLinecap?: ValueOrAccessor<
        "butt" | "round" | "square" | "inherit" | undefined
      >;
      strokeLinejoin?: ValueOrAccessor<
        "miter" | "round" | "bevel" | "inherit" | undefined
      >;
      strokeMiterlimit?: ValueOrAccessor<number | string | undefined>;
      strokeOpacity?: ValueOrAccessor<number | string | undefined>;
      strokeWidth?: ValueOrAccessor<number | string | undefined>;
      surfaceScale?: ValueOrAccessor<number | string | undefined>;
      systemLanguage?: ValueOrAccessor<number | string | undefined>;
      tableValues?: ValueOrAccessor<number | string | undefined>;
      targetX?: ValueOrAccessor<number | string | undefined>;
      targetY?: ValueOrAccessor<number | string | undefined>;
      textAnchor?: ValueOrAccessor<string | undefined>;
      textDecoration?: ValueOrAccessor<number | string | undefined>;
      textLength?: ValueOrAccessor<number | string | undefined>;
      textRendering?: ValueOrAccessor<number | string | undefined>;
      to?: ValueOrAccessor<number | string | undefined>;
      transform?: ValueOrAccessor<string | undefined>;
      u1?: ValueOrAccessor<number | string | undefined>;
      u2?: ValueOrAccessor<number | string | undefined>;
      underlinePosition?: ValueOrAccessor<number | string | undefined>;
      underlineThickness?: ValueOrAccessor<number | string | undefined>;
      unicode?: ValueOrAccessor<number | string | undefined>;
      unicodeBidi?: ValueOrAccessor<number | string | undefined>;
      unicodeRange?: ValueOrAccessor<number | string | undefined>;
      unitsPerEm?: ValueOrAccessor<number | string | undefined>;
      vAlphabetic?: ValueOrAccessor<number | string | undefined>;
      values?: ValueOrAccessor<string | undefined>;
      vectorEffect?: ValueOrAccessor<number | string | undefined>;
      version?: ValueOrAccessor<string | undefined>;
      vertAdvY?: ValueOrAccessor<number | string | undefined>;
      vertOriginX?: ValueOrAccessor<number | string | undefined>;
      vertOriginY?: ValueOrAccessor<number | string | undefined>;
      vHanging?: ValueOrAccessor<number | string | undefined>;
      vIdeographic?: ValueOrAccessor<number | string | undefined>;
      viewBox?: ValueOrAccessor<string | undefined>;
      viewTarget?: ValueOrAccessor<number | string | undefined>;
      visibility?: ValueOrAccessor<number | string | undefined>;
      vMathematical?: ValueOrAccessor<number | string | undefined>;
      widths?: ValueOrAccessor<number | string | undefined>;
      wordSpacing?: ValueOrAccessor<number | string | undefined>;
      writingMode?: ValueOrAccessor<number | string | undefined>;
      x1?: ValueOrAccessor<number | string | undefined>;
      x2?: ValueOrAccessor<number | string | undefined>;
      x?: ValueOrAccessor<number | string | undefined>;
      xChannelSelector?: ValueOrAccessor<string | undefined>;
      xHeight?: ValueOrAccessor<number | string | undefined>;
      xlinkActuate?: ValueOrAccessor<string | undefined>;
      xlinkArcrole?: ValueOrAccessor<string | undefined>;
      xlinkHref?: ValueOrAccessor<string | undefined>;
      xlinkRole?: ValueOrAccessor<string | undefined>;
      xlinkShow?: ValueOrAccessor<string | undefined>;
      xlinkTitle?: ValueOrAccessor<string | undefined>;
      xlinkType?: ValueOrAccessor<string | undefined>;
      xmlBase?: ValueOrAccessor<string | undefined>;
      xmlLang?: ValueOrAccessor<string | undefined>;
      xmlns?: ValueOrAccessor<string | undefined>;
      xmlnsXlink?: ValueOrAccessor<string | undefined>;
      xmlSpace?: ValueOrAccessor<string | undefined>;
      y1?: ValueOrAccessor<number | string | undefined>;
      y2?: ValueOrAccessor<number | string | undefined>;
      y?: ValueOrAccessor<number | string | undefined>;
      yChannelSelector?: ValueOrAccessor<string | undefined>;
      z?: ValueOrAccessor<number | string | undefined>;
      zoomAndPan?: ValueOrAccessor<string | undefined>;
    }
  }
}
