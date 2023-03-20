import Button from './CyButton.vue';
import { worker } from '../mocks';

describe('Button', () => {

  before(() => {
    return worker.start({
      onUnhandledRequest: 'bypass',
    });
  })

  it.only('when button is clicked, should call onClick', () => {
    cy.mount(Button, {
      slots: {
        default: () => 'Click Me',
      },
    });
    cy.get('button').contains('Click Me').click();
  });
});
