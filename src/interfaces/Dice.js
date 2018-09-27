import React from 'react'

import isDefined from 'utils/isDefined'
import rollDie from 'utils/rollDie'
import canDieExist from 'utils/canDieExist'

import Die from '../components/Die'

// TO DO - think about why this doesn't feel like normal dice. When you're playing with normal dice, the last value can have an impact on the next value, as can the way you throw.

const rotateDie = ({ current, direction }) => {
    /*
    TO DO - what is the absolute simplest way of expressing this configuration? Do that instead.
        2
    6 4 1 3
        5
    */

    // num [n e w s]
    const lookup = {
      1: [2, 3, 5, 4],
      2: [6, 3, 1, 4],
      3: [2, 6, 5, 1],
      4: [2, 1, 5, 6],
      5: [1, 3, 6, 4],
      6: [5, 4, 2, 3],
    }

    return lookup[current][direction]
}

const configKeys = [
  "diceCount",
  // TO DO - maybe I want to manually feed in dice with different numbers of sides
  "diceSides",
  "onUpdate",
  "animationDuration",
  // TO DO - it would be cool if the steps were randomly a few more or fewer
  "animationSteps",
]

const configValidators = {
  diceSides: diceSides => {
    if (!canDieExist(diceSides))
      throw new Error(`A regular die cannot exist with ${diceSides} sides.`)
  }
}

const defaultConfig = {
  animationSteps: 4,
  animationDuration: 300,
  // DEV - right now, everything after the roll direction logic is set up for a six sided die, this will need to be changed if this setting is going to be valuable
  diceSides: 6,
}

const getKey = ({ idx, value=0 }) => `${value}@${idx}`

// TO DO - come up with a better definition of roll direction, this is kind of silly, and doesn't represent a realistic die
const getRollDirection = (sides, currentValue, finalValue, animationSteps) => {

  // TO DO - don't randomly adjust, try other options and remove these breakers
  const breakAt = 20
  let attemptsCount = 0
  while (attemptsCount < breakAt)
  {
    const direction = (rollDie(4) - 1)
    let firstRoll = finalValue
    
    for (let i = animationSteps - 1; i > 0 ; i--)
      firstRoll = rotateDie({ current: firstRoll, direction })
      
    if (firstRoll !== currentValue)
      return direction

    attemptsCount++
  }

  return (rollDie(4) - 1)
}


// TO DO - this could extend an interface class, which might implement mapping config to constructor
export default class DiceInterface {

  constructor(config={}) {
    
    configKeys.forEach(key => {
      let value
      if (isDefined(config[key])) 
        value = config[key]
      else if (defaultConfig[key])
        value = defaultConfig[key]
      else
        throw new Error(`Improper configuration provided for ${key} property: ${config[key]}`)

      if (configValidators[key])
        configValidators[key](value)

      this[key] = value
    })

    this.isRolling = false
    this.dice = []

    for (let idx = 0; idx < this.diceCount; idx++)
      this.dice.push({
        isRolling: false,
        lastValue: undefined,
        value: undefined,
        key: getKey({ idx }),
        animationDuration: this.animationDuration,
      })
    
  }

  clear = () => {
    this.dice = this.dice.map(({ value }, idx) => ({
      isRolling: false,
      value: undefined,
      lastValue: value,
      animationDuration: this.animationDuration,
      key: getKey({ idx }),
    }))
    this.onUpdate(this.dice)

  }

  roll = () => {

    // DEV - it might be nice if this returned a promise telling the component to update state. I'm not sure how you handle x promise resolves in a row from the component, but it might be possible. 

    // TO DO - instead of ignoring calls while roll is active, replace the running call with the incoming one, this means starting a new animation cycle and cancelling the existing timeouts (might involve a reject or two)
    if (this.isRolling)
      return

    this.isRolling = true

    const finalRolls = []
    for (let i = 0; i < this.diceCount; i++)
    {
      const value = rollDie(this.diceSides)
      finalRolls.push({
        value,
        direction: getRollDirection(this.diceSides, this.dice[i].value, value, this.animationSteps),
      })
    }

    const animateStepRolls = []
    for (let i = this.animationSteps - 1; i > 0 ; i--)
      animateStepRolls.push(
        finalRolls.map(({ value, direction }) => this._countBackRoll({ 
          from: value, 
          direction, 
          by: i
        }))
      )

    const rolls = [ 
      ...animateStepRolls, 
      finalRolls.map(({ value }) => value)
    ]
    
    rolls
      .reduce((acc, roll, idx) => new Promise(resolve => {
        acc.then(() => {
          setTimeout(() => {
            this.dice = this.dice.map((die, jdx) => ({
              isRolling: idx < this.animationSteps - 1,
              value: roll[jdx],
              lastValue: die.value,
              animationDuration: this.animationDuration,
              key: getKey({ idx: jdx, value: roll[jdx] }),
            }))
            this.onUpdate(this.dice)
            resolve()
          }, idx === 0 ? 0 : this.animationDuration)
        })
      }), Promise.resolve())
      .then(() => {
        // console.log('done', finalRolls);
        this.isRolling = false
      })
  }

  getInitialState() {
    return this.dice
  }
  
  render() {
    return this.dice.map(({ key, ...props }) => <Die key={key} { ...props } />)
  }

  // PRIVATE

  _countBackRoll = ({ from, by, direction }) => {

    let result = from

    let counter = by
    while (counter > 0)
    {
      result = rotateDie({ current: result, direction })
      counter--
    }

    return result
  }

}