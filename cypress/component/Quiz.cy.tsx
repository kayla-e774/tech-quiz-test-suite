import React from 'react'
import Quiz from '../../client/src/components/Quiz.js'

const mockQuestion = [
  {
    _id: "1q",
    question: "Test Question",
    answers: [
      {
        text: "wrong 1",
        isCorrect: false,
        _id: "1a"
      },
      {
        text: "wrong 2",
        isCorrect: false,
        _id: "2a"
      },
      {
        text: "right 3",
        isCorrect: true,
        _id: "3a"
      },
    ]
  }
]

describe('<Quiz />', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/questions/random', (req) => {
      req.reply({
        statusCode: 200,
        body: mockQuestion
      });
    }).as('getRandomQuestion');
  });

  it('should mount.', () => {
    cy.mount(<Quiz/>);
  });

  it('should initially display the start button.', () => {
    cy.mount(<Quiz/>);
    // check start button
    cy.get('.btn').should('be.visible').and('have.text', 'Start Quiz');
  });

  it('should show the question and each answer with its button once the quiz is started.', () => {
    cy.mount(<Quiz/>);
    // click start button
    cy.get('.btn').click();
    // return mock of one question
    cy.wait('@getRandomQuestion');

    // check question text
    cy.get('h2').should('have.text', mockQuestion[0].question).and('be.visible');

    // count answer divs
    cy.get('.mt-3').children().should('have.length', mockQuestion[0].answers.length);

    // check visibility of each button
    cy.contains('.btn', '1').should('be.visible');
    cy.contains('.btn', '2').should('be.visible');
    cy.contains('.btn', '3').should('be.visible');

    // associate each numbered button with its visible answer
    cy.contains('.btn', '1').next()
      .should('have.text', mockQuestion[0].answers[0].text).and('be.visible');

    cy.contains('.btn', '2').next()
      .should('have.text', mockQuestion[0].answers[1].text).and('be.visible');

    cy.contains('.btn', '3').next()
      .should('have.text', mockQuestion[0].answers[2].text).and('be.visible');
  });

  it('should show the completed screen with a score and a button to take a new quiz after finishing.', () => {
    cy.mount(<Quiz/>);
    // click start button
    cy.get('.btn').click();
    // return mock quiz of one question
    cy.wait('@getRandomQuestion');
    // click the correct answer
    cy.contains('.btn', '3').click();

    // check completion text
    cy.get('h2').should('have.text', 'Quiz Completed').and('be.visible');

    // check score text
    cy.get('.alert').should('have.text', 'Your score: 1/1').and('be.visible');

    // check new quiz button
    cy.get('.btn').should('be.visible').and('have.text', 'Take New Quiz').and('be.visible');
  });

  it('should show a different score with a wrong answer on the completed screen.', () => {
    cy.mount(<Quiz/>);
    // click start button
    cy.get('.btn').click();
    // return mock quiz of one question
    cy.wait('@getRandomQuestion');
    // click the incorrect answer
    cy.contains('.btn', '2').click();

    // check score text
    cy.get('.alert').should('have.text', 'Your score: 0/1').and('be.visible');
  });

  it('should show a quiz question after selecting Take New Quiz.', () => {
    cy.mount(<Quiz/>);
    // click start button
    cy.get('.btn').click();
    // return mock quiz of one question
    cy.wait('@getRandomQuestion');
    // click the incorrect answer
    cy.contains('.btn', '2').click();
    // click the Take New Quiz button
    cy.get('.btn').click();
    // return mock quiz of one question
    cy.wait('@getRandomQuestion');

    // check question text
    cy.get('h2').should('have.text', mockQuestion[0].question).and('be.visible');
  })
})