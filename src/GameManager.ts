import { createStore, produce } from 'solid-js/store'
import { Game, Player, State } from './types'
import { nanoid } from 'nanoid'
import { putGameToStorage } from './localstorage'

export const newGame = (): Game => ({
  state: 'players',
  players: {},
  hasStarted: false,
})

export const newPlayer = (): Player => ({
  id: nanoid(),
  name: '',
  score: 0,
  misses: 0,
})

export const [game, setGame] = createStore<Game>(newGame())

export const getPlayers = () => Object.values(game.players)
export const isPlayersState = () => game.state === 'players'
export const isGameState = () => game.state === 'game'
export const gameHasStarted = () => game.hasStarted

export const addPlayer = (name: string) => {
  const player = newPlayer()
  player.name = name

  setGame(
    produce((current) => {
      current.players[player.id] = player
      return current
    })
  )
  putGameToStorage(game)
}

export const removePlayer = (id: string) => {
  setGame(
    produce((current) => {
      delete current.players[id]
      return current
    })
  )
  putGameToStorage(game)
}

export const randomizePlayerOrder = () => {
  setGame(
    produce((current) => {
      const playerList = Object.values(current.players)

      // Durstenfeld shuffle
      for (let i = playerList.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[playerList[i], playerList[j]] = [playerList[j], playerList[i]]
      }

      const orderedPlayers = playerList.reduce((players: Game['players'], player) => {
        players[player.id] = player
        return players
      }, {})
      current.players = orderedPlayers

      return current.players
    })
  )
  putGameToStorage(game)
}

export const setGameState = (state: State) => {
  setGame(
    produce((current) => {
      current.state = state
      return current
    })
  )
  putGameToStorage(game)
}

export const setPlayerName = (id: string, name: string) => {
  setGame(
    produce((current) => {
      current.players[id].name = name
      return current
    })
  )
  putGameToStorage(game)
}

export const setPlayerScore = (id: string, value: number) => {
  setGame(
    produce((current) => {
      current.players[id].score = value
      return current
    })
  )
  putGameToStorage(game)
}

export const setPlayerMisses = (id: string, value: number) => {
  setGame(
    produce((current) => {
      current.players[id].misses = value
      return current
    })
  )
  putGameToStorage(game)
}

export const startGame = () => {
  setGame(
    produce((current) => {
      current.hasStarted = true
      current.state = 'game'
    })
  )
  putGameToStorage(game)
}

export const endGame = () => {
  setGame(newGame())
  putGameToStorage(game)
}

export const resetScore = () => {
  setGame(
    produce((current) => {
      const players = Object.values(current.players)
      const resetPlayers = players.map((player) => ({ ...player, score: 0, misses: 0 }))
      resetPlayers.forEach((player) => (current.players[player.id] = player))
      return current
    })
  )
  putGameToStorage(game)
}
