import Button from './Button';
import { mount } from '@cypress/react'

describe('Button', () => {
  it('should mount', () => {
    mount(<Button>Click Me</Button>);
    cy.get('button').contains('Click Me');
  });

});
