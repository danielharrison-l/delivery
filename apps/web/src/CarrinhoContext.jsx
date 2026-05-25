import { createContext, useContext, useState } from 'react'

const CarrinhoContext = createContext()

export function CarrinhoProvider({ children }) {
  const [itens, setItens] = useState([])
  const [modalAberto, setModalAberto] = useState(false)

  function adicionarItem(item) {
    setItens([...itens, item])
  }

  function removerItem(index) {
    setItens(itens.filter((_, i) => i !== index))
  }

  const subtotal = itens.reduce((acc, item) => acc + (item.valor || 0), 0)
  const frete = itens.length > 0 ? 15 : 0
  const total = subtotal + frete

  return (
    <CarrinhoContext.Provider value={{ itens, adicionarItem, removerItem, subtotal, frete, total, modalAberto, setModalAberto }}>
      {children}
    </CarrinhoContext.Provider>
  )
}

export function useCarrinho() {
  return useContext(CarrinhoContext)
}