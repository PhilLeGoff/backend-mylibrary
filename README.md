# myLibrary API

The myLibrary API is a RESTful web service designed to manage library resources. It provides endpoints for managing books, clients, and loans within the myLibrary system.
## Preview

Please note that this project is not finished, not operational, and serves as a preview of potential future features. It also showcases backend development skills.

## Endpoints

### /books

The `/books` endpoint allows for the management of books including creation, searching, and deletion.

- **POST /books:** Create a new book in the myLibrary database.
- **GET /books:** Search for books based on various criteria such as title, author, genre, ISBN number, or books that are due.
- **DELETE /books/{bookId}:** Delete a book from the myLibrary database by its unique identifier.

### /clients

The `/clients` endpoint facilitates the management of clients including creation, searching, and deletion.

- **POST /clients:** Create a new client in the myLibrary system.
- **GET /clients:** Search for clients based on various criteria such as full name or phone number.

### /loans

The `/loans` endpoint enables the management of loans including creation, searching, and deletion.

- **POST /loans:** Create a new loan in the myLibrary system.
- **GET /loans:** Search for loans based on various criteria such as client, book, or loan status.
- **PUT /loans/{loanId}:** Deletes a loan from the myLibrary system by its unique identifier.

## Usage

1. Send HTTP requests to the respective endpoints using the appropriate HTTP methods (POST, GET, DELETE).
2. Include necessary parameters in the request body or URL path as required by each endpoint.
3. Handle the responses from the API to manage books, clients, and loans effectively.

## Authentication

Authentication mechanisms such as API keys or JWT tokens can be implemented for secure access to the API endpoints.

## Error Handling

The API provides meaningful error responses for various scenarios such as invalid requests or unauthorized access.

## Technologies Used

- **Node.js:** JavaScript runtime environment for building scalable server-side applications.
- **Express.js:** Web application framework for Node.js used to build the API endpoints.
- **MongoDB:** NoSQL database used to store library resources data.
- **Mongoose:** MongoDB object modeling tool for Node.js used to define data schemas and interact with the database.

## Contributing

Contributions to the myLibrary API are welcome! Please feel free to open issues or submit pull requests to help improve this project.

## License

This API is licensed under the MIT License.