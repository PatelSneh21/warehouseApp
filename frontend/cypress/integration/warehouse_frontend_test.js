/// <reference types="cypress" />

describe('warehouse_tests', () => {
    beforeEach(() => {
      // Cypress starts out with a blank slate for each test
      // so we must tell it to visit our website with the `cy.visit()` command.
      // Since we want to visit the same URL at the start of all our tests,
      // we include it in our beforeEach function so that it runs before each test
      cy.visit('/')
    })

    describe('The Home Page', () => {
        it('successfully loads', () => {
          cy.visit('/')
        })
      })

      

      describe('username_test', () => {
        it('test the email field', () => {
          //cy.visit('https://example.cypress.io')
      

          cy.get('[id^=email]').click()

          cy.get('[id^=email]')
      .type('admin@admin.com')
      .should('have.value', 'admin@admin.com')

        })
      })

      describe('password_test', () => {
        it('test the password field', () => {
          //cy.visit('https://example.cypress.io')
      

          cy.get('[id^=password]').click()

          cy.get('[id^=password]')
      .type('admin123')
      .should('have.value', 'admin123')

        })
      })

      describe('incorrect_login_test', () => {
        it('inputs blank user info', () => {
          //cy.visit('https://example.cypress.io')
      

          cy.contains('LOGIN').click()
            cy.get('form').should('contain', "Incorrect username or pass")

        })
      })

      describe('test_successful_login', () => {
        it('test login with valid data', () => {
          //cy.visit('https://example.cypress.io')
      

          cy.get('[id^=email]').click()

          cy.get('[id^=email]')
      .type('admin@admin.com')
      .should('have.value', 'admin@admin.com')

      cy.get('[id^=password]').click()

      cy.get('[id^=password]')
  .type('admin123')
  .should('have.value', 'admin123')

  cy.contains('LOGIN').click()

        })
      })

    //   describe('visit_home_page', () => {
    //     it('tests home page', () => {
    //     //   cy.visit('/home')
      



    //     })
    //   })



    })