import * as React from 'react';
import * as enzyme from 'enzyme';
import Hello from '../Hello';

it('renders the correct text when no exclamation level is given', () => {
  const hello = enzyme.shallow(<Hello name='Daniel' />);
  expect (hello.find(".greeting").text()).toEqual('Hello Daniel!');
});

it('renders the correct text with an explicit exclamation level of 1', () => {
  const hello = enzyme.shallow(<Hello name='Daniel' exclamationLevel={1}/>);
  expect (hello.find(".greeting").text()).toEqual('Hello Daniel!');
});

it('renders the correct text with an explicit exclamation level of 5', () => {
  const hello = enzyme.shallow(<Hello name='Daniel' exclamationLevel={5}/>);
  expect (hello.find(".greeting").text()).toEqual('Hello Daniel!!!!!');
});