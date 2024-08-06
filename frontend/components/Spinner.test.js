// Import the Spinner component into this file and test
import React from 'react'
import { render, waitFor, screen } from '@testing-library/react'
//import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import Spinner from './Spinner'



// that it renders what it should for the different props it can take.

describe('Spinner Component', () => {

// let user 
//   beforeEach(() => {
//     render(<Spinner />)
//     user = userEvent.setup()
//   })

  test('Spinner renders without error', () => {
    render (<Spinner on = {true}/>) 
  })

})


