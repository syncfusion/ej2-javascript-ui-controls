import {Fragment} from "./fragment"

export function findDiffStart(a: Fragment, b: Fragment, pos: number): number | null {
  for (let i = 0;; i++) {
    if (i == a.childCount || i == b.childCount)
      return a.childCount == b.childCount ? null : pos

    let childA = a.child(i), childB = b.child(i)
    if (childA == childB) { pos += childA.nodeSize; continue }

    if (!childA.sameMarkup(childB)) return pos

    if (childA.isText && childA.text != childB.text) {
      let tA = childA.text!, tB = childB.text!, j = 0
      for (; tA[j] == tB[j]; j++) pos++
      if (j && j < tA.length && j < tB.length && surrogateHigh(tA.charCodeAt(j - 1)) && surrogateLow(tA.charCodeAt(j))) pos--
      return pos
    }
    if (childA.content.size || childB.content.size) {
      let inner = findDiffStart(childA.content, childB.content, pos + 1)
      if (inner != null) return inner
    }
    pos += childA.nodeSize
  }
}

export function findDiffEnd(a: Fragment, b: Fragment, posA: number, posB: number): {a: number, b: number} | null {
  for (let iA = a.childCount, iB = b.childCount;;) {
    if (iA == 0 || iB == 0)
      return iA == iB ? null : {a: posA, b: posB}

    let childA = a.child(--iA), childB = b.child(--iB), size = childA.nodeSize
    if (childA == childB) {
      posA -= size; posB -= size
      continue
    }

    if (!childA.sameMarkup(childB)) return {a: posA, b: posB}

    if (childA.isText && childA.text != childB.text) {
      let tA = childA.text!, tB = childB.text!, iA = tA.length, iB = tB.length
      while (iA > 0 && iB > 0 && tA[iA - 1] == tB[iB - 1]) { iA--; iB--; posA--; posB-- }
      if (iA && iB && iA < tA.length && surrogateHigh(tA.charCodeAt(iA - 1)) && surrogateLow(tA.charCodeAt(iA))) {
        posA++; posB++
      }
      return {a: posA, b: posB}
    }
    if (childA.content.size || childB.content.size) {
      let inner = findDiffEnd(childA.content, childB.content, posA - 1, posB - 1)
      if (inner) return inner
    }
    posA -= size; posB -= size
  }
}

function surrogateLow(ch: number) { return ch >= 0xDC00 && ch < 0xE000 }
function surrogateHigh(ch: number) { return ch >= 0xD800 && ch < 0xDC00 }
