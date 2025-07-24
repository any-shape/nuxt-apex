declare namespace Cypress {
  interface Chainable {
    waitForHydration(): Chainable<void>
  }
}
