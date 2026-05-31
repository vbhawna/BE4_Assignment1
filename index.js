const express = require("express");
const app = express();
const cors = require("cors");

const { initializeDatabase } = require("./db/db.connect");
// const fs = require("fs");
const Books = require("./models/books.models");

app.use(express.json());

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

initializeDatabase();

// const jsonData = fs.readFileSync("./books.json", "utf-8");
// const BooksData = JSON.parse(jsonData);

// const seedData = () => {
//     try {
//         for (const bookData of BooksData) {
//             const newBook = new Books({
//                 title: bookData.title,
//                 author: bookData.author, 
//                 publishedYear: bookData.publishedYear,
//                 genre: bookData.genre,
//                 language: bookData.language, 
//                 country: bookData.country, 
//                 rating: bookData.rating, 
//                 summary: bookData.summary,
//                 coverImageUrl: bookData.coverImageUrl,
//             });
//             newBook.save();
//         }
//     } catch (error) { console.log("Error Seeding Data.", error); }
// };

// seedData();

// BE4_Assignment1

// 1. Create an API with route "/books" to create a new book data in the books Database. Make sure to do error handling. 
// Test your API with Postman. Add the following book:

async function createBook(bookData) {
    try {
        const newBook = new Books(bookData);
        const savedBook = await newBook.save();
        return savedBook;
    } catch(error) {
        console.log(error);
    }
}

app.post("/books", async (req, res) => {
    try {
        const savedBook = await createBook(req.body);
        res.status(201).json({message: "Book added successfully.", book: savedBook});
    } catch(error) {
        res.status(500).json({error: "Failed to save book."})
    }
});


// 3. Create an API to get all the books in the database as response. Make sure to do error handling.
async function readAllBooks() {
    try {
        const allBooks = await Books.find();
        return allBooks;
    }catch(error) {
        console.log(error);
    }
}

app.get("/books", async (req, res) => {
    try {
        const allBooksData = await readAllBooks();
        if(allBooksData.length != 0) {
            res.status(200).json(allBooksData);
        } else {
            res.status(404).json({ error: "Books not found." });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to fectch Books. " });
    }
});

// 4. Create an API to get a book's detail by its title. Make sure to do error handling.

async function readBookByTitle(bookTitle) {
    try {
        const bookByTitle = await Books.findOne({ title: bookTitle});
        return bookByTitle;
    } catch (error) {
        console.log(error);
    }
}

app.get("/books/:bookTitle", async (req, res) => {
    try {
        const bookByTitle = await readBookByTitle(req.params.bookTitle);
        if(!bookByTitle) {
            res.status(404).json({ error: "Book not found." });
        } else {
            res.status(200).json(bookByTitle);
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch Book by Title." });
    }
});

// 5. Create an API to get details of all the books by an author. Make sure to do error handling.

async function readBooksbyAuthor(bookAuthor) {
    try {
        const booksData = await Books.find({ author: bookAuthor });
        return booksData;
    } catch(error) {
        console.log(error);
    }
}

app.get("/books/author/:bookAuthor", async (req, res) => {
    try {
        const books = await readBooksbyAuthor(req.params.bookAuthor);
        if(books.length != 0) {
            res.status(200).json(books);
        } else {
            res.status(404).json({ error: "books not found."});
        }
    } catch(error) {
        res.status(500).json({ error: "Failed to fetch book data by author." });
    }
});

// 6. Create an API to get all the books which are of "Business" genre.

async function readBooksByGenre(bookGenre) {
    try {
        const booksByGenre = await Books.find({ genre: bookGenre });
        return booksByGenre;
    } catch(error) {
        console.log(error);
    }
}

app.get("/books/genre/:bookGenre", async (req, res) => {
    try {
        const booksByGenre = await readBooksByGenre(req.params.bookGenre);
        if(booksByGenre.length != 0) {
            res.status(200).json(booksByGenre);
        } else {
            res.status(404).json({error: "Book not found." });
        }
    } catch(error) {
        res.status(500).json({ error: "Failed to fetch books data by genre." });
    }
});

// 7. Create an API to get all the books which was released in the year 2012.
async function readBooksByYear(bookYear) {
    try {
        const books = await Books.find({ publishedYear: bookYear });
        // console.log(books);
        return books;
    } catch(error) {
        console.log(error);
    }
}

app.get("/books/year/:bookYear", async (req, res) => {
    try {
        const books = await readBooksByYear(req.params.bookYear);
        if(books.length != 0) {
            res.status(200).json(books);
        } else {
            res.status(404).json({ error: "Books not found."})
        }
    } catch(error) {
        res.status(500).json({error: "Failed to fetch Books data by Year." });
    }
});

// 8. Create an API to update a book's rating with the help of its id. Update the rating of the "Lean In" from 4.1 to 4.5. 
// Send an error message "Book does not exist", in case that book is not found. Make sure to do error handling.

async function updateBookRating(bookId, dataToUpdate) {
    try {
        const updatedBook = await Books.findByIdAndUpdate(bookId, dataToUpdate, { returnDocument: "after" });
        return updatedBook;
    } catch(error) {
        console.log(error);
    }
}

app.post("/books/Id/:bookId", async (req, res) => {
    try {
        const updatedBook = await updateBookRating(req.params.bookId, req.body);
        if(updatedBook) {
            res.status(200).json({ message: "Book updated successfully.", book: updatedBook});
        }else {
            res.status(404).json({ error: "Book not found." });
        }
    } catch(error) {
        res.status(500).json({ error: "Failed to Update Books rating." });
    }
});

// 9. Create an API to update a book's rating with the help of its title. Update the details of the book "Shoe Dog". 
// Use the query .findOneAndUpdate() for this. Send an error message "Book does not exist", in case that book is not found. Make sure to do error handling.

// Updated book data: { "publishedYear": 2017, "rating": 4.2 }

async function updateBookDetails(bookTitle, dataToUpdate) {
    try {
        const updatedBook = await Books.findOneAndUpdate({ title: bookTitle }, dataToUpdate, { returnDocument: "after" });
        return updatedBook;
    } catch(error) {
        console.log(error);
    }
}

app.post("/books/title/:bookTitle", async (req, res) => {
    try {
        const book = await updateBookDetails(req.params.bookTitle, req.body);
        if(book) {
            res.status(200).json({ message: "Book updated successfully.", book: book });
        } else {
            res.status(404).json({ error: "Book not found."});
        }
    } catch(error) {
        res.status(500).json({ error: "Failed to update Books data by title." });
    }
});

// 10. Create an API to delete a book with the help of a book id, Send an error message "Book not found" 
// in case the book does not exist. Make sure to do error handling.

async function deleteBook(bookId) {
    try {
        const deletedBook = await Books.findByIdAndDelete(bookId);
        return deletedBook;
    } catch(error) {
        console.log(error);
    }
}

app.delete("/books/:bookId", async (req, res) => {
    try {
        const deletedBook = await deleteBook(req.params.bookId);
        if(deletedBook) {
            res.status(200).json({ message: "deleted book successfully.", book: deletedBook });
        } else {
            res.status(404).json({ error: "book not found. " });
        }
    } catch(error) {
        res.status(500).json({ error: "Failed to delete Book." });
    }
})

const PORT = 3000;
app.listen(PORT, () => {
    console.log("Server is running on port: ", PORT);
});
