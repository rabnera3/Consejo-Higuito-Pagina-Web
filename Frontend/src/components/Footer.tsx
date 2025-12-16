import logo from '../img/logo01.avif'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-gray-600">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Consejo Intermunicipal Higuito" className="h-8 w-auto" />
          <span className="font-semibold text-gray-800">Consejo Intermunicipal Higuito</span>
        </div>
        <div className="text-gray-500">© {year} Consejo Intermunicipal Higuito</div>
      </div>
    </footer>
  )
}