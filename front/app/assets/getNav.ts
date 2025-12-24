export function getEmptyNav() {
  return []
}

export function getDefaultNav() {
  return [
    { to: '/reader/books/all', label: 'Libros', ariaLabel: 'Libros' },
    { to: '/reader/deliveries/all', label: 'Entregas', ariaLabel: 'Entregas' },
    { to: '/reader/about', label: 'Acerca De Nosotros', ariaLabel: 'Acerca de' }
  ]
}
