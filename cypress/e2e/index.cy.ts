describe('api composables called in auto and manually', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/')
  })

  it('testing composables in auto mode', () => {
    cy.get('#apex-auto .apex-fetcher').should('have.length', 9)
    cy.get('#apex-auto .apex-fetcher').each(($el) => {
      cy.wrap($el).find('.apex-fetcher-error').should('not.exist')
      cy.wrap($el).find('.apex-fetcher-status').should('have.text', 'Status: success;')
      cy.wrap($el).find('.apex-fetcher-response').should('have.text', 'Response: ✅')
    })
  })

  it('testing composables in manual mode', () => {
    cy.intercept('**/api/**').as('manualFetch')

    cy.get('#apex-manual .apex-fetcher').should('have.length', 9).each(($el) => {
      cy.wait(1200)

      return cy.wrap($el).within(() => {
        cy.get('.apex-fetcher-error').should('not.exist')
        cy.get('.apex-fetcher-status').should('have.text', 'Status: idle;')
        cy.get('.apex-fetcher-response').should('have.text', 'Response: ⏳')

        cy.get('.apex-fetcher-fetch').should('be.visible').scrollIntoView().click({ force: true })
        cy.wait('@manualFetch')

        cy.get('.apex-fetcher-error').should('not.exist')
        cy.get('.apex-fetcher-status').should('have.text', 'Status: success;')
        cy.get('.apex-fetcher-response').should('have.text', 'Response: ✅')
    })})
  })
})
