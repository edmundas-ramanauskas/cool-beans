import React from 'react'
import classNames from 'classnames'

const styles = require('./styles.css')

export default class Link extends React.Component {
  static propTypes = {
    className: React.PropTypes.string,
    type: React.PropTypes.oneOf(['left', 'right']).isRequired
  }
  renderTriangle = () => {
    return this.props.type === 'left'
      ? <div className={styles.left}></div>
      : <div className={styles.right}></div>
  }
  render() {
    const className = classNames(styles.link, this.props.className)
    return <div className={className}>
      {this.renderTriangle()}
    </div>
  }
}
