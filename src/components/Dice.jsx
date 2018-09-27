import React from 'react'

import Die from 'components/Die'
import DiceInterface from 'interfaces/Dice'

class Dice extends React.Component {

  diceInterface = new DiceInterface({
    animationDuration: 275,
    onUpdate: dice => { this.setState(() => ({ dice }))},
    diceCount: 2,
  })

  state = {
    dice: this.diceInterface.getInitialState()
  }

  render() {
    return (
      <div 
        className="dice" 
      > 
        <div 
          onClick={this.diceInterface.roll}
        >
          {this.diceInterface.render()}
          {/* {this.state.dice.map(({ key, ...props }) => 
            <Die key={key} { ...props } />
          )} */}
        </div>
        <button onClick={this.diceInterface.clear}>Clear</button>
      </div>
    )
  }
}

export default Dice