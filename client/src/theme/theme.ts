export function initTheme() {
  const saved = localStorage.getItem('theme')
  if (saved === 'dark') {
    document.documentElement.classList.add('dark')
  }
}

export function toggleTheme() {
  const html = document.documentElement
  html.classList.toggle('dark')
  localStorage.setItem(
    'theme',
    html.classList.contains('dark') ? 'dark' : 'light'
  )
}

export function isDark() {
  return document.documentElement.classList.contains('dark')
}
