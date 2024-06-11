describe("Countries App", () => {
  beforeEach(() => {
    cy.visit("https://xcountries.vercel.app/");
  });

  describe("Loading and Initial Display", () => {
    it("makes an API call and displays initial content", () => {
      cy.intercept("GET", "https://xcountries-backend.azurewebsites.net/all").as(
        "getCountries"
      );
      cy.wait("@getCountries").its("response.statusCode").should("eq", 200);
      cy.get("body").should("not.be.empty");
    });
  });

  describe("Flag Display", () => {
    it("displays country flags with alt text", () => {
      cy.get("img")
        .should("have.length.at.least", 90)
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
      // Create a spy on console.error
      cy.on("window:before:load", (win) => {
        cy.spy(win.console, "error").as("consoleError");
      });
  
      // Intercept the API request and force a network error
      cy.intercept("GET", "https://xcountries-backend.azurewebsites.net/all", {
        forceNetworkError: true,
      }).as("getFailedCountries");
  
      cy.visit("http://localhost:3000");
  
      // Wait for the intercepted API call
      cy.wait("@getFailedCountries");
  
      // Assert that console.error was called with the correct error message
      cy.get("@consoleError").should("be.calledWithMatch", /Error fetching data:/);
    });
  });
  
});
