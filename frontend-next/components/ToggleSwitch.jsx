'use client'

const ToggleSwitch = ({ isEnabled, onToggle, label }) => (
  <div className="flex items-center justify-between">
    <span className="text-xs text-neutral-400 dark:text-neutral-400">{label}</span>
    <button
      onClick={onToggle}
      role="switch"
      aria-checked={isEnabled}
      className={`relative inline-flex items-center h-5 rounded-full w-9 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 ${
        isEnabled ? 'bg-violet-600' : 'bg-neutral-300 dark:bg-neutral-700'
      }`}
    >
      <span
        className={`inline-block w-3.5 h-3.5 transform bg-white rounded-full shadow transition-transform duration-200 ${
          isEnabled ? 'translate-x-[18px]' : 'translate-x-[2px]'
        }`}
      />
    </button>
  </div>
)

export default ToggleSwitch
