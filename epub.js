async function load() {
  const res = await fetch('toc.ncx')
  const text = await res.text()
  const parser = new DOMParser()
  const doc = parser.parseFromString(
    text, 'application/xml',
  )
  console.debug({ doc })

  let title = doc.querySelector('docTitle text')
  const navPoints = Array.from(
    doc.querySelectorAll('navPoint')
  ).map((point, idx) => ({
    id: point.id,
    order: point.getAttribute('playOrder'),
    label: point.querySelector('navLabel text').textContent,
    content: point.querySelector('content').getAttribute('src'),
  }))

  const ol = document.createElement('ol')
  navPoints.forEach((point, idx) => {
    const li = document.createElement('li')
    const a = {
      inner: document.createElement('a'),
      extern: document.createElement('a'),
    }
    a.inner.textContent = point.label
    a.inner.setAttribute('href', `#chapter-${idx + 1}`)
    a.extern.textContent = '🔗'
    a.extern.style.marginLeft = '0.5rem'
    a.extern.setAttribute('href', encodeURI(decodeURI(point.content)))
    li.appendChild(a.inner)
    li.appendChild(a.extern)
    ol.appendChild(li)
    document.body.append(ol)
  })
}

load()