// components/PromoModal.jsx
import  { useState } from 'react'
import { Dialog } from '@headlessui/react'
import { XMarkIcon, GiftIcon } from '@heroicons/react/24/outline'

const PromoModal = ({ userId, onClose }) => {
  const [discount, setDiscount] = useState('')
  const [ridesCount, setRidesCount] = useState(1)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setSuccessMessage(null)
    setErrorMessage(null)

    try {
      const res = await fetch('/api/promo-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          discount: parseFloat(discount),
          ridesCount: parseInt(ridesCount),
          startDate,
          endDate,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        setSuccessMessage('Code promo envoyé avec succès !')
        setTimeout(() => {
          onClose()
        }, 1500)
      } else {
        setErrorMessage(data.message || 'Une erreur est survenue.')
      }
    } catch (err) {
      setErrorMessage('Erreur de réseau.' ,err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={true} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
        <div className="relative bg-white rounded-xl shadow-lg w-full max-w-md p-6 z-50">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-semibold flex items-center gap-2">
              <GiftIcon className="h-5 w-5 text-yellow-500" />
              Envoyer un code promo
            </Dialog.Title>
            <button onClick={onClose}>
              <XMarkIcon className="h-5 w-5 text-gray-500 hover:text-gray-700" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Réduction (%)</label>
              <input
                type="number"
                min="1"
                max="100"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre de courses</label>
              <input
                type="number"
                min="1"
                value={ridesCount}
                onChange={(e) => setRidesCount(e.target.value)}
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Date de début</label>
              <input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Date de fin</label>
              <input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>

            {successMessage && (
              <p className="text-sm text-green-600">{successMessage}</p>
            )}
            {errorMessage && (
              <p className="text-sm text-red-600">{errorMessage}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-md transition disabled:opacity-50"
            >
              {loading ? 'Envoi en cours...' : 'Envoyer le code'}
            </button>
          </form>
        </div>
      </div>
    </Dialog>
  )
}

export default PromoModal
