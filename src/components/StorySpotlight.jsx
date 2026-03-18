export default function StorySpotlight({
  eyebrow = "Primary workflow",
  title,
  description,
  tags = [],
  primaryAction = null,
  secondaryAction = null,
  metrics = [],
}) {
  return (
    <section className="story-spotlight" aria-label={title}>
      <div className="story-spotlight-main">
        <div>
          <p className="panel-label">{eyebrow}</p>
          <h3>{title}</h3>
          <p className="story-spotlight-description">{description}</p>
        </div>
        {tags.length ? (
          <div className="story-spotlight-tags">
            {tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
        ) : null}
        {(primaryAction || secondaryAction) ? (
          <div className="story-spotlight-actions">
            {primaryAction ? (
              <button
                className="primary-button"
                type="button"
                onClick={primaryAction.onClick}
              >
                {primaryAction.label}
              </button>
            ) : null}
            {secondaryAction ? (
              <button
                className="ghost-button"
                type="button"
                onClick={secondaryAction.onClick}
              >
                {secondaryAction.label}
              </button>
            ) : null}
          </div>
        ) : null}
      </div>

      {metrics.length ? (
        <div className="story-spotlight-metrics">
          {metrics.map((item) => (
            <div key={item.label} className="story-spotlight-metric">
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
