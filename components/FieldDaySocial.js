const reels = ['DZWRZ0ZP9Zw', 'DZLwgD4SAeX', 'DZLhGt9yqkG', 'DZYx3z7vuGn'];

export default function FieldDaySocial() {
  return <section className="field-day-social" aria-label="Field Day on Instagram">
    <div className="field-day-social-grid">
      {reels.map((id, index) => <figure key={id}>
        <iframe src={`https://www.instagram.com/reel/${id}/embed/`} title={`Adult Field Day Instagram reel ${index + 1}`} loading="lazy" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowFullScreen />
      </figure>)}
    </div>
  </section>;
}
