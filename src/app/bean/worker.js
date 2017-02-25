const data = {
  idx: null,
  counters: []
}

const totalSum = () => data.counters.reduce((total, counter) => total + counter, 0)

const broadcast = () => {
  setTimeout(() => {
    self.postMessage({ type: 'broadcast', params: {
      idx: data.idx,
      counter: data.counters[data.idx]
    }})
    broadcast()
  }, 1000)
}

const postResults = () => self.postMessage({ type: 'results', params: { total: totalSum() }})

const actions = {
  initialize: ({ idx, total }) => {
    data.idx = idx
    for(let i = 0; i < total; i++) {
      data.counters.push(0)
    }
    // start broadcasting
    broadcast()
  },
  increment: () => {
    if (data.idx === null) throw new Error('Uninitialzed data')

    data.counters[data.idx]++
    postResults()
  },
  synchronize: ({ idx, counter }) => {
    // reject own counter
    if (idx === data.idx) return
    data.counters[idx] = counter
    postResults()
  }
}

self.onmessage = (msg) => {
  const { type, params } = msg.data

  // validate message data
  if (!type) throw new Error('Undefined action')
  if (!actions[type]) throw new Error('Unknown action')

  actions[type].call(null, params)
}
