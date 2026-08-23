/** Bağımlılık eklemeden kullanılan satır içi ikon seti. */

const PATHS = {
  plus: 'M12 5v14M5 12h14',
  check: 'M20 6 9 17l-5-5',
  trash: 'M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6',
  pencil: 'M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z',
  close: 'M18 6 6 18M6 6l12 12',
  sun: 'M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4',
  moon: 'M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z',
  clock: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM12 6v6l4 2',
  list: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
  timeline: 'M4 4v16M8 7h12M8 12h9M8 17h12M6 7H4M6 12H4M6 17H4',
  chevronLeft: 'm15 18-6-6 6-6',
  chevronRight: 'm9 18 6-6-6-6',
  play: 'M6 4l14 8-14 8V4Z',
  pause: 'M8 5h3v14H8zM13 5h3v14h-3z',
  rotate: 'M3 12a9 9 0 1 0 3-6.7M3 4v5h5',
  search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM21 21l-4.3-4.3',
  star: 'm12 3 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3-5.8 3 1.1-6.5L2.6 9.8l6.5-.9L12 3Z',
  flame: 'M12 22a7 7 0 0 0 7-7c0-5-4-6-4-10-3 1-5 4-5 7 0-1-1-2-2-3-1 2-3 3.5-3 6a7 7 0 0 0 7 7Z',
  drag: 'M9 6h.01M9 12h.01M9 18h.01M15 6h.01M15 12h.01M15 18h.01',
  settings: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2v.2a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.6 1.7 1.7 0 0 0-1.9.4l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0-1.2-2.9H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1.1 1.7 1.7 0 0 0-.4-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z',
  undo: 'M9 14 4 9l5-5M4 9h11a5 5 0 0 1 0 10h-3',
  chart: 'M3 3v18h18M7 15v3M12 9v9M17 5v13',
  home: 'm3 10 9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V10Z',
  download: 'M12 3v12M7 11l5 5 5-5M4 21h16',
  bolt: 'M13 2 4 14h7l-1 8 9-12h-7l1-8Z',
  leaf: 'M11 20A7 7 0 0 1 4 13c0-6 8-10 16-10 0 8-4 15-9 15ZM4 20c2-4 5-7 9-9',
}

/**
 * @param {{ name: keyof typeof PATHS, className?: string, strokeWidth?: number }} props
 */
export default function Icon({ name, className = 'h-5 w-5', strokeWidth = 1.8, ...rest }) {
  const d = PATHS[name]
  if (!d) return null

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...rest}
    >
      {d.split(' M').map((segment, i) => (
        <path key={i} d={i === 0 ? segment : `M${segment}`} />
      ))}
    </svg>
  )
}
