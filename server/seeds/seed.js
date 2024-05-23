const db = require("../config/connection");
const { User, Book } = require("../models"); // Adjust the path if your models are in a different location

const userData = [
  {
    username: "user1",
    email: "user1@example.com",
    password: "password123",
  },
  {
    username: "user2",
    email: "user2@example.com",
    password: "password456",
  },
  // Add more users as needed
];

const bookData = [
  {
    bookId: "1",
    authors: ["Author A"],
    description: "Book 1 description...",
    title: "Book 1",
    image: "book1.jpg",
    link: "https://example.com/book1",
  },
  {
    bookId: "2",
    authors: ["Author B", "Author C"],
    description: "Book 2 description...",
    title: "Book 2",
    image: "book2.jpg",
    link: "https://example.com/book2",
  },
  // Add more books as needed
];

db.once("open", async () => {
  try {
    await User.deleteMany({}); // Clear existing users
    await Book.deleteMany({}); // Clear existing books

    const createdUsers = await User.create(userData);

    for (let i = 0; i < bookData.length; i++) {
      const { _id: userId } = createdUsers[i % createdUsers.length];
      const createdBook = await Book.create(bookData[i]);
      await User.findByIdAndUpdate(
        userId,
        { $push: { savedBooks: createdBook._id } },
        { new: true }
      );
    }

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
});
