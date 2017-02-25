import React from 'react'

const BeanWorker = require('worker-loader!./worker.js')

const styles = require('./styles.css')

export default class Bean extends React.Component {
  static propTypes = {
    total: React.PropTypes.number.isRequired,
    code: React.PropTypes.string.isRequired,
    idx: React.PropTypes.number.isRequired
  }
  constructor(props) {
    super(props)
    this.state = {
      counter: 0
    }
    this.worker = new BeanWorker()
    this.worker.addEventListener('message', this.onMessage)
    this.worker.postMessage({ type: 'initialize', params: {
      idx: this.props.idx,
      total: this.props.total
    }})
  }
  onMessage = ({ data }) => {
    switch(data.type) {
      case 'results':
        this.setState({ counter: data.params.total })
        break
      case 'broadcast':
        window.postMessage(data, '*')
        break
    }
  }
  onKeyDown = (event) => {
    if (event.key === this.props.code) {
      this.increment()
    }
  }
  increment() {
    this.worker.postMessage({ type: 'increment' })
  }
  componentDidMount() {
    window.addEventListener('keydown', this.onKeyDown)
    window.addEventListener('message', ({ data }) => {
      if (data.type === 'broadcast') {
        if (data.params && data.params.idx !== this.props.idx) {
          this.worker.postMessage({
            type: 'synchronize',
            params: data.params
          })
        }
      }
    })
  }
  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeyDown)
  }
  render() {
    return <button className={styles.bean} onClick={() => this.increment()}>
      <span>{this.state.counter}</span>
    </button>
  }
}
