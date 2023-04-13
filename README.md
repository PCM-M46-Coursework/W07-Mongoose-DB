# Week 07 - MongoDB NoSQL Database: RESTful Refactoring

**Author:** Peter C. Matthews

This repository contains my submission for the [Master Coding](https://wearecodenation.com/2022/04/25/master-coding/) course at *CodeNation*.

## Brief

**Overview:**

Create a Mongoose application that connects to a MongoDB database.

**Requirements:**
 - [x] Create the following routes:
 - [x] POST - adds a book to the database
 - [x] GET - gets all books from the database
 - [x] PUT - updates a books author
 - [x] DELETE - deletes a single book from the database
 - [ ] Have your application separated into server /model/routes/controllers

**Stretch Goals:**
 - [x] Use dynamic updates to search on a book name and update any field
 - [x] Delete all entries to the database, as well as deleting a single entry
 - [x] Find a single book by the title: [https://expressjs.com/en/guide/routing.html](https://expressjs.com/en/guide/routing.html)
 - [x] For this, research `req.params`: [https://www.geeksforgeeks.org/expressjs-req-params-property/](https://www.geeksforgeeks.org/expressjs-req-params-property/)

**Personal Stretch Goals:**

 - [ ] Implement the CQRS pattern, splitting read and write operations.
 - [x] Add the following routes:
 - [x] PATCH - allows partial updates for a book in the database.
 - [x] OPTIONS - show the HTTP verbs that are available for a particular route.
 - [x] HEAD - respond with just the header of the response, and perform no actions.
 - [x] Find a single book by the ISBN, rather than by the title.
 - [ ] Explore best practices for MongoDB schema design.
 - [x] Include validation for ISBN values.

## Implementation

**TODO:** Write Implementation Details.

### Dynamic Updates

Instead of using dynamic updating, I've implemented a proper PATCH method. This uses mongoose's `Model.set()` method to merge the property lists of both objects; that of the object within the JSON body of the request, and that of the object selected from the database. This process ignores any extra properties that don't belong to the schema, and validates the inputs against the schema validation rules. The resulting object is then updated within the database.

### Disabling the TRACE method.

The TRACE method is one of the HTTP verbs used in RESTful web services. It is an HTTP request method that echoes back the received request so that a client can see what intermediate servers are changing or adding to the request. The TRACE method is mostly used for debugging purposes, and it is not meant to be used in production environments.

When a client sends a TRACE request, the server responds with the exact same request that it received. The response contains an entity body that has the message content. The TRACE method is useful for diagnosing issues with intermediaries such as proxy servers or load balancers that may modify the original request.

However, the TRACE method can also pose security risks, as it may expose sensitive information, such as authentication tokens or cookies, to attackers. For this reason, some web servers disable the TRACE method by default or only allow it to be used in restricted environments.

### ISBN Validation

There are three ISBN validators available on NPM; `isbn-validate` only validated ISBN-10 values. `isbn-validation` only validates ISBN-13 values. `isbn-validator` only validates ISBN-13 values that are not hyphenated. I wanted a validator that was able to validate hyphenated, and un-hyphenated ISBN-10 and ISBN-13 values. So, I took the working bits from all three libraries, and formed them into one single validation function.

For reference: [https://help.sap.com](https://help.sap.com/saphelp_gds20/helpdata/EN/8f/2be4b8983749f2be8a58c7925b6cb5/content.htm?no_cache=true)

## Retrospective

**TODO:** Write Retrospective.