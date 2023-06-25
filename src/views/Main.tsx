import { Component, Show, createSignal, useContext } from 'solid-js'
import { Players } from '../components/Players'
import { Button } from '../components/Button'
import { ModalContext } from '../components/ModalContext'
import {
  addPlayer,
  endGame,
  gameHasStarted,
  isGameState,
  isPlayersState,
  randomizePlayerOrder,
  resetScore,
  setGameState,
  startGame,
} from '../GameManager'
import { TextInput } from '../components/TextInput'
import { TextButton } from '../components/TextButton'

const barClasses = `
  absolute
  left-0
  right-0
  w-full
  px-4
  h-16
  bg-bg
  flex
  justify-between
  items-center
  shadow
  z-10
  bg-bg-surface
`

export const Main: Component = () => {
  const [, { createModal }] = useContext(ModalContext)
  const [name, setName] = createSignal<string>('')

  const createNewPlayer = () => {
    if (!name()) return true

    addPlayer(name())
    setName('')
  }

  const handleNewPlayer = () => {
    createModal({
      title: 'Lisää pelaaja',
      content: () => (
        <div>
          <label class="block">Pelaajan nimi:</label>
          <TextInput autoFocus value={name()} onInput={(event) => setName(event.target.value)} />
        </div>
      ),
      onOk: () => createNewPlayer(),
    })
  }

  const handleGameOptions = () => {
    createModal({
      title: 'Toiminnot',
      hideOk: true,
      content: (closeModal) => (
        <div class="flex flex-col justify-center items-center gap-8 pb-16 px-8">
          <Button
            class="w-full"
            text="Muokkaa pelaajia"
            onClick={() => {
              setGameState('players')
              closeModal()
            }}
          />
          <TextButton
            danger
            border
            class="w-full"
            text="Nollaa pisteet"
            onClick={() => {
              closeModal()
              createModal({
                title: 'Haluatko varmasti nollata pelaajien pisteet?',
                okText: 'Nollaa',
                content: () => <div />,
                onOk: () => {
                  resetScore()
                  closeModal()
                },
              })
            }}
          />
          <TextButton
            danger
            border
            class="w-full"
            text="Päätä peli"
            onClick={() => {
              closeModal()
              createModal({
                title: 'Haluatko varmasti päättää pelin? Tämä poistaa kaikki pelaajat pelistä.',
                okText: 'Päätä',
                content: () => <div />,
                onOk: () => {
                  endGame()
                  closeModal()
                },
              })
            }}
          />
        </div>
      ),
      onOk: () => createNewPlayer(),
    })
  }

  return (
    <div class="max-w-3xl h-full mx-auto relative border-x">
      <div class={`${barClasses} top-0 border-b`}>
        <h2 class="font-bold text-2xl py-4 text-center">
          {isPlayersState() ? 'Pelaajat' : 'Peli'}
        </h2>
        <Show when={isPlayersState()}>
          <Button
            text={gameHasStarted() ? 'Jatka peliä' : 'Aloita'}
            onClick={() => (gameHasStarted() ? setGameState('game') : startGame())}
          />
        </Show>
        <Show when={isGameState()}>
          <TextButton text={<div class="i-tabler-dots text-3xl" />} onClick={handleGameOptions} />
        </Show>
      </div>
      <div class="h-screen w-full overflow-auto py-18">
        <Players />
      </div>
      <Show when={isPlayersState()}>
        <div class={`${barClasses} bottom-0 border-t`}>
          <Button text="Sekoita pelaajat" onClick={() => randomizePlayerOrder()} />
          <Button text="Lisää pelaaja" onClick={() => handleNewPlayer()} />
        </div>
      </Show>
    </div>
  )
}
