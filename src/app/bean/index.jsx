import React from 'react'
import classNames from 'classnames'

const BeanWorker = require('worker-loader!./worker.js')

const styles = require('./styles.css')

export default class Bean extends React.Component {
  static propTypes = {
    className: React.PropTypes.string,
    ports: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
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
      default:
        break
    }
  }
  onKeyDown = (event) => {
    if (event.key === this.props.code) {
      this.increment()
    }
  }

  componentDidMount() {
    // listen for messages from worker
    this.worker.addEventListener('message', this.onMessage)
    this.worker.postMessage({ type: 'initialize', params: {
      idx: this.props.idx,
      total: this.props.total,
      ports: this.props.ports
    }}, this.props.ports)
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
