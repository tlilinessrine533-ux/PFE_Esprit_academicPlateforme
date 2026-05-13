export function scrollElementIntoViewOnNextFrame(
  getElement: () => HTMLElement | null | undefined,
  options: ScrollIntoViewOptions = { behavior: 'smooth', block: 'start' }
) {
  const scrollToElement = () => {
    getElement()?.scrollIntoView(options);
  };

  if (typeof requestAnimationFrame === 'function') {
    requestAnimationFrame(scrollToElement);
    return;
  }

  globalThis.setTimeout(scrollToElement, 0);
}
