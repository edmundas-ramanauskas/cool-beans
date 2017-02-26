import { getRandomIntInclusive } from '../../lib/random'

// broadcasting interval
const MIN = 1000, MAX = 5000

const data = {
  idx: null,
  counters: []
}

const totalSum = () => data.counters.reduce((total, counter) => total + counter, 0)

// inform other workers about own state
const broadcast = () => {
  const delay = getRandomIntInclusive(MIN, MAX)
  setTimeout(() => {
    self.postMessage({ type: 'broadcast', params: {
      idx: data.idx,
      count: data.counters[data.idx]
    }})
    broadcast()
  }, delay)
}

const postResults = () =>
  self.postMessage({
    type: 'results',
    params: {
      count: data.counters[data.idx],
      total: totalSum()
    }
  })

const actions = {
  initialize: ({ idx, total }) => {
    // can't initialize more than once
    if (data.idx !== null) throw new Error('Already initialized')
    // save bean id
    data.idx = idx
    // prefill all counters with 0
    for(let i = 0; i < total; i++) {
      data.counters.push(0)
    }
    // start broadcasting
    broadcast()
  },
  increment: () => {
    // need to be initialized first
    if (data.idx === null) throw new Error('Uninitialzed data')

    data.counters[data.idx]++
    postResults()
  },
  synchronize: ({ idx, count }) => {
    // reject own counter in case it's not rejected at higher level
    if (idx === data.idx) return
    // reject synchronization events without changes
    if (data.counters[idx] === count) return

    data.counters[idx] = count
    // inform UI about changes
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
