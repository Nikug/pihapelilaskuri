import { Component, createSignal, useContext } from 'solid-js'
import { Player } from '../types'
import { removePlayer, setPlayerName } from '../GameManager'
import { TextButton } from './TextButton'
import { ModalContext } from './ModalContext'
import { TextInput } from './TextInput'

interface Props {
  player: Player
}

export const NewPlayer: Component<Props> = (props) => {
  const [, { createModal }] = useContext(ModalContext)
  const [name, setName] = createSignal<string>('')

  const handleNameEdit = () => {
    setName(props.player.name)
    createModal({
      title: 'Muokkaa pelaajaa',
      content: () => (
        <div>
          <label class="block">Pelaajan nimi:</label>
          <TextInput autoFocus value={name()} onInput={(event) => setName(event.target.value)} />
        </div>
      ),
      onOk: () => setPlayerName(props.player.id, name()),
    })
  }

  return (
    <div class="p-4 flex justify-between items-center">
      <div
        class="font-bold min-w-0 text-xl flex items-center cursor-pointer"
        onClick={handleNameEdit}
      >
        <p class="break-words min-w-0 mr-2">{props.player.name}</p>
        <div class="i-tabler-edit w-5 h-5 flex-shrink-0" />
      </div>
      <TextButton danger text="Poista" onClick={() => removePlayer(props.player.id)} />
    </div>
  )
}
