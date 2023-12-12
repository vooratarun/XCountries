describe("Countries App", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  describe("Loading and Initial Display", () => {
    it("makes an API call and displays initial content", () => {
      cy.intercept("GET", "https://restcountries.com/v3.1/all").as(
        "getCountries"
      );
      cy.wait("@getCountries").its("response.statusCode").should("eq", 200);
      cy.get("body").should("not.be.empty");
    });
  });

  describe("Flag Display", () => {
    it("displays country flags with alt text", () => {
      cy.get("img")
        .should("have.length.at.least", 250)
        .and(($imgs) => {
          expect($imgs).to.have.attr("alt").and.not.be.empty;
        });
    });
  });

  describe("Country Name Display", () => {
    it("displays country names", () => {
      cy.get("div, span, h1, h2, h3, h4, h5, h6, p")
        .filter((index, element) => {
          return element.innerText.trim().length > 0;
        })
        .should("have.length.at.least", 1);
    });
  });

  describe("API Error Handling", () => {
    it("logs an error to the console on API failure", () => {
      // Create spies on console.log and console.error
      cy.on("window:before:load", (win) => {
        cy.spy(win.console, "log").as("consoleLog");
        cy.spy(win.console, "error").as("consoleError");
      });

      // Intercept the API request and force a network error
      cy.intercept("GET", "https://restcountries.com/v3.1/all", {
        forceNetworkError: true,
      }).as("getFailedCountries");

      cy.visit("/");

      // Wait for the intercepted API call
      cy.wait("@getFailedCountries");

      // Check if either console.error or console.log was called
      cy.get("@consoleError").then((consoleError) => {
        cy.get("@consoleLog").then((consoleLog) => {
          expect(consoleError.called || consoleLog.called).to.be.true;
        });
      });
    });
  });
});
