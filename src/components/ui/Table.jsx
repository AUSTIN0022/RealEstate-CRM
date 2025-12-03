// Table.jsx
import { useState, useMemo, useRef, useEffect } from "react"
import { createPortal } from "react-dom" //
import { ChevronLeft, ChevronRight, MoreVertical } from "lucide-react"

export const Table = ({ columns, data, onRowClick, actions, itemsPerPage = 10 }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [sortConfig, setSortConfig] = useState(null)

  const sortedData = useMemo(() => {
    const sorted = [...data]
    if (sortConfig) {
      sorted.sort((a, b) => {
        const aValue = a[sortConfig.key]
        const bValue = b[sortConfig.key]
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1
        return 0
      })
    }
    return sorted
  }, [data, sortConfig])

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return sortedData.slice(startIndex, startIndex + itemsPerPage)
  }, [sortedData, currentPage, itemsPerPage])

  const totalPages = Math.ceil(sortedData.length / itemsPerPage)

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev?.key === key && prev.direction === "asc" ? "desc" : "asc",
    }))
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => col.sortable && handleSort(col.key)}
              >
                {col.label}
              </th>
            ))}
            {actions && <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, idx) => (
            <tr
              key={idx}
              className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
              onClick={() => onRowClick && onRowClick(row)}
            >
              {columns.map((col) => (
                <td key={col.key} className="px-6 py-4 text-sm text-gray-900 rounded-xl" >
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
              {actions && (
                <td className="px-6 py-4 text-sm" onClick={(e) => e.stopPropagation()}>
                  <ActionMenu items={actions(row)} />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {paginatedData.length === 0 && <div className="text-center py-8 text-gray-500">No data found</div>}

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 hover:bg-gray-100 disabled:opacity-50 rounded"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 hover:bg-gray-100 disabled:opacity-50 rounded"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Updated ActionMenu using Portal to escape overflow containers
const ActionMenu = ({ items }) => {
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const buttonRef = useRef(null)

  // Close menu on scroll to prevent it from floating detached
  useEffect(() => {
    const handleScroll = () => {
        if(open) setOpen(false);
    }
    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, [open]);

  const handleToggle = (e) => {
    e.stopPropagation();
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      const spaceBelow = window.innerHeight - rect.bottom
      const menuHeight = items.length * 40 + 16 // Approximate height
      
      // Decide position: Open upwards if not enough space below
      const showUpwards = spaceBelow < menuHeight && rect.top > menuHeight;
      
      // Calculate coordinates
      // The menu is w-40 (160px). We align the right edge of menu with right edge of button
      setPosition({
        top: showUpwards ? rect.top - menuHeight : rect.bottom + 5,
        left: rect.right - 160 // Align right edges (button right - menu width)
      })
    }
    setOpen(!open)
  }

  return (
    <>
      <button 
        ref={buttonRef}
        onClick={handleToggle} 
        className="p-1 hover:bg-gray-200 rounded-xl transition-colors relative"
      >
        <MoreVertical size={18} />
      </button>

      {open && createPortal(
        <>
          {/* Backdrop to handle click outside */}
          <div 
            className="fixed inset-0 z-[9998] bg-transparent" 
            onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
            }}
          />
          
          {/* The Menu Content */}
          <div 
            className="fixed z-[9999] w-40 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-100"
            style={{ 
                top: `${position.top}px`, 
                left: `${position.left}px`,
            }}
          >
            {items.map((item, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation()
                  item.onClick()
                  setOpen(false)
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-700 transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>
        </>,
        document.body
      )}
    </>
  )
}