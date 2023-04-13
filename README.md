# Week 05 - To Do List Challenge

**Author:** Peter C. Matthews

This repository contains my submission for the [Master Coding](https://wearecodenation.com/2022/04/25/master-coding/) course at *CodeNation*.

## Brief

**Overview:**

Create a Mongoose application that connects to a MongoDB database.

**Requirements:**
 - Create the following routes:
   - POST - adds a book to the database
   - GET - gets all books from the database
   - PUT - updates a books author
   - DELETE - deletes a single book from the database
 - Have your application separated into server /model/routes/controllers

**Stretch Goals:**
 - Use dynamic updates to search on a book name and update any field
 - Delete all entries to the database, as well as deleting a single entry
 - Find a single book by the title: [https://expressjs.com/en/guide/routing.html](https://expressjs.com/en/guide/routing.html)
 - For this, research `req.params`: [https://www.geeksforgeeks.org/expressjs-req-params-property/](https://www.geeksforgeeks.org/expressjs-req-params-property/)

**Personal Stretch Goals:**

 - Implement the CQRS pattern, splitting read and write operations.
 - Add the following routes:
   - PATCH - allows partial updates for a book in the database.
   - OPTIONS - show the HTTP verbs that are available for a particular route.
   - HEAD - respond with just the header of the response, and perform no actions.
 - Explore best practices for MongoDB schema design.

## Implementation

**TODO:** Write Implementation Details.

### Disabling the TRACE method.

The TRACE method is one of the HTTP verbs used in RESTful web services. It is an HTTP request method that echoes back the received request so that a client can see what intermediate servers are changing or adding to the request. The TRACE method is mostly used for debugging purposes, and it is not meant to be used in production environments.

When a client sends a TRACE request, the server responds with the exact same request that it received. The response contains an entity body that has the message content. The TRACE method is useful for diagnosing issues with intermediaries such as proxy servers or load balancers that may modify the original request.

However, the TRACE method can also pose security risks, as it may expose sensitive information, such as authentication tokens or cookies, to attackers. For this reason, some web servers disable the TRACE method by default or only allow it to be used in restricted environments.

## Retrospective

**TODO:** Write Retrospective.