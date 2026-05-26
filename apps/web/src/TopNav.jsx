import { useCarrinho } from './CarrinhoContext'

function TopNav() {
  const { itens, setModalAberto } = useCarrinho()

  return (
    <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="flex justify-between items-center px-5 h-16 max-w-5xl mx-auto">
        <h1 className="text-gold tracking-widest uppercase font-playfair text-xl">
          Lumière
        </h1>
        <div className="relative">
          <button className="text-gold" onClick={() => setModalAberto(true)}>
            <span className="material-symbols-outlined">shopping_bag</span>
          </button>
          {itens.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-gold text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
              {itens.length}
            </span>
          )}
        </div>
      </div>
    </header>
  )
}

export default TopNav