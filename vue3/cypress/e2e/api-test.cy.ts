describe('template spec', () => {
    it('passes', () => {
        cy.api('https://swapi.dev/api/people/1/').then(result => {
            console.log(result)

            // Option 1 - wrap the result object to use Cy to read properties 
            // cy.wrap(result)
            //     .its('body.name')
            //     .should('eq', 'Luke Skywalker')
            
            // // Option 2 - directly assert about specific properties
            // expect(result.body.films).to.have.length(4)

            // Option 3 - reference a fixture - look in /fixtures folder for a file named luke-skywalker.[ext]
            cy.fixture('luke-skywalker').as('lukeSkywalker')
            const person = result.body

            cy.get('@lukeSkywalker').should('deep.equal', person)
        })
    })
})