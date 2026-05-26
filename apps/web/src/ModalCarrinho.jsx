import { useCarrinho } from './CarrinhoContext'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

function ModalCarrinho() {
  const { itens, removerItem, subtotal, frete, total, modalAberto, setModalAberto } = useCarrinho()
  const navigate = useNavigate()
  const [checkoutAberto, setCheckoutAberto] = useState(false)
  const [formaPagamento, setFormaPagamento] = useState('cartao')

  if (!modalAberto && !checkoutAberto) return null

  return (
    <>
      {/* Modal do carrinho */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto">
            
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-playfair text-xl font-bold text-stone-800">Seu Pedido</h2>
              <button onClick={() => setModalAberto(false)} className="text-stone-400">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {itens.length === 0 ? (
              <p className="text-stone-400 text-sm text-center py-8">Nenhum item adicionado</p>
            ) : (
              <div className="space-y-3 mb-6">
                {itens.map((item, index) => (
                  <div key={index} className="flex justify-between items-center border-b border-stone-100 pb-3">
                    <div>
                      <p className="text-stone-700 text-sm font-semibold">{item.nome}</p>
                      <p className="text-gold text-xs">{item.preco}</p>
                    </div>
                    <button onClick={() => removerItem(index)} className="text-stone-300 hover:text-red-400">
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t border-stone-200 pt-4 space-y-2 mb-6">
              <div className="flex justify-between text-sm text-stone-500">
                <span>Subtotal</span><span>R$ {subtotal},00</span>
              </div>
              <div className="flex justify-between text-sm text-stone-500">
                <span>Frete</span><span>R$ {frete},00</span>
              </div>
              <div className="flex justify-between font-bold text-stone-800 text-lg pt-2 border-t border-stone-200">
                <span>Total</span>
                <span className="text-gold">R$ {total},00</span>
              </div>
            </div>

            <button
              onClick={() => { setModalAberto(false); setCheckoutAberto(true) }}
              className="w-full bg-gold text-white py-4 rounded-full text-xs font-semibold tracking-widest uppercase mb-3"
            >
              Finalizar Pedido
            </button>

            <button
              onClick={() => setModalAberto(false)}
              className="w-full border border-stone-300 text-stone-500 py-4 rounded-full text-xs font-semibold tracking-widest uppercase"
            >
              Continuar Comprando
            </button>

          </div>
        </div>
      )}

      {/* Modal de checkout — endereço + pagamento juntos */}
      {checkoutAberto && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-playfair text-xl font-bold text-stone-800">Finalizar Pedido</h2>
              <button onClick={() => setCheckoutAberto(false)} className="text-stone-400">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Total */}
            <div className="bg-stone-50 rounded-xl p-4 mb-6 flex justify-between items-center">
              <span className="text-stone-500 text-sm">Total a pagar</span>
              <span className="text-gold font-bold text-lg">R$ {total},00</span>
            </div>

            {/* Endereço */}
            <h3 className="text-xs font-semibold tracking-widest uppercase text-stone-400 mb-3">Endereço de Entrega</h3>
            <div className="space-y-3 mb-6">
              <input type="text" placeholder="Rua e número" className="w-full border border-stone-200 rounded-xl px-4 py-3 text-stone-800 text-sm"/>
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="Bairro" className="w-full border border-stone-200 rounded-xl px-4 py-3 text-stone-800 text-sm"/>
                <input type="text" placeholder="CEP" maxLength="9" className="w-full border border-stone-200 rounded-xl px-4 py-3 text-stone-800 text-sm"/>
              </div>
              <input type="text" placeholder="Complemento (opcional)" className="w-full border border-stone-200 rounded-xl px-4 py-3 text-stone-800 text-sm"/>
            </div>

            {/* Forma de pagamento */}
            <h3 className="text-xs font-semibold tracking-widest uppercase text-stone-400 mb-3">Forma de Pagamento</h3>
            <div className="grid grid-cols-3 gap-3 mb-6">
              <button onClick={() => setFormaPagamento('cartao')} className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all ${formaPagamento === 'cartao' ? 'border-gold text-gold' : 'border-stone-200 text-stone-400'}`}>
                <span className="material-symbols-outlined mb-1">credit_card</span>
                <span className="text-xs font-semibold">Cartão</span>
              </button>
              <button onClick={() => setFormaPagamento('pix')} className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all ${formaPagamento === 'pix' ? 'border-gold text-gold' : 'border-stone-200 text-stone-400'}`}>
                <span className="material-symbols-outlined mb-1">qr_code</span>
                <span className="text-xs font-semibold">Pix</span>
              </button>
              <button onClick={() => setFormaPagamento('dinheiro')} className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all ${formaPagamento === 'dinheiro' ? 'border-gold text-gold' : 'border-stone-200 text-stone-400'}`}>
                <span className="material-symbols-outlined mb-1">payments</span>
                <span className="text-xs font-semibold">Dinheiro</span>
              </button>
            </div>

            {formaPagamento === 'cartao' && (
              <div className="space-y-3 mb-6">
                <input type="text" placeholder="0000 0000 0000 0000" maxLength="19" className="w-full border border-stone-200 rounded-xl px-4 py-3 text-stone-800 text-sm"/>
                <input type="text" placeholder="NOME NO CARTÃO" className="w-full border border-stone-200 rounded-xl px-4 py-3 text-stone-800 text-sm"/>
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="MM/AA" maxLength="5" className="w-full border border-stone-200 rounded-xl px-4 py-3 text-stone-800 text-sm"/>
                  <input type="text" placeholder="CVV" maxLength="3" className="w-full border border-stone-200 rounded-xl px-4 py-3 text-stone-800 text-sm"/>
                </div>
              </div>
            )}

            {formaPagamento === 'pix' && (
              <div className="flex flex-col items-center mb-6">
                <div className="w-40 h-40 bg-stone-100 rounded-xl flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-stone-400" style={{fontSize: '80px'}}>qr_code_2</span>
                </div>
                <p className="text-stone-500 text-sm text-center">Escaneie o QR code com o app do seu banco</p>
                <p className="text-xs text-stone-400 mt-1">Chave Pix: lumiere@restaurante.com</p>
              </div>
            )}

            {formaPagamento === 'dinheiro' && (
              <div className="bg-stone-50 rounded-xl p-4 mb-6 text-center">
                <span className="material-symbols-outlined text-gold text-4xl mb-2 block">payments</span>
                <p className="text-stone-600 text-sm">Pague <strong>R$ {total},00</strong> na entrega</p>
                <p className="text-stone-400 text-xs mt-1">Tenha o valor exato se possível</p>
              </div>
            )}

            <button
              onClick={() => { setCheckoutAberto(false); navigate('/confirmacao') }}
              className="w-full bg-gold text-white py-4 rounded-full text-xs font-semibold tracking-widest uppercase mb-3"
            >
              {formaPagamento === 'pix' ? 'Já fiz o pagamento' : formaPagamento === 'dinheiro' ? 'Confirmar Pedido' : `Pagar R$ ${total},00`}
            </button>

            <button
              onClick={() => { setCheckoutAberto(false); setModalAberto(true) }}
              className="w-full border border-stone-300 text-stone-500 py-4 rounded-full text-xs font-semibold tracking-widest uppercase"
            >
              Voltar ao Carrinho
            </button>

          </div>
        </div>
      )}
    </>
  )
}

export default ModalCarrinho