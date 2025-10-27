import { useEffect } from "react"
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react"

/**
 * Advanced Modal Component with Two-Column Support
 * 
 * @param {boolean} isOpen - Controls modal visibility
 * @param {function} onClose - Callback when modal closes
 * @param {string} title - Modal title
 * @param {node} children - Modal content
 * @param {node} footer - Optional footer content
 * @param {string} size - Modal size: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'full'
 * @param {string} placement - Modal placement: 'center' | 'top' | 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'right' | 'left'
 * @param {string} variant - Modal style: 'default' | 'form' | 'crud' | 'popup' | 'slide' | 'drawer'
 * @param {string} type - Modal type for icons: 'default' | 'info' | 'success' | 'warning' | 'error'
 * @param {boolean} showCloseButton - Show/hide close button (default: true)
 * @param {boolean} closeOnOverlay - Close modal when clicking overlay (default: true)
 * @param {boolean} closeOnEscape - Close modal on Escape key (default: true)
 * @param {boolean} scrollable - Enable scrolling for content (default: true)
 * @param {string} scrollBehavior - 'inside' | 'outside' - where scrolling happens
 * @param {node} headerIcon - Custom icon for header
 * @param {string} headerClassName - Custom classes for header
 * @param {string} contentClassName - Custom classes for content
 * @param {string} footerClassName - Custom classes for footer
 * @param {boolean} backdrop - Show backdrop (default: true)
 * @param {string} backdropBlur - Backdrop blur intensity: 'none' | 'sm' | 'md' | 'lg'
 * @param {string} animation - Animation style: 'fade' | 'slide' | 'zoom' | 'flip'
 * @param {boolean} twoColumn - Enable two-column layout (default: false)
 * @param {node} leftColumn - Content for left column (when twoColumn is true)
 * @param {node} rightColumn - Content for right column (when twoColumn is true)
 * @param {string} columnGap - Gap between columns: 'sm' | 'md' | 'lg' | 'xl' (default: 'lg')
 * @param {boolean} showSectionDividers - Show section dividers in columns (default: false)
 */
export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
  placement = "center",
  variant = "default",
  type = "default",
  showCloseButton = true,
  closeOnOverlay = true,
  closeOnEscape = true,
  scrollable = true,
  scrollBehavior = "inside",
  headerIcon,
  headerClassName = "",
  contentClassName = "",
  footerClassName = "",
  backdrop = true,
  backdropBlur = "sm",
  animation = "fade",
  twoColumn = false,
  leftColumn,
  rightColumn,
  columnGap = "lg",
  showSectionDividers = false,
}) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && closeOnEscape) onClose()
    }
    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose, closeOnEscape])

  if (!isOpen) return null

  // Size classes
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
    full: "max-w-full",
  }

  // Placement classes
  const placementClasses = {
    center: "items-center justify-center",
    top: "items-start justify-center pt-20",
    "top-right": "items-start justify-end pt-20 pr-8",
    "top-left": "items-start justify-start pt-20 pl-8",
    "bottom-right": "items-end justify-end pb-8 pr-8",
    "bottom-left": "items-end justify-start pb-8 pl-8",
    right: "items-center justify-end pr-0",
    left: "items-center justify-start pl-0",
  }

  // Backdrop blur classes
  const backdropBlurClasses = {
    none: "",
    sm: "backdrop-blur-sm",
    md: "backdrop-blur-md",
    lg: "backdrop-blur-lg",
  }

  // Column gap classes
  const columnGapClasses = {
    sm: "gap-4",
    md: "gap-6",
    lg: "gap-8",
    xl: "gap-10",
  }

  // Animation classes
  const animationClasses = {
    fade: "animate-fadeIn",
    slide: placement.includes("right") ? "animate-slideInRight" : 
           placement.includes("left") ? "animate-slideInLeft" : 
           placement.includes("top") ? "animate-slideInTop" : 
           placement.includes("bottom") ? "animate-slideInBottom" : "animate-fadeIn",
    zoom: "animate-zoomIn",
    flip: "animate-flipIn",
  }

  // Type icons and colors
  const typeConfig = {
    default: { icon: null, headerBg: "bg-white", iconBg: "bg-indigo-600", iconColor: "text-white" },
    info: { icon: Info, headerBg: "bg-blue-50", iconBg: "bg-blue-600", iconColor: "text-white" },
    success: { icon: CheckCircle, headerBg: "bg-green-50", iconBg: "bg-green-600", iconColor: "text-white" },
    warning: { icon: AlertTriangle, headerBg: "bg-yellow-50", iconBg: "bg-yellow-600", iconColor: "text-white" },
    error: { icon: AlertCircle, headerBg: "bg-red-50", iconBg: "bg-red-600", iconColor: "text-white" },
  }

  const TypeIcon = headerIcon || typeConfig[type].icon

  // Variant-specific styles
  const variantStyles = {
    default: {
      container: "rounded-2xl shadow-2xl",
      header: `px-6 py-2 border-b border-gray-200`,
      content: "p-6",
      footer: "px-6 py-4 border-t border-gray-200 bg-gray-50",
    },
    form: {
      container: "rounded-2xl shadow-2xl",
      header: `px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-white`,
      content: "px-8 py-6",
      footer: "px-8 py-5 border-t border-gray-200 bg-gray-50",
    },
    crud: {
      container: "rounded-2xl shadow-2xl",
      header: `px-8 py-6 border-b border-gray-200 ${typeConfig[type].headerBg || 'bg-gradient-to-r from-indigo-50 to-white'}`,
      content: "px-8 py-6",
      footer: "px-8 py-5 border-t border-gray-200 bg-gray-50",
    },
    popup: {
      container: "rounded-xl shadow-xl",
      header: `px-5 py-4 border-b border-gray-200`,
      content: "p-5",
      footer: "px-5 py-3 border-t border-gray-200 bg-gray-50",
    },
    slide: {
      container: "rounded-none h-full",
      header: `px-6 py-5 border-b border-gray-200`,
      content: "p-6",
      footer: "px-6 py-4 border-t border-gray-200 bg-gray-50",
    },
    drawer: {
      container: "rounded-l-2xl h-full",
      header: `px-6 py-5 border-b border-gray-200`,
      content: "p-6",
      footer: "px-6 py-4 border-t border-gray-200 bg-gray-50",
    },
  }

  const styles = variantStyles[variant]

  // Drawer/Slide specific widths
  const isDrawerOrSlide = variant === "drawer" || variant === "slide"
  const drawerWidth = placement === "right" || placement === "left" ? "w-96" : sizeClasses[size]

  // Handle overlay click
  const handleOverlayClick = (e) => {
    if (closeOnOverlay && e.target === e.currentTarget) {
      onClose()
    }
  }

  // Scroll classes
  const contentScrollClass = scrollable && scrollBehavior === "inside" ? "max-h-[65vh] overflow-y-auto" : ""
  const outerScrollClass = scrollable && scrollBehavior === "outside" ? "max-h-[90vh] overflow-y-auto" : ""

  // Render content based on layout
  const renderContent = () => {
    if (twoColumn && leftColumn && rightColumn) {
      return (
        <div className={`grid grid-cols-2 ${columnGapClasses[columnGap]}`}>
          <div className={showSectionDividers ? "border-r border-gray-200 pr-6" : ""}>
            {leftColumn}
          </div>
          <div>
            {rightColumn}
          </div>
        </div>
      )
    }
    return children
  }

  return (
    <div className={`fixed inset-0 z-50 flex ${placementClasses[placement]} p-4`}>
      {/* Backdrop */}
      {backdrop && (
        <div
          className={`absolute inset-0 bg-black bg-opacity-60 ${backdropBlurClasses[backdropBlur]} transition-opacity`}
          onClick={handleOverlayClick}
        />
      )}

      {/* Modal Container */}
      <div
        className={`relative bg-white ${styles.container} ${
          isDrawerOrSlide ? drawerWidth : sizeClasses[size]
        } w-full ${animationClasses[animation]} ${outerScrollClass}`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between ${styles.header} rounded-t-2xl ${headerClassName}`}>
          <div className="flex items-center gap-3">
            {TypeIcon && (
              <div className={`w-10 h-10 ${typeConfig[type].iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <TypeIcon className={`w-5 h-5 ${typeConfig[type].iconColor}`} />
              </div>
            )}
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          </div>
          {showCloseButton && (
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700 flex-shrink-0"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className={`${styles.content} ${contentScrollClass} ${contentClassName}`}>
          {renderContent()}
        </div>

        {/* Footer */}
        {footer && (
          <div className={`${styles.footer} rounded-b-2xl ${footerClassName}`}>
            {footer}
          </div>
        )}
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }

        @keyframes slideInLeft {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }

        @keyframes slideInTop {
          from {
            transform: translateY(-100%);
          }
          to {
            transform: translateY(0);
          }
        }

        @keyframes slideInBottom {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }

        @keyframes zoomIn {
          from {
            opacity: 0;
            transform: scale(0.5);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes flipIn {
          from {
            opacity: 0;
            transform: rotateX(-90deg);
          }
          to {
            opacity: 1;
            transform: rotateX(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideInRight {
          animation: slideInRight 0.3s ease-out;
        }

        .animate-slideInLeft {
          animation: slideInLeft 0.3s ease-out;
        }

        .animate-slideInTop {
          animation: slideInTop 0.3s ease-out;
        }

        .animate-slideInBottom {
          animation: slideInBottom 0.3s ease-out;
        }

        .animate-zoomIn {
          animation: zoomIn 0.2s ease-out;
        }

        .animate-flipIn {
          animation: flipIn 0.3s ease-out;
        }

        /* Custom scrollbar styling */
        .${contentScrollClass}::-webkit-scrollbar {
          width: 8px;
        }

        .${contentScrollClass}::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        .${contentScrollClass}::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 10px;
        }

        .${contentScrollClass}::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
      `}</style>
    </div>
  )
}

// Convenience wrapper components for common use cases

export const FormModal = (props) => (
  <Modal variant="form" size="2xl" {...props} />
)

export const CrudModal = (props) => (
  <Modal variant="crud" size="4xl" scrollBehavior="inside" {...props} />
)

export const TwoColumnModal = ({ leftContent, rightContent, ...props }) => (
  <Modal 
    variant="form" 
    size="5xl" 
    scrollBehavior="inside"
    twoColumn={true}
    leftColumn={leftContent}
    rightColumn={rightContent}
    {...props} 
  />
)

export const PopupModal = (props) => (
  <Modal variant="popup" size="sm" animation="zoom" {...props} />
)

export const DrawerModal = (props) => (
  <Modal variant="drawer" placement="right" animation="slide" scrollBehavior="inside" {...props} />
)

export const ConfirmModal = ({ onConfirm, confirmText = "Confirm", cancelText = "Cancel", ...props }) => (
  <Modal
    variant="popup"
    size="md"
    type={props.type || "warning"}
    footer={
      <div className="flex gap-3 w-full">
        <button
          onClick={props.onClose}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          {cancelText}
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          {confirmText}
        </button>
      </div>
    }
    {...props}
  />
)

// Section component for organizing content in two-column layouts
export const ModalSection = ({ title, icon: Icon, iconColor = "text-indigo-600", children }) => (
  <div className="space-y-5">
    <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-4">
      {Icon && <Icon className={`w-4 h-4 ${iconColor}`} />}
      <span>{title}</span>
    </div>
    {children}
  </div>
)
// Collapsible Section Component
export const CollapsibleSection = ({ title, icon: Icon, children, defaultOpen = true, iconColor = "text-indigo-600" }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-gray-50 to-white hover:from-gray-100 hover:to-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon className={`w-5 h-5 ${iconColor}`} />}
          <span className="font-semibold text-gray-900">{title}</span>
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
      </button>
      
      {isOpen && (
        <div className="px-4 py-4 bg-white">
          {children}
        </div>
      )}
    </div>
  )
}

// Summary card component for displaying summaries in modals
export const ModalSummaryCard = ({ title, items, className = "" }) => (
  <div className={`p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 ${className}`}>
    {title && <h3 className="text-sm font-semibold text-gray-700 mb-3">{title}</h3>}
    <div className="space-y-2 text-sm">
      {items.map((item, index) => (
        <div 
          key={index} 
          className={`flex justify-between ${item.divider ? 'pt-2 border-t border-indigo-200' : ''}`}
        >
          <span className="text-gray-600">{item.label}</span>
          <span className={`font-semibold ${item.highlight ? 'text-indigo-600' : 'text-gray-900'}`}>
            {item.value}
          </span>
        </div>
      ))}
    </div>
  </div>
)