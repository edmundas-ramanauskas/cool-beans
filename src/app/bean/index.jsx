import React from 'react'
import classNames from 'classnames'

const BeanWorker = require('worker-loader!./worker.js')

const styles = require('./styles.css')

export default class Bean extends React.Component {
  static propTypes = {
    className: React.PropTypes.string,
    total: React.PropTypes.number.isRequired,
    code: React.PropTypes.string.isRequired,
    idx: React.PropTypes.number.isRequired
  }
  constructor(props) {
    super(props)
    this.state = {
      count: 0,
      total: 0
    }
    this.worker = new BeanWorker()
  }

  updateState = ({ count, total }) => this.setState({ count, total })
  increment = () => this.worker.postMessage({ type: 'increment' })

  onWorkerMessage = ({ data }) => {
    switch(data.type) {
      case 'results':
        // reflect worker state changes in UI
        this.updateState(data.params)
        break
      case 'broadcast':
        // broadcast message to all beans
        window.postMessage(data, '*')
        break
    }
  }
  onKeyDown = (event) => {
    if (event.key === this.props.code) {
      this.increment()
    }
  }
  onMessage = ({ data }) => {
    // listen for broadcast messages from other beans
    if (data.type === 'broadcast' && data.params) {
      // ignore message from itself
      if (data.params.idx === this.props.idx) return
      // inform worker about received data
      this.worker.postMessage({
        type: 'synchronize',
        params: data.params
      })
    }
  }

  componentDidMount() {
    // listen for messages from worker
    this.worker.addEventListener('message', this.onWorkerMessage)
    this.worker.postMessage({ type: 'initialize', params: {
      idx: this.props.idx,
      total: this.props.total
    }})
    window.addEventListener('keydown', this.onKeyDown)
    // listen for messages from other beans
    window.addEventListener('message', this.onMessage)
  }
  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeyDown)
    window.removeEventListener('message', this.onMessage)
  }
  render() {
    const className = classNames(styles.bean, this.props.className)
    return <button className={className} onClick={this.increment}>
      <span>{this.state.count} | {this.state.total}</span>
    </button>
  }
}
