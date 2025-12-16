type PortalHeroProps = {
  title?: string;
  subtitle?: string;
  eyebrow?: string;
  showLogo?: boolean;
};

const logo = new URL('../../img/logo01.avif', import.meta.url).href;

export function PortalHero({
  title = 'Consejo Intermunicipal Higuito',
  subtitle = 'Directorio y paneles internos listos para conectar con la API.',
  eyebrow = 'Portal institucional',
  showLogo = true,
}: PortalHeroProps) {
  return (
    <header className="cih-card cih-header">
      <div className="cih-card__body">
        <p className="cih-header__eyebrow">{eyebrow}</p>
        <h1 className="cih-header__title">{title}</h1>
        <p className="cih-header__description">{subtitle}</p>
        {showLogo && (
          <div className="cih-header__logo">
            <img src={logo} alt="Logo Consejo Intermunicipal Higuito" />
          </div>
        )}
      </div>
    </header>
  );
}
