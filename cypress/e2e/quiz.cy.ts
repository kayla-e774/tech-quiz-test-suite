import allQuestions from '../fixtures/questions.json'

describe('Quiz Cycle', () => {
  context('Quiz setup', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3001');
    });

    it ('should be available to visit homepage.', () => {
      cy.visit('http://localhost:3001');
    })
    
    it('should show a "Start Quiz" button.', () => {
      // check start button
      cy.get('.btn').should('be.visible').and('have.text', 'Start Quiz');
    })
  })

  context('User Answering', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3001');
      cy.intercept({
          method: 'GET',
          url: '/api/questions/random'
        },
        {
          fixture: 'questions.json',
          statusCode: 200
        }
      ).as('fixtureQuestions')
    });

    it('should allow the user to view and answer each question, display the correct results screen, and restart a new quiz', () => {
      // click start button
      cy.get('.btn').click();
      // return mock quiz of all questions
      cy.wait('@fixtureQuestions');

      // check content of question 1
      // check question text
      cy.get('h2').should('have.text', allQuestions[0].question).and('be.visible');

      // count answer divs
      cy.get('.mt-3').children().should('have.length', allQuestions[0].answers.length);

      // check visibility of each button
      cy.contains('.btn', '1').should('be.visible');
      cy.contains('.btn', '2').should('be.visible');
      cy.contains('.btn', '3').should('be.visible');

      // associate each numbered button with its visible answer
      cy.contains('.btn', '1').next()
        .should('have.text', allQuestions[0].answers[0].text).and('be.visible');

      cy.contains('.btn', '2').next()
        .should('have.text', allQuestions[0].answers[1].text).and('be.visible');

      cy.contains('.btn', '3').next()
        .should('have.text', allQuestions[0].answers[2].text).and('be.visible');

      // answer question 1 correctly
      cy.contains('.btn', '3').click();


      // check content of question 2
      // check question text
      cy.get('h2').should('have.text', allQuestions[1].question).and('be.visible');

      // count answer divs
      cy.get('.mt-3').children().should('have.length', allQuestions[1].answers.length);

      // check visibility of each button
      cy.contains('.btn', '1').should('be.visible');
      cy.contains('.btn', '2').should('be.visible');

      // associate each numbered button with its visible answer
      cy.contains('.btn', '1').next()
        .should('have.text', allQuestions[1].answers[0].text).and('be.visible');

      cy.contains('.btn', '2').next()
        .should('have.text', allQuestions[1].answers[1].text).and('be.visible');

      // answer question 2 incorrectly
      cy.contains('.btn', '1').click();


      // check content of question 3
      // check question text
      cy.get('h2').should('have.text', allQuestions[2].question).and('be.visible');

      // count answer divs
      cy.get('.mt-3').children().should('have.length', allQuestions[2].answers.length);

      // check visibility of each button
      cy.contains('.btn', '1').should('be.visible');
      cy.contains('.btn', '2').should('be.visible');
      cy.contains('.btn', '3').should('be.visible');
      cy.contains('.btn', '4').should('be.visible');

      // associate each numbered button with its visible answer
      cy.contains('.btn', '1').next()
        .should('have.text', allQuestions[2].answers[0].text).and('be.visible');

      cy.contains('.btn', '2').next()
        .should('have.text', allQuestions[2].answers[1].text).and('be.visible');

      cy.contains('.btn', '3').next()
        .should('have.text', allQuestions[2].answers[2].text).and('be.visible');

      cy.contains('.btn', '4').next()
        .should('have.text', allQuestions[2].answers[3].text).and('be.visible');

      // answer question 1 incorrectly
      cy.contains('.btn', '2').click();


      // check contents of completion screen
      // check completion text
      cy.get('h2').should('have.text', 'Quiz Completed').and('be.visible');

      // check score text
      cy.get('.alert').should('have.text', 'Your score: 1/3').and('be.visible');

      // check new quiz button
      cy.get('.btn').should('be.visible').and('have.text', 'Take New Quiz').and('be.visible');


      // click take new quiz button
      cy.get('.btn').click();
      // return mock quiz of one question
      cy.wait('@fixtureQuestions');
      
      // check question text
      cy.get('h2').should('have.text', allQuestions[0].question).and('be.visible');
    })
  })
})