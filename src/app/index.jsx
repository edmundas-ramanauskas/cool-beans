import React from 'react'
import isEqual from 'lodash.isequal'
import classNames from 'classnames'

import Bean from './bean'
import Link from './link'
import Header from './header'

const styles = require('./styles.css')

const beans = [
  { code: '1' },
  { code: '2' },
  { code: '3' }
]

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      links: {
        '01': {},
        '02': {},
        '10': {},
        '12': {},
        '20': {},
        '21': {}
      }
    }
  }
  onBroadcast = (data) => {
    this.triggerLinks(data)
    setTimeout(() => {
      beans.forEach((bean, i) => {
        this.refs[`bean${i}`].update(data)
      })
    }, 500)
  }
  triggerLinks = ({ idx, count }) => {
    const links = beans.reduce((result, bean, i) => {
      if (!count) {
        // skip empty counters
        return result
      }
      if (i === idx) {
        // skip links to itself
        return result
      }
      const key = `${idx}${i}`
      const link = this.state.links[key]
      if (link && link.count && link.count === count) {
        // skip unchanged counters
        return result
      }
      return Object.assign({}, result, { [key]: {
        time: Date.now() + 1000,
        count
      }})
    }, {})
    const state = { links: Object.assign({}, this.state.links, links) }
    // avoid unnecessary re-renders
    if (!isEqual(state, this.state)) {
      this.setState(state)
      setTimeout(() => {
        this.setState(state)
      }, 1000)
    }
  }
  renderBeans = () => beans.map((bean, i) =>
    <Bean ref={`bean${i}`} key={i}
      onBroadcast={this.onBroadcast}
      className={styles[`bean${i+1}`]}
      total={beans.length} idx={i} code={bean.code} />
  )
  getLink = (key, show) => {
    const link1 = classNames(styles.link1, { [styles.show]: show })
    const link2 = classNames(styles.link2, { [styles.show]: show })
    const link3 = classNames(styles.link3, { [styles.show]: show })
    switch(key) {
      case '01':
        return <Link key={key} type="left" className={link1} />
      case '02':
        return <Link key={key} type="right" className={link2} />
      case '10':
        return <Link key={key} type="right" className={link1} />
      case '12':
        return <Link key={key} type="right" className={link3} />
      case '20':
        return <Link key={key} type="left" className={link2} />
      case '21':
        return <Link key={key} type="left" className={link3} />
      default:
        return null
    }
  }
  renderLinks = () => {
    const links = this.state.links
    const timestamp = Date.now()
    return Object.keys(links)
      .map(key => this.getLink(key, links[key].time && links[key].time > timestamp))
  }
  render() {
    return <div className={styles.wrapper}>
      <Header/>
      <div className={styles.container}>
        {this.renderBeans()}
        {this.renderLinks()}
      </div>
    </div>
  }
}
