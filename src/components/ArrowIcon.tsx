const paths = {
  'up-right': 'M7 17 17 7M7 7h10v10',
  'down-right': 'M7 7 17 17M7 17h10V7',
  down: 'M12 5v14M5 12l7 7 7-7',
  up: 'M12 19V5M5 12l7-7 7 7',
  right: 'M5 12h14M12 5l7 7-7 7',
} as const;

export function ArrowIcon({ direction = 'up-right' }: { direction?: keyof typeof paths }) {
  return <svg className="ui-arrow" viewBox="0 0 24 24" width="16" height="16"
    fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
    strokeLinejoin="round" aria-hidden="true" focusable="false">
    <path d={paths[direction]} />
  </svg>;
}
