import { Link } from 'react-router-dom';
import Button from './Button.jsx';

/**
 * Card único do site. O visual e o conteúdo mudam conforme `variant`:
 *
 *  feature  -> icon | iconImage, title, description
 *  floating -> position (1|2|3), icon, iconTone, title, subtitle, value
 *  pricing  -> title, price, subtitle, features[{text, subItem?}], ctaLabel, ctaTo
 *  stat     -> label, value, sparklinePath
 *  goal     -> image, title, to? | onClick?
 *  quiz     -> title, description, meta, actionLabel, onAction
 */
function Card({ variant = 'feature', className = '', ...props }) {
  const classes = `qk-card qk-card--${variant} ${className}`.trim();

  switch (variant) {
    case 'feature': {
      const { icon, iconImage, title, description } = props;
      return (
        <div className={classes}>
          {iconImage ? (
            <img src={iconImage} alt="" className="qk-card__icon-img" />
          ) : (
            <i className={`bi ${icon} fs-1 mb-3`}></i>
          )}
          <h3 className="qk-card__title">{title}</h3>
          <p className="qk-card__text">{description}</p>
        </div>
      );
    }

    case 'floating': {
      const { position, icon, iconTone, title, subtitle, value } = props;
      return (
        <div className={`${classes} qk-card--floating-${position}`}>
          <div className={`qk-card__badge ${iconTone}`}>
            <i className={`bi ${icon}`}></i>
          </div>
          <div className="qk-card__info">
            <span className="qk-card__title">{title}</span>
            <span className="qk-card__subtitle">{subtitle}</span>
          </div>
          <div className="qk-card__value">{value}</div>
        </div>
      );
    }

    case 'pricing': {
      const { title, price, subtitle, features = [], ctaLabel = 'Começar', ctaTo = '/login' } = props;
      return (
        <div className={classes}>
          <h3 className="qk-card__title">{title}</h3>
          <div className="qk-card__price">{price}</div>
          <p className="qk-card__text">{subtitle}</p>

          <ul className="qk-card__features">
            {features.flatMap((feature) => {
              const items = [
                <li key={feature.text}>
                  <span className="qk-card__cifra">$</span> {feature.text}
                </li>,
              ];
              if (feature.subItem) {
                items.push(
                  <li key={`${feature.text}-sub`} className="qk-card__subitem">
                    ⤷ {feature.subItem}
                  </li>,
                );
              }
              return items;
            })}
          </ul>

          <Button variant="outline" to={ctaTo}>
            {ctaLabel}
          </Button>
        </div>
      );
    }

    case 'stat': {
      const { label, value, sparklinePath } = props;
      return (
        <div className={classes}>
          <div className="qk-card__label">
            <i className="bi bi-asterisk"></i>
            <span>{label}</span>
          </div>
          <div className="qk-card__row">
            <div className="qk-card__value">{value}</div>
            <svg width="100" height="40" viewBox="0 0 100 40">
              <path d={sparklinePath} fill="none" stroke="#3498db" strokeWidth="3" />
            </svg>
          </div>
        </div>
      );
    }

    case 'goal': {
      const { image, title, to, onClick } = props;
      const body = (
        <>
          <img src={image} alt="" className="qk-card__image" />
          <div className="qk-card__body">
            <h3 className="qk-card__title">{title}</h3>
          </div>
        </>
      );

      if (to) {
        return (
          <Link to={to} className={classes}>
            {body}
          </Link>
        );
      }

      return (
        <div
          role="button"
          tabIndex={0}
          className={classes}
          onClick={onClick}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') onClick?.(event);
          }}
        >
          {body}
        </div>
      );
    }

    case 'quiz': {
      const { title, description, meta, actionLabel = 'Começar', onAction } = props;
      return (
        <div className={classes}>
          <div className="qk-card__body">
            <h3 className="qk-card__title">{title}</h3>
            <p className="qk-card__text">{description}</p>
            <hr className="qk-card__divider" />
            <div className="qk-card__footer">
              <Button variant="action" onClick={onAction}>
                {actionLabel}
              </Button>
              <div className="qk-card__meta">{meta}</div>
            </div>
          </div>
        </div>
      );
    }

    default:
      return null;
  }
}

export default Card;
