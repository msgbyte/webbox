// react stopPropagation
export function stopPropagation(e: React.BaseSyntheticEvent) {
  if (e && e.stopPropagation) {
    e.stopPropagation();
  }
}
