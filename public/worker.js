let ticker

onmessage = (e) => {
  if (e.data === 'start') {
    ticker = setInterval(() => {
      postMessage('tick')
    }, 1000)
  }

  if (e.data === 'stop') {
    clearInterval(ticker)
  }
}
