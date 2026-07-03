export function AppFooter() {
  return (
    <footer
      style={{
        maxWidth: 720,
        margin: '0 auto',
        padding: '32px 24px 40px',
        borderTop: '1px solid #22404C',
      }}
    >
      <p style={{ margin: 0, fontSize: 12, lineHeight: 1.7, color: '#6E8A90' }}>
        Tonnta — <em>waves</em>, as Gaeilge. Data: Marine Institute (CC BY 4.0), Met Éireann,
        Open-Meteo (CC BY 4.0). Forecasts are open-water estimates; breaking waves at the beach are
        often smaller. Sea state is advice, not a lifeguard — know your limits.
      </p>
    </footer>
  );
}
