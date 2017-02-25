import React from 'react'

const styles = require('./styles.css')

export default class Header extends React.Component {
  render() {
    return <div className={styles.header}>
      <img src="https://img.clipartfest.com/7596ae5990d108d83502b26c6a2d5d3e_darkspyro-spyro-and-cool-beans-clipart_383-383.jpeg"/>
    </div>
  }
}
