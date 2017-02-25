import React from 'react'

import Bean from './bean'
import Header from './header'

const styles = require('./styles.css')

export default class App extends React.Component {
  render() {
    return <div className={styles.wrapper}>
      <Header/>
      <div className={styles.container}>
        <Bean total={3} idx={0} code="1" />
        <Bean total={3} idx={1} code="2" />
        <Bean total={3} idx={2} code="3" />
      </div>
    </div>
  }
}
