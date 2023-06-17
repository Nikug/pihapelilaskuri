import { Component, For } from 'solid-js'

const classes = `
  appearance-none
  bg-bg
  rounded
  accent-primary
  caret-primary
  h-8
  w-24
  px-2
  border
`

const numberButtonClasses = `
  w-12 h-8
  mx-2
  flex
  justify-center
  items-center
  rounded
  bg-bg
  hover:bg-bg-surface
  border-2
  !border-primary
  !hover:border-primary-dark
  cursor-pointer
  font-bold
  select-none
`

interface Props {
  value: number
  onChange: (value: number) => void
  buttons: number[]
}

export const NumberEditor: Component<Props> = (props) => {
  const handleChange = (event: InputEvent & { target: HTMLInputElement }) => {
    const parsedValue = parseInt(event.target.value)
    props.onChange(isNaN(parsedValue) ? props.value : parsedValue)
  }

  const handleButtonChange = (change: number) => {
    props.onChange(props.value + change)
  }

  const reverseButtons = () => [...props.buttons].reverse()

  return (
    <div class="flex items-center justify-center">
      <For each={reverseButtons()}>
        {(button) => (
          <div
            class={numberButtonClasses}
            onClick={() => handleButtonChange(-button)}
          >{`-${button}`}</div>
        )}
      </For>
      <input class={classes} type="number" value={props.value} onInput={handleChange} />
      <For each={props.buttons}>
        {(button) => (
          <div
            class={numberButtonClasses}
            onClick={() => handleButtonChange(button)}
          >{`+${button}`}</div>
        )}
      </For>
    </div>
  )
}