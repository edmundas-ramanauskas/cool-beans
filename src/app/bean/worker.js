import { getRandomIntInclusive } from '../../lib/random'

// broadcasting interval
const MIN = 1000, MAX = 5000

const data = {
  idx: null,
  ports: [],
  counters: []
}

const totalSum = () => data.counters.reduce((total, counter) => total + counter, 0)

// inform other workers about own state
const broadcast = () => {
  const delay = getRandomIntInclusive(MIN, MAX)
  setTimeout(() => {
    data.ports.forEach(port =>
      port.postMessage({ type: 'synchronize', params: {
        idx: data.idx,
        count: data.counters[data.idx]
      }})
    )
    broadcast()
  }, delay)
}

const listen = () => {
  if (!data.ports.length) throw new Error('No communication ports')

  data.ports.forEach(port => {
    // we accept all types of messages from workes
    port.onmessage = messageHandler
  })
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
  initialize: ({ idx, total, ports }) => {
    // can't initialize more than once
    if (data.idx !== null) throw new Error('Already initialized')
    // save bean id
    data.idx = idx
    // save ports
    data.ports = ports || []
    // prefill all counters with 0
    for(let i = 0; i < total; i++) {
      data.counters.push(0)
    }
    // start listening for messages from other workers
    listen()
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

const messageHandler = (msg) => {
  const { type, params } = msg.data

  // validate message data
  if (!type) throw new Error('Undefined action')
  if (!actions[type]) throw new Error('Unknown action')

  actions[type].call(null, params)
}

self.onmessage = messageHandler
