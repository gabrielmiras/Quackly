import { Link } from 'react-router-dom';
import {
  GraduationCap,
  MessageCircle,
  ShoppingBag,
  House,
  CarFront,
  Asterisk,
} from 'lucide-react';

import Button from './Button.jsx';

const CARD_ICONS = {
  'bi-mortarboard': GraduationCap,
  'bi-chat-dots': MessageCircle,
  'bi-bag-fill': ShoppingBag,
  'bi-house-door-fill': House,
  'bi-car-front-fill': CarFront,
  'bi-asterisk': Asterisk,
};

const FLOATING_TONES = {
  'bg-danger-subtle text-danger': 'bg-rose-100 text-rose-600',
  'bg-primary-subtle text-primary': 'bg-blue-100 text-blue-600',
  'bg-dark text-white border border-secondary':
    'border border-secondary bg-dark text-white',
};

function Card({ variant = 'feature', className = '', ...props }) {
  const base = `box-border ${className}`.trim();

  switch (variant) {

    // FEATURE
    case 'feature': {
      const { icon, iconImage, title, description } = props;
      const Icon = CARD_ICONS[icon];

      return (
        <div
          className={`
            ${base}
            box-border flex h-full w-full min-w-0
            flex-col items-center
            rounded-[24px] border border-[#EBECF0]
            bg-[#23385d]
            px-5 sm:px-[30px] py-10
            text-center
            transition-all duration-300
            hover:-translate-y-[10px]
            hover:border-[#444]
          `}
        >
          {iconImage ? (
            <img
              src={iconImage}
              alt=""
              className="
                mx-auto mb-3 block
                h-[60px] w-[60px]
                scale-90 invert
              "
            />
          ) : (
            Icon && (
              <Icon
                size={40}
                strokeWidth={1.8}
                className="mb-3 text-white"
              />
            )
          )}

          <h3 className="
            mt-[10px] mb-[10px]
            w-full text-center
          ">
            {title}
          </h3>

          <p className="
            w-full min-w-0
            text-center
            break-words
          ">
            {description}
          </p>
        </div>
      );
    }


    // FLOATING
    case 'floating': {
      const {
        position,
        icon,
        iconTone,
        title,
        subtitle,
        value,
      } = props;

      const Icon = CARD_ICONS[icon];

      const positions = {
        1: 'top-[10%] right-[-100px]',
        2: 'top-[45%] right-[-120px]',
        3: 'top-[75%] right-[-100px]',
      };

      return (
        <div
          className={`
            ${base}
            qk-floating-card
            absolute z-[5] flex w-[260px] items-center
            rounded-2xl border
            bg-[rgba(30,30,30,0.88)] px-4 py-3
            shadow-[0_8px_25px_rgba(0,0,0,0.25)]
            backdrop-blur-[10px]
            animate-[qk-float_4s_ease-in-out_infinite]
            ${positions[position] ?? ''}
            ${position === 2 ? '[animation-delay:1s]' : ''}
            ${position === 3 ? '[animation-delay:2s]' : ''}
            max-[991px]:relative
            max-[991px]:right-auto
            max-[991px]:top-auto
            max-[991px]:mx-auto
            max-[991px]:my-[15px]
            max-[991px]:w-[85%]
            max-[991px]:animate-none
          `}
          style={{
            borderColor: 'rgba(148, 163, 184, 0.16)',
            borderWidth: '1px',
          }}
        >
          <div
            className={`
              mr-3 flex h-9 w-9 shrink-0 items-center
              justify-center rounded-[10px] text-[1.1rem]
              ${FLOATING_TONES[iconTone] ?? ''}
            `}
          >
            {Icon && <Icon size={19} strokeWidth={2} />}
          </div>

          <div className="flex min-w-0 flex-1 flex-col">
            <span className="mb-[2px] text-[0.9rem] font-bold text-white">
              {title}
            </span>

            <span className="text-[0.75rem] font-medium text-[#aaaaaa]">
              {subtitle}
            </span>
          </div>

          <div className="ml-[10px] whitespace-nowrap text-[0.9rem] font-bold text-white">
            {value}
          </div>
        </div>
      );
    }

    // PRICING
    case 'pricing': {
      const {
        title,
        price,
        subtitle,
        features = [],
        ctaLabel = 'Começar',
        ctaTo = '/login',
      } = props;

      return (
        <div
          className={`
            ${base}
            relative flex flex-col gap-6 rounded-2xl
            border-2 border-[#EBECF0] bg-[#23385d] p-8
            transition-all duration-300
            hover:-translate-y-[5px] hover:border-[#FFCB61]
          `}
        >
          <h3 className="mb-2 text-2xl">
            {title}
          </h3>

          <div className="mb-2 text-[2.5rem] font-extrabold text-[#FFCB61]">
            {price}
          </div>

          <p className="mb-4 text-[0.9rem] text-[#94a3b8]">
            {subtitle}
          </p>

          <ul className="flex flex-1 list-none flex-col gap-3 p-0">
            {features.map((feature) => (
              <li
                key={feature.text}
                className="flex items-start gap-2 text-[0.95rem] text-[#f1f5f9]"
              >
                <span className="font-extrabold text-[#FFCB61]">
                  $
                </span>

                {feature.text}
              </li>
            ))}

            {features.map(
              (feature) =>
                feature.subItem && (
                  <li
                    key={`${feature.text}-sub`}
                    className="mt-[-0.25rem] flex items-start gap-2 pl-6 text-[0.85rem] text-[#94a3b8]"
                  >
                    ⤷ {feature.subItem}
                  </li>
                ),
            )}
          </ul>

          <Button variant="outline" to={ctaTo}>
            {ctaLabel}
          </Button>
        </div>
      );
    }

    // STAT
    case 'stat': {
      const { label, value, sparklinePath } = props;

      return (
        <div
          className={`
            ${base}
            rounded-xl border border-[#e2e8f0]
            bg-white p-5
            shadow-[0_1px_3px_rgba(0,0,0,0.05)]
          `}
        >
          <div className="mb-3 flex items-center gap-[10px] text-[0.9rem] font-medium text-[#64748b]">
            <Asterisk size={16} />
            <span>{label}</span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-[10px]">
            <div className="text-2xl font-bold text-[#0f172a]">
              {value}
            </div>

            <svg width="100" height="40" viewBox="0 0 100 40">
              <path
                d={sparklinePath}
                fill="none"
                stroke="#3498db"
                strokeWidth="3"
              />
            </svg>
          </div>
        </div>
      );
    }

    // GOAL
    case 'goal': {
      const { image, title, to, onClick } = props;

      const body = (
        <>
          <img
            src={image}
            alt=""
            className="block h-[200px] w-full object-cover"
          />

          <div className="p-2">
            <h3 className="my-3 text-xl font-bold text-[#1e293b]">
              {title}
            </h3>
          </div>
        </>
      );

      const classes = `
        ${base}
        block h-full w-full min-w-0 cursor-pointer overflow-hidden
        rounded-2xl bg-[#e5e5e0] text-inherit no-underline
        shadow-[0_1px_3px_rgba(0,0,0,0.08)]
        transition-transform duration-200
        hover:-translate-y-1
      `;

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
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              onClick?.(event);
            }
          }}
        >
          {body}
        </div>
      );
    }

    // QUIZ
    case 'quiz': {
      const {
        title,
        description,
        meta,
        actionLabel = 'Começar',
        onAction,
      } = props;

      return (
        <div
          className={`
            ${base}
            flex w-full flex-col overflow-hidden
            rounded-2xl bg-[#e5e5e0]
            shadow-[0_1px_3px_rgba(0,0,0,0.08)]
          `}
        >
          <div className="flex flex-1 flex-col p-6">
            <h3 className="mb-3 text-[1.35rem] font-bold text-[#1e293b]">
              {title}
            </h3>

            <p className="mb-4 flex-1 text-[0.95rem] leading-[1.5] text-[#475569]">
              {description}
            </p>

            <hr className="my-4 border-0 border-t border-black/10" />

            <div className="flex items-center justify-between text-[0.9rem]">
              <Button
                variant="action"
                onClick={onAction}
                className="!rounded-[10px] px-6 py-2.5"
              >
                {actionLabel}
              </Button>

              <div className="ml-3 whitespace-nowrap text-[#64748b]">
                {meta}
              </div>
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
