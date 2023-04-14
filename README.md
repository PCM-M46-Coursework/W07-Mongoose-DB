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
 - [x] Have your application separated into server /model/routes/controllers

**Stretch Goals:**
 - [x] Use dynamic updates to search on a book name and update any field
 - [x] Delete all entries to the database, as well as deleting a single entry
 - [x] Find a single book by the title: [https://expressjs.com/en/guide/routing.html](https://expressjs.com/en/guide/routing.html)
 - [x] For this, research `req.params`: [https://www.geeksforgeeks.org/expressjs-req-params-property/](https://www.geeksforgeeks.org/expressjs-req-params-property/)

**Personal Stretch Goals:**

 - [x] Implement the CQRS pattern, splitting read and write operations.
 - [x] Add the following routes:
 - [x] PATCH - allows partial updates for a book in the database.
 - [x] OPTIONS - show the HTTP verbs that are available for a particular route.
 - [x] HEAD - respond with just the header of the response, and perform no actions.
 - [x] Find a single book by the ISBN, rather than by the title.
 - [x] Explore best practices for MongoDB schema design.
 - [x] Include validation for ISBN values.

## Implementation

This project has been a really nice opportunity to explore JavaScript API architecture design, and has allowed me to stretch my legs when it comes to patterns, and paradigms that I am familiar with from using .NET. It's also been nice to learn a new way to think about data access, and modelling; having come from using Entity Framework Code First, in the past, as a hobbyist.

### Schema Design Best Practices

Within NoSQL data modelling, it's good to work with a similar philosophy in mind, as I would with Entity Framework Code First. With this brief, it's not the best to show "best practices", because of the scale, and contrived nature. That being said, the best practices state that the model and the schema should grow with the application, rather than the application being based around the database model. This is true with EF Core, as well, when using Code First design. With this in mind, I have favoured Embedding over Referencing, and stuck to One-One relations, when it comes to the author of the books.

Through research, I have found the five main rules of thumb with NoSQL schema design are:

1. Favour embedding until you have a valid reason to separate your concerns.
2. A property that becomes an entity in its own right is reason enough to use a reference.
3. Arrays should not grow without bounds. This enforces reverse referencing, when dealing with huge collections.
4. Many-Many relations should reference eachother (same as Entity Framework).
5. The schema profile relies entirely on the domain that it models. There is no "one true ruleset".

This means that the main paradigm that NoSQL modelling follows, is YAGNI. You're Not Gonna Need It. Until, of course, you do. But, until that point, redundancy can be costly. There is a strict 16MB limit per document (atomic query result) with MongoDB, so adding redundant data can be costly.

### Dynamic Updates

Instead of using dynamic updating, I've implemented a proper PATCH method. This uses mongoose's `Model.set()` method to merge the property lists of both objects; that of the object within the JSON body of the request, and that of the object selected from the database. This process ignores any extra properties that don't belong to the schema, and validates the inputs against the schema validation rules. The resulting object is then updated within the database.

### Disabling the TRACE method.

The TRACE method is one of the HTTP verbs used in RESTful web services. It is an HTTP request method that echoes back the received request so that a client can see what intermediate servers are changing or adding to the request. The TRACE method is mostly used for debugging purposes, and it is not meant to be used in production environments.

When a client sends a TRACE request, the server responds with the exact same request that it received. The response contains an entity body that has the message content. The TRACE method is useful for diagnosing issues with intermediaries such as proxy servers or load balancers that may modify the original request.

However, the TRACE method can also pose security risks, as it may expose sensitive information, such as authentication tokens or cookies, to attackers. For this reason, some web servers disable the TRACE method by default or only allow it to be used in restricted environments.

### ISBN Validation

There are three ISBN validators available on NPM; `isbn-validate` only validated ISBN-10 values. `isbn-validation` only validates ISBN-13 values. `isbn-validator` only validates ISBN-13 values that are not hyphenated. I wanted a validator that was able to validate hyphenated, and un-hyphenated ISBN-10 and ISBN-13 values. So, I took the working bits from all three libraries, and formed them into one single validation function.

For reference: [https://help.sap.com](https://help.sap.com/saphelp_gds20/helpdata/EN/8f/2be4b8983749f2be8a58c7925b6cb5/content.htm?no_cache=true)

### Command Query Responsibility Segregation (CQRS)

The Command Query Responsibility Segregation (CQRS) pattern is a design pattern that aims to separate the responsibility of handling read and write data access operations. In a RESTful API, CRUD (Create, Read, Update, and Delete) operations are used to interact with the database, and handle user commands, and queries.

CQRS takes this a step further by splitting the read and write operations into two distinct paths, each with its own set of handlers. The "read" path handles operations that only retrieve data, such as `GET`, `OPTIONS`, and `HEAD` requests, while the "write" path handles operations that modify data, such as `POST`, `PUT`, `PATCH`, and `DELETE` requests. By separating these two paths, CQRS can improve the performance and scalability of the API.

### Vertical Slice Architecture

Coined by the developer of the `MediatR` NuGet package, Jimmy Bogard, "Vertical Slice Architecture" is a software architecture design philopsophy that states that all files related to a single feature should be held together within the folder structure of the solution. This is as opposed to a more traditional horizontal, or layered approach, as you would see with Onion Architecture, or Stacked Architecture, or "The Big Ball of Mud".

Within this project, I have grouped all api related elements together into the `/src/api` folder, and then further separated the root endpoints into folders; `/src/api/books`. Within this folder, everything related to the books are held together. The schema, the model, the routes, and the custom business logic for CRUD operation, within the controllers. This feature is then referenced within `server.js`, to implement the routing within the application. Part of the refactoring process within this project, has been to convert the architecture design from horizonal layers, to vertical slices. Comparing the folder structures of commits `87ddc2d`, and `7b8bbcc`, will show the stark difference in folder structures between the two design philosophies.

## Retrospective

With this project, I have wanted to showcase the implementation of the CQRS pattern, rather than needlessly bloating the schema of the database. With one of the main tenets of NoSQL schema design being that the model grows with the application, there is little scope here to grow the model. With that scale in mind, I could see the model eventually needing to change `author` to `authors`, even sticking with the Terry Pratchett books I've been using to test the database. When it comes to Good Omens, and other such books, I would need to be able to add Neil Gaiman as a co-author. However, I feel that schema migration is a topic deserving of its own showcasing repository, as it goes way beyond the scope of a Week Zero introduction to Mongoose.

At that point, I would want to change `author` to be a collection of its own type, and would need its own RESTful API endpoints to go along with it. I could then reference it back into the `book` collection, as an array, and populate the array from the references, within the queries; possibly as an optional return set by query string.