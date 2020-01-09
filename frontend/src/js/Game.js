export default class Game {
  constructor() {
    this.state = {
      players: {},
      fruits: {},
      screen: {
        width: 10,
        height: 10
      }
    };

    this.observers = [];
  }

  setState(newState) {
    Object.assign(state, newState);
  }
}
