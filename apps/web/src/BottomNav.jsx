function BottomNav() {
  const currentPath = window.location.pathname

  return (
    <nav className="fixed bottom-0 left-0 w-full h-20 flex justify-around items-center bg-white border-t border-gray-200 z-50">

      <a href="/" className={`flex flex-col items-center ${currentPath === '/' ? 'text-gold' : 'text-gray-400'}`}>
        <span className="material-symbols-outlined">home</span>
        <span className="text-xs mt-1 uppercase tracking-wider">Home</span>
      </a>

      <a href="/cardapio" className={`flex flex-col items-center ${currentPath === '/cardapio' ? 'text-gold' : 'text-gray-400'}`}>
        <span className="material-symbols-outlined">restaurant_menu</span>
        <span className="text-xs mt-1 uppercase tracking-wider">Menu</span>
      </a>

      <a href="/delivery" className={`flex flex-col items-center ${currentPath === '/delivery' ? 'text-gold' : 'text-gray-400'}`}>
        <span className="material-symbols-outlined">delivery_dining</span>
        <span className="text-xs mt-1 uppercase tracking-wider">Order</span>
      </a>

      <a href="/reservas" className={`flex flex-col items-center ${currentPath === '/reservas' ? 'text-gold' : 'text-gray-400'}`}>
        <span className="material-symbols-outlined">event_upcoming</span>
        <span className="text-xs mt-1 uppercase tracking-wider">Book</span>
      </a>

    </nav>
  )
}

export default BottomNav
