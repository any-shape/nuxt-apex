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
    cy.get('#apex-manual .apex-fetcher').should('have.length', 9)
    cy.get('#apex-manual .apex-fetcher').each(($el) => {
      cy.wrap($el).find('.apex-fetcher-error').should('not.exist')
      cy.wrap($el).find('.apex-fetcher-status').should('have.text', 'Status: idle;')
      cy.wrap($el).find('.apex-fetcher-response').should('have.text', 'Response: ⏳')

      cy.wait(500)
      cy.wrap($el).find('.apex-fetcher-fetch').should('exist').click()
      cy.wait(500)

      cy.wrap($el).find('.apex-fetcher-error').should('not.exist')
      cy.wrap($el).find('.apex-fetcher-status').should('have.text', 'Status: success;')
      cy.wrap($el).find('.apex-fetcher-response').should('have.text', 'Response: ✅')
    })
  })
})
