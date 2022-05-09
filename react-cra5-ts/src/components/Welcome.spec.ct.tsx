import Welcome from './Welcome';
import { mount } from '@cypress/react';

describe('Welcome', () => {
  it('should mount with greeting', () => {
    mount(
      <Welcome username="Test User" onLogout={cy.spy().as('onLogout')} />
    );
    cy.contains('Welcome Test User!');
  });

  it('when the log out button is clicked, onLogout should be called', () => {
    mount(
      <Welcome username="Test User" onLogout={cy.spy().as('onLogout')} />
    );
    cy.get('button').contains('Log Out').click();
    cy.get('@onLogout').should('have.been.called');
  });
});
