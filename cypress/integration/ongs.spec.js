/// <reference types="cypress" />

describe('Ongs', () => {
  it('Deve realizar cadastros', () => {
    cy.visit('http://localhost:3000/register')
    cy.get('[data-cy=name]').type('Dogs queridos')
    cy.get('[data-cy=email]').type('dogs@email.com')
    cy.get('[data-cy=whatsapp]').type('11956092628')
    cy.get('[data-cy=city]').type('São Paulo')
    cy.get('[data-cy=uf]').type('SP')
    
    cy.route('POST', '**/ongs').as('postOng')
    
    cy.get('[data-cy=submit]').click()

    cy.wait('@postOng').then((xhr) => {
      expect(xhr.status).be.eq(200)
      expect(xhr.response.body).has.property('id')
      expect(xhr.response.body.id).is.not.null
    })
  })

  it('Deve realizar login no sistema', () => {
    cy.visit('http://localhost:3000/')
    cy.get('[data-cy=id]').type(Cypress.env('createdOngId'))
    cy.get('[data-cy=button-login]').click()
  })

  it('Deve conseguir fazer logout', () => {
    cy.login()
    cy.get('[data-cy=button-logout]').click()
  })

  it('Deve conseguir cadastrar novos casos', () => {
    cy.login()

    cy.get('[data-cy=button-new-incident]').click()

    cy.get('[data-cy=title]').type('Animal perdido')
    cy.get('[data-cy=description]').type('Animal perdido, preparado para ser encontrado')
    cy.get('[data-cy=value]').type(100)

    cy.route('POST', '**/incidents').as('newIncident')

    cy.get('[data-cy=button-save]').click()

    cy.wait('@newIncident').then((xhr) => {
      expect(xhr.status).to.eq(200)
      expect(xhr.response.body).has.property('id')
      expect(xhr.response.body.id).is.not.null
    })
  })

  it('Deve conseguir excluir um caso', () => {
    cy.createNewIncident()
    cy.login()

    cy.route('DELETE', '**/incidents/*').as('deleteIncident')

    cy.get('[data-cy=button-delete]').click()

    cy.wait('@deleteIncident').then((xhr) => {
      expect(xhr.status).to.eq(204)
      expect(xhr.response.body).to.be.empty
    })
  })
})