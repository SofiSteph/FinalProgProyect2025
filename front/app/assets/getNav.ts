export function getDealerNav() {
  return []
}

export function getReaderNav() {
  return [
    { to: '/reader/books/all', label: 'Libros', ariaLabel: 'Libros' },
    { to: '/reader/deliveries/all', label: 'Entregas', ariaLabel: 'Entregas' },
    { to: '/reader/about', label: 'Acerca De Nosotros', ariaLabel: 'Acerca de' }
  ]
}

export function getTechnicianNav() {
  return [
    { to: '/technician/loans/all', label: 'Préstamos', ariaLabel: 'Préstamos' },
    { to: '/technician/books/all', label: 'Libros', ariaLabel: 'Libros' },
  ]
}
