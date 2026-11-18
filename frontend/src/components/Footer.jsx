import logo from '../assets/logo-quackly.png';

function Footer() {
  return (
    <footer className="qk-footer">
      <div className="container">
        <div className="qk-footer__content">
          <div className="qk-footer__section">
            <div className="qk-footer__logo">
              <div>
                <img src={logo} alt="" style={{ width: 50 }} />
              </div>
              <span>
                Quackly
                <p>Seu dinheiro sob controle.</p>
              </span>
            </div>
          </div>

          <div className="qk-footer__section">
            <h4>Produto</h4>
            <ul>
              <li><a href="#features">Recursos</a></li>
              <li><a href="#mentor">Mentor Virtual</a></li>
              <li><a href="#pricing">Benefícios</a></li>
            </ul>
          </div>

          <div className="qk-footer__section">
            <h4>Disponível em</h4>
            
            <div className="qk-footer__available">
              {/* AINDA NAO TEM PRA ANDROID
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/android/android-plain.svg"
                height="30"
                width="30"
                style={{ transform: 'scale(1.3)' }}
                alt="Android"
              />*/}
              <a href="https://github.com/gabrielmiras/Quackly" target="_blank">
                <i className="bi bi-github" 
                  style={{ fontSize: '30px', color: 'white', transform: 'scale(1.3)', display: 'inline-block' }}
                  aria-label="GitHub">
                  </i>
              </a>
            </div>
          </div>
        </div>

        <div className="qk-footer__bottom">
          <p>&copy; 2026 Quackly</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
