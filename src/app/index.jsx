import React from 'react'

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
  onBroadcast = (data) => {
    beans.forEach((bean, i) => {
      this.refs[`bean${i}`].update(data)
    })
  }
  renderBeans = () => {
    return beans.map((bean, i) =>
      <Bean ref={`bean${i}`} key={i}
        onBroadcast={this.onBroadcast}
        className={styles[`bean${i+1}`]}
        total={beans.length} idx={i} code={bean.code} />)
  }
  renderLinks = () => {
    return beans.map((bean, i) =>
      <Link key={i} className={styles[`link${i+1}`]} />)
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
