import 'cypress-wait-until'

Cypress.Commands.add('waitForHydration', () => {
  //@ts-expect-error useNuxtApp not typed for window instance
  cy.waitUntil(() => cy.window().then((win) => win.useNuxtApp().isHydrating === false))
})
