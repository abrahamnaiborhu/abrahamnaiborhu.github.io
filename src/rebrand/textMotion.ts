/**
 * Runtime text splitting for motion only.
 *
 * Nothing here runs during static rendering, so the served HTML, the accessible
 * name of every link, and the no-JavaScript reading experience stay unchanged.
 * Each splitter returns a restore function; callers must run it on cleanup so a
 * reduced-motion switch or an unmount puts the original text back.
 */

const SPLIT_FLAG = "data-split";

function collectTextNodes(root: Element): Text[] {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (node.textContent && node.textContent.trim()) nodes.push(node as Text);
  }
  return nodes;
}

function wrap(node: Text, pieces: string[], className: string) {
  const fragment = document.createDocumentFragment();
  for (const piece of pieces) {
    // Whitespace stays a bare text node: an inline-block space would stop the
    // line from breaking there and push long headings out of their column.
    if (!piece.trim()) {
      fragment.append(piece);
      continue;
    }
    const span = document.createElement("span");
    span.className = className;
    span.textContent = piece;
    fragment.append(span);
  }
  node.replaceWith(fragment);
}

/** The element's text as a reader hears it: decorative children do not count. */
function visibleText(element: HTMLElement): string {
  const clone = element.cloneNode(true) as HTMLElement;
  for (const hidden of clone.querySelectorAll('[aria-hidden="true"]')) hidden.remove();
  return (clone.textContent ?? "").replace(/\s+/g, " ").trim();
}

/**
 * Splits every text node into per-character spans.
 *
 * Inline-block characters would otherwise be joined with spaces by the accessible
 * name calculation ("V i e w  r e p o s i t o r y"), so the element carries its
 * original text as an explicit label for as long as it stays split.
 */
export function splitChars(element: HTMLElement): () => void {
  if (element.hasAttribute(SPLIT_FLAG)) return () => {};
  const original = element.innerHTML;
  const labelled = element.hasAttribute("aria-label");
  if (!labelled) element.setAttribute("aria-label", visibleText(element));
  element.setAttribute(SPLIT_FLAG, "chars");
  for (const node of collectTextNodes(element)) {
    // Characters nest inside words inside one wrapper. Flex containers such as
    // .button and .text-link would otherwise treat every character as its own
    // flex item, stretching the control and breaking words across lines.
    const container = document.createElement("span");
    container.className = "split";
    for (const piece of (node.textContent ?? "").split(/(\s+)/).filter(Boolean)) {
      if (!piece.trim()) {
        container.append(piece);
        continue;
      }
      const word = document.createElement("span");
      word.className = "word";
      for (const character of piece) {
        const span = document.createElement("span");
        span.className = "char";
        span.textContent = character;
        word.append(span);
      }
      container.append(word);
    }
    node.replaceWith(container);
  }
  return () => {
    element.innerHTML = original;
    element.removeAttribute(SPLIT_FLAG);
    if (!labelled) element.removeAttribute("aria-label");
  };
}

/** Splits every text node into per-word spans, keeping the spaces between them. */
export function splitWords(element: HTMLElement): () => void {
  if (element.hasAttribute(SPLIT_FLAG)) return () => {};
  const original = element.innerHTML;
  element.setAttribute(SPLIT_FLAG, "words");
  for (const node of collectTextNodes(element)) {
    // The capturing split keeps whitespace as its own piece, so line breaks stay natural.
    wrap(node, (node.textContent ?? "").split(/(\s+)/).filter(Boolean), "word");
  }
  return () => {
    element.innerHTML = original;
    element.removeAttribute(SPLIT_FLAG);
  };
}

export function charsOf(element: HTMLElement): HTMLElement[] {
  return [...element.querySelectorAll<HTMLElement>(".char")].filter(char => char.textContent?.trim());
}

export function wordsOf(element: HTMLElement): HTMLElement[] {
  return [...element.querySelectorAll<HTMLElement>(".word")].filter(word => word.textContent?.trim());
}
