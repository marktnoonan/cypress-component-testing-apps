import HappyButton from './HappyButtonSolution';

describe('HappyButton', () => {
  it('should mount', () => {
    cy.mount(<HappyButton text="Click Me" />);

    cy.get('button').contains('Click Me 😀');
  });

});
