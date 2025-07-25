import 'cypress-wait-until'

Cypress.Commands.add('waitForHydration', () => {
  cy.waitUntil(() => cy.document().then(doc => doc.documentElement.dataset.hydrated === 'true'))
})
