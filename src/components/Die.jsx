import React from 'react'
import PropTypes from 'prop-types'
import Svg from 'svg.js'

import { classNames } from "@leiops/helpers"

// TO DO - i'm certain it's possible to pass a variable radius in here to get these values, maybe enforce that it be a multiple of 40?
const arrangementLookup = [
  [],
  [
    { cx: "50%", cy: "50%" },
  ],
  [
    { cx: "35%", cy: "65%" },
    { cx: "65%", cy: "35%" },
  ],
  [
    { cx: "50%", cy: "50%" },
    { cx: "72.5%", cy: "27.5%" },
    { cx: "27.5%", cy: "72.5%" },
  ],
  [
    { cx: "27.5%", cy: "27.5%" },
    { cx: "72.5%", cy: "27.5%" },
    { cx: "27.5%", cy: "72.5%" },
    { cx: "72.5%", cy: "72.5%" },
  ],
  [
    { cx: "50%", cy: "50%" },
    { cx: "27.5%", cy: "27.5%" },
    { cx: "72.5%", cy: "27.5%" },
    { cx: "27.5%", cy: "72.5%" },
    { cx: "72.5%", cy: "72.5%" },
  ],
  [
    { cx: "27.5%", cy: "22.5%" },
    { cx: "72.5%", cy: "22.5%" },
    { cx: "27.5%", cy: "50%" },
    { cx: "72.5%", cy: "50%" },
    { cx: "27.5%", cy: "77.5%" },
    { cx: "72.5%", cy: "77.5%" },
  ],
]

const pipRadius = "10%"

class Die extends React.Component {

  animationTargetRef = React.createRef()

  componentDidMount() {

    const { 
      value, 
      lastValue,
      animationDuration,
      isRolling
    } = this.props

    const draw = Svg(this.animationTargetRef.current)

    const lastPips = arrangementLookup[lastValue]
    const pips = arrangementLookup[value]


    lastPips.forEach((attrs, idx) => {
      const pip = draw.circle()
      pip.attr({
        class: "pip",
        ...attrs,
        r: pipRadius,
      })
      pip.animate(animationDuration, "<>").radius(0)
    })

    pips.forEach((attrs, idx) => {
      const pip = draw.circle()
      pip.attr({
        class: "pip",
        ...attrs,
        r: 0,
      })
      pip.animate(animationDuration, "<>").radius(pipRadius)

    })
  }

  render() {
    const { 
      value, 
      lastValue,
      animationDuration,
      isRolling 
    } = this.props
    return (
        <div className={classNames(
          "die",
          isRolling && "--rolling",
          !value && "--empty",
        )}>
          <div className="__animation-target" ref={this.animationTargetRef} />
        </div>
    )
  }
}

// TO DO - maybe make these required, force interface to deliver 0 instead of undefined?
Die.defaultProps = {
  lastValue: 0,
  value: 0,
}

Die.propTypes = {
  lastValue: PropTypes.number,
  value: PropTypes.number,
  animationDuration: PropTypes.number.isRequired,
  isRolling: PropTypes.bool.isRequired,
}

export default Die