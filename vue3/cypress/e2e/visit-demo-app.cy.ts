describe('template spec', () => {
    it('passes', () => {
      cy.visit('/')
    })
    it('stubs the network', () => {
        cy.fixture('luke-skywalker').then(luke => {
            cy.intercept('https://swapi.dev/api/people/1/', luke)
        })
        cy.intercept("POST", "/auth", {
          statusCode: 200,
          body: {
            message: "Authenticated",
          },
        });
        cy.visit('/')
        cy.contains('Username').find('input').type('testuser');
        cy.contains('Password').find('input').type('testpassword');
        cy.get('button').contains('Login').as('loginButton').click();
        cy.contains('Luke')
    })
  })