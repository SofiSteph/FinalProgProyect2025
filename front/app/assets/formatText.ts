export function formatText(text: string | undefined): string {
  if (text && text.includes(';')) {
    return text.replace(/;/g, '<br>')
  }
  if (text && text.includes(';;')) {
    return text.replace(/;;/g, '<br><br>')
  }
  return text || ''
}
