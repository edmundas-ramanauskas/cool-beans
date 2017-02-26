import React from 'react'
import classNames from 'classnames'

const BeanWorker = require('worker-loader!./worker.js')

const styles = require('./styles.css')

export default class Bean extends React.Component {
  static propTypes = {
    onBroadcast: React.PropTypes.func.isRequired,
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

  onMessage = ({ data }) => {
    switch(data.type) {
      case 'results':
        // reflect worker state changes in UI
        this.updateState(data.params)
        break
      case 'broadcast':
        // broadcast message to all beans
        this.props.onBroadcast(data.params)
        break
    }
  }
  onKeyDown = (event) => {
    if (event.key === this.props.code) {
      this.increment()
    }
  }
  update({ idx, count }) {
    // ignore message from itself
    if (idx === this.props.idx) return
    this.worker.postMessage({
      type: 'synchronize',
      params: { idx, count }
    })
  }

  componentDidMount() {
    // listen for messages from worker
    this.worker.addEventListener('message', this.onMessage)
    this.worker.postMessage({ type: 'initialize', params: {
      idx: this.props.idx,
      total: this.props.total
    }})
    window.addEventListener('keydown', this.onKeyDown)
  }
  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeyDown)
  }
  render() {
    const className = classNames(styles.bean, this.props.className)
    return <button className={className} onClick={this.increment}>
      <span>{this.state.count} | {this.state.total}</span>
    </button>
  }
}
