export const themeConfig = {
  standard: {
    name: 'Standard',
    bg: 'bg-gradient-to-br from-[#1d2b64] via-[#41295a] to-[#f857a6]',
    panelBg: 'bg-black bg-opacity-20 backdrop-blur-lg',
    textPrimary: 'text-white',
    textSecondary: 'text-indigo-200',
    textAccent: 'text-pink-400',
    borderColor: 'border-white border-opacity-10',
    inputBg: 'bg-black bg-opacity-20',
    buttonPrimary: 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700',
    buttonSecondary: 'bg-black bg-opacity-20 border border-gray-500 hover:border-pink-400',
    buttonTertiary: 'bg-indigo-500 hover:bg-indigo-600',
    loaderColor: 'border-pink-400',
    headerGradient: 'bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400',
    accentBorderHover: 'hover:border-pink-400'
  },
  light: {
    name: 'Light',
    bg: 'bg-gray-100',
    panelBg: 'bg-white bg-opacity-80 backdrop-blur-lg',
    textPrimary: 'text-gray-800',
    textSecondary: 'text-gray-600',
    textAccent: 'text-blue-600',
    borderColor: 'border-gray-300',
    inputBg: 'bg-gray-200 bg-opacity-50',
    buttonPrimary: 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700',
    buttonSecondary: 'bg-white border border-gray-300 hover:border-blue-500',
    buttonTertiary: 'bg-purple-500 hover:bg-purple-600',
    loaderColor: 'border-blue-500',
    headerGradient: 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600',
    accentBorderHover: 'hover:border-blue-500'
  },
  dark: {
    name: 'Dark',
    bg: 'bg-gray-900',
    panelBg: 'bg-gray-800 bg-opacity-50 backdrop-blur-lg',
    textPrimary: 'text-gray-100',
    textSecondary: 'text-gray-400',
    textAccent: 'text-teal-400',
    borderColor: 'border-gray-700',
    inputBg: 'bg-gray-900 bg-opacity-70',
    buttonPrimary: 'bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700',
    buttonSecondary: 'bg-gray-800 border border-gray-600 hover:border-teal-400',
    buttonTertiary: 'bg-sky-500 hover:bg-sky-600',
    loaderColor: 'border-teal-400',
    headerGradient: 'bg-gradient-to-r from-teal-300 via-cyan-300 to-sky-400',
    accentBorderHover: 'hover:border-teal-400'
  },
};

export type ThemeName = keyof typeof themeConfig;
