
# @scriptless/dice

<img src="https://siteless.co/assets/image/5710239819104256" width="600" />

[![npm](https://img.shields.io/npm/dt/@scriptless/dice.svg?style=flat-square)](https://www.npmjs.com/package/@scriptless/dice)
[![npm](https://img.shields.io/npm/v/@scriptless/dice.svg?style=flat-square)](https://www.npmjs.com/package/@scriptless/dice)

A representational, declarative dice component system for React apps.

<img src="https://siteless.co/assets/image/5631986051842048" width="325" />

## Quick Start

This library provides two exports: `DiceInterface` and `Die`.

`Die` is a simple, stateless component which renders given values. Don't worry about that now. All you need to know is that it gets the `--rolling` class when it's rolling, and you can target the whole component with `.die` and the pips with `.__pip`.

`DiceInterface` takes care of rolling, animating, and rendering your dice. It's extremely configurable, but to get started, this is all you need:

```jsx

class DiceContainer extends React.Component {

  diceInterface = new DiceInterface({
    onUpdate: dice => { this.setState(() => ({ dice }))},
    diceCount: 2,
  })

  state = {
    dice: diceInterface.getInitialState()
  }

  render() {
    return (
      <div 
        className="dice-container" 
        onClick={this.diceInterface.roll}
      >
          {this.diceInterface.render()}
      </div>
    )
  }
}

```

## To Do

* Switching to percentage-based positioning in the die svg has slowed things down, it might make sense to provide a prop for setting height and width. Ideally the svg would be friendly to css resizing (which we can do with @leiops/icon, so I think it is).