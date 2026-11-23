const COINS = [
  { left: '5%', fontSize: 28, delay: 0, opacity: 0.1 },
  { left: '15%', fontSize: 35, delay: 1 },
  { left: '25%', fontSize: 22, delay: 3, opacity: 0.15 },
  { left: '35%', fontSize: 40, delay: 5 },
  { left: '45%', fontSize: 30, delay: 7 },
  { left: '55%', fontSize: 25, delay: 2 },
  { left: '65%', fontSize: 38, delay: 4 },
  { left: '75%', fontSize: 22, delay: 6 },
  { left: '85%', fontSize: 32, delay: 8 },
  { left: '95%', fontSize: 26, delay: 0.5 },
  { left: '10%', fontSize: 34, delay: 2.5 },
  { left: '20%', fontSize: 24, delay: 4.5 },
  { left: '30%', fontSize: 36, delay: 6.5 },
  { left: '40%', fontSize: 28, delay: 8.5 },
  { left: '50%', fontSize: 32, delay: 1.5 },
  { left: '60%', fontSize: 26, delay: 3.5 },
  { left: '70%', fontSize: 40, delay: 5.5 },
  { left: '80%', fontSize: 30, delay: 7.5 },
  { left: '90%', fontSize: 24, delay: 9.5 },
];

function CoinBackground() {
  return (
    <div
      className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {COINS.map((coin) => (
        <div
          key={`${coin.left}-${coin.delay}`}
          className="
            absolute -top-[50px]
            select-none font-bold
            text-[#FFCB61]
            animate-[qk-float-up_8s_linear_infinite]
            [text-shadow:0_0_10px_rgba(255,215,0,0.6),0_0_20px_rgba(218,165,32,0.4)]
          "
          style={{
            left: coin.left,
            fontSize: `${coin.fontSize}px`,
            animationDelay: `${coin.delay}s`,
            opacity: coin.opacity ?? 1,
          }}
        >
          $
        </div>
      ))}
    </div>
  );
}

export default CoinBackground;
