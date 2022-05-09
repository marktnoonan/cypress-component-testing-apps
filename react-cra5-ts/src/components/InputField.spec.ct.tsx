import InputField from './InputField';
import { mount } from '@cypress/react';

describe('InputField', () => {
  it('should mount with label', () => {
    mount(
      <InputField
        name="name"
        label="Name"
        requiredMessage="Name is required"
        submitted={false}
      />
    );
    cy.get('label').contains('Name');
  });

  it('when there is no value and form is submitted, should show a required message', () => {
    mount(
      <InputField
        name="name"
        label="Name"
        value={''}
        requiredMessage="Name is required"
        submitted={true}
        onChange={cy.spy()}
      />
    );
    cy.contains('Name is required');
  });

});
