// Dibujo vectorial de un control remoto, coloreado según la marca.
// Se usa mientras no haya fotos reales de los productos.
export default function RemoteSVG({ color = '#E5382B', brand = '', variant = 'smart', className = '' }) {
  const key = '#2E333D'
  return (
    <svg viewBox="0 0 120 280" className={className} role="img" aria-label={`Control remoto ${brand}`}>
      {variant === 'slim' ? (
        <>
          <rect x="30" y="5" width="60" height="270" rx="30" fill="#D5D9DF" />
          <rect x="32" y="7" width="56" height="266" rx="28" fill="none" stroke="rgba(0,0,0,.18)" strokeWidth="1.5" />
        </>
      ) : (
        <>
          <rect x="15" y="5" width="90" height="270" rx="30" fill="#1B1E25" />
          <rect x="17" y="7" width="86" height="266" rx="28" fill="none" stroke="rgba(255,255,255,.14)" strokeWidth="1.5" />
        </>
      )}

      {variant === 'smart' && (
        <>
          <circle cx="35" cy="36" r="8" fill={color} />
          <circle cx="85" cy="36" r="9" fill="#E5382B" />
          <circle cx="60" cy="92" r="33" fill="#262A33" />
          <circle cx="60" cy="92" r="13" fill={color} />
          <path d="M60 68 l6 8 h-12z M60 116 l6 -8 h-12z M36 92 l8 -6 v12z M84 92 l-8 -6 v12z" fill="#9AA3B2" />
          {[0, 1, 2].map((r) =>
            [0, 1, 2].map((c) => (
              <rect key={`${r}${c}`} x={27 + c * 23} y={146 + r * 22} width="19" height="13" rx="6.5" fill={key} />
            ))
          )}
          <rect x="27" y="214" width="15" height="8" rx="4" fill="#E5382B" />
          <rect x="45" y="214" width="15" height="8" rx="4" fill="#1FA35B" />
          <rect x="63" y="214" width="15" height="8" rx="4" fill="#F4B823" />
          <rect x="81" y="214" width="12" height="8" rx="4" fill="#2764E8" />
        </>
      )}

      {variant === 'classic' && (
        <>
          <circle cx="35" cy="36" r="9" fill="#E5382B" />
          <circle cx="85" cy="36" r="8" fill={key} />
          {[0, 1, 2].map((r) =>
            [0, 1, 2].map((c) => (
              <circle key={`${r}${c}`} cx={38 + c * 22} cy={72 + r * 24} r="9" fill={key} />
            ))
          )}
          <circle cx="60" cy="144" r="9" fill={key} />
          <rect x="24" y="166" width="30" height="56" rx="15" fill={key} />
          <rect x="66" y="166" width="30" height="56" rx="15" fill={key} />
          <circle cx="60" cy="194" r="9" fill={color} />
          <text x="39" y="186" textAnchor="middle" fill="#CBD5E1" fontSize="12">+</text>
          <text x="39" y="210" textAnchor="middle" fill="#CBD5E1" fontSize="12">−</text>
          <text x="81" y="186" textAnchor="middle" fill="#CBD5E1" fontSize="12">+</text>
          <text x="81" y="210" textAnchor="middle" fill="#CBD5E1" fontSize="12">−</text>
        </>
      )}

      {variant === 'slim' && (
        <>
          <circle cx="60" cy="34" r="8" fill="#E5382B" />
          <circle cx="60" cy="92" r="22" fill="#B7BDC7" />
          <circle cx="60" cy="92" r="9" fill={color} />
          {[0, 1, 2].map((r) => [0, 1].map((c) => (
            <circle key={`${r}${c}`} cx={48 + c * 24} cy={142 + r * 24} r="8" fill="#2E333D" />
          )))}
          <rect x="44" y="212" width="32" height="12" rx="6" fill={color} />
        </>
      )}

      {variant === 'deco' && (
        <>
          <circle cx="35" cy="30" r="8" fill="#E5382B" />
          <circle cx="85" cy="30" r="7" fill={key} />
          {[0, 1, 2, 3].map((r) => [0, 1, 2].map((c) => {
            const n = r === 3 ? (c === 1 ? 0 : null) : r * 3 + c + 1
            return n === null ? null : <circle key={`${r}${c}`} cx={38 + c * 22} cy={62 + r * 22} r="8" fill={key} />
          }))}
          <rect x="27" y="156" width="15" height="7" rx="3.5" fill="#E5382B" />
          <rect x="45" y="156" width="15" height="7" rx="3.5" fill="#1FA35B" />
          <rect x="63" y="156" width="15" height="7" rx="3.5" fill="#F4B823" />
          <rect x="81" y="156" width="12" height="7" rx="3.5" fill="#2764E8" />
          <circle cx="60" cy="205" r="26" fill="#262A33" />
          <circle cx="60" cy="205" r="10" fill={color} />
        </>
      )}

      {variant === 'voice' && (
        <>
          <circle cx="35" cy="34" r="9" fill="#E5382B" />
          <rect x="52" y="26" width="34" height="16" rx="8" fill={color} />
          <circle cx="60" cy="96" r="30" fill="#262A33" />
          <circle cx="60" cy="96" r="12" fill="#3A404C" />
          {[0, 1, 2].map((c) => <rect key={c} x={27 + c * 23} y="146" width="19" height="14" rx="7" fill={['#E5382B', color, '#2764E8'][c]} />)}
          <rect x="26" y="172" width="30" height="50" rx="15" fill={key} />
          <rect x="64" y="172" width="30" height="50" rx="15" fill={key} />
        </>
      )}

      {variant === 'ac' && (
        <>
          <rect x="27" y="26" width="66" height="46" rx="8" fill="#0B1220" stroke={color} />
          <text x="60" y="58" textAnchor="middle" fill="#9FE3B0" fontSize="24" fontWeight="700">24°</text>
          <circle cx="60" cy="100" r="12" fill="#E5382B" />
          {[0, 1, 2].map((r) =>
            [0, 1].map((c) => (
              <rect key={`${r}${c}`} x={27 + c * 36} y={126 + r * 24} width="30" height="16" rx="8" fill={key} />
            ))
          )}
          <rect x="27" y="204" width="66" height="16" rx="8" fill="#2764E8" />
        </>
      )}

      <text x="60" y="252" textAnchor="middle" fill={variant === 'slim' ? '#3A404C' : '#E7EAEE'} fontSize="9.5" fontWeight="700" letterSpacing="1.2">
        {brand.toUpperCase()}
      </text>
    </svg>
  )
}
