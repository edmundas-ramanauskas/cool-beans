import React from 'react'
import classNames from 'classnames'

const styles = require('./styles.css')

export default class Link extends React.Component {
  static propTypes = {
    className: React.PropTypes.string
  }
  render() {
    const className = classNames(styles.link, this.props.className)
    return <div className={className}></div>
  }
}
