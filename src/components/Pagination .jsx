// components/Pagination.tsx
import { ChevronLeft, ChevronRight } from 'lucide-react';



const Pagination = ({ currentPage, totalPages, onPageChange, className = '' }) => {
  const maxVisiblePages = 5; // Nombre maximum de pages visibles

  const getPageNumbers = () => {
    const pages = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (totalPages > maxVisiblePages) {
      if (endPage === totalPages) {
        startPage = totalPages - maxVisiblePages + 1;
      } else if (startPage === 1) {
        endPage = maxVisiblePages;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex-1 flex justify-between sm:hidden">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Précédent
        </button>
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Suivant
        </button>
      </div>
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Affichage de <span className="font-medium">{(currentPage - 1) * 10 + 1}</span> à{' '}
            <span className="font-medium">{Math.min(currentPage * 10, totalPages * 10)}</span> sur{' '}
            <span className="font-medium">{totalPages * 10}</span> résultats
          </p>
        </div>
        <div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              <span className="sr-only">Précédent</span>
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>

            {/* Première page */}
            {currentPage > Math.floor(maxVisiblePages / 2) + 1 && totalPages > maxVisiblePages && (
              <>
                <button
                  onClick={() => onPageChange(1)}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                    1 === currentPage ? 'bg-indigo-50 border-indigo-500 text-indigo-600' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  1
                </button>
                {currentPage > Math.floor(maxVisiblePages / 2) + 2 && (
                  <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                    ...
                  </span>
                )}
              </>
            )}

            {/* Pages centrales */}
            {getPageNumbers().map((page) => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                  page === currentPage
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-600 z-10'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}

            {/* Dernière page */}
            {currentPage < totalPages - Math.floor(maxVisiblePages / 2) && totalPages > maxVisiblePages && (
              <>
                {currentPage < totalPages - Math.floor(maxVisiblePages / 2) - 1 && (
                  <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                    ...
                  </span>
                )}
                <button
                  onClick={() => onPageChange(totalPages)}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                    totalPages === currentPage
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {totalPages}
                </button>
              </>
            )}

            <button
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              <span className="sr-only">Suivant</span>
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;