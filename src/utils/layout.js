export function getLineCount (width, fontSize, content) {
  if (!content) {
    return 1
  }
  let words = parseInt(width / fontSize)
  let count = parseInt(content.length / words)
  if ((content.length % words) !== 0) {
    count++
  }
  return count
}

export default {
  getLineCount
}
