import { useState } from "react"; // Removed useEffect
import { Container, Card, Button, Row, Col } from "react-bootstrap";
import { useQuery, useMutation } from "@apollo/client"; // Import Apollo hooks
import { GET_ME } from "../utils/queries";
import { REMOVE_BOOK } from "../utils/mutations"; // Import the mutation
import { removeBookId } from "../utils/localStorage";

const SavedBooks = () => {
  // Removed userDataLength

  // Use useQuery to fetch user data
  const { loading, error, data } = useQuery(GET_ME);
  const userData = data?.me || {};

  // Use useMutation for deleting books
  const [removeBook, { error: removeBookError }] = useMutation(REMOVE_BOOK);

  // Removed useEffect

  const handleDeleteBook = async (bookId) => {
    try {
      await removeBook({
        variables: { bookId },
        // Update cache after mutation completes
        update: (cache) => {
          const data = cache.readQuery({ query: GET_ME });
          cache.writeQuery({
            query: GET_ME,
            data: {
              me: {
                ...data.me,
                savedBooks: data.me.savedBooks.filter(
                  (book) => book.bookId !== bookId
                ),
              },
            },
          });
        },
      });

      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;
  if (removeBookError) return `Error! ${removeBookError.message}`;

  return (
    <>
      <div fluid className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2 className="pt-5">
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${
                userData.savedBooks.length === 1 ? "book" : "books"
              }:`
            : "You have no saved books!"}
        </h2>
        <Row>
          {userData.savedBooks.map((book) => {
            return (
              <Col md="4">
                <Card key={book.bookId} border="dark">
                  {book.image ? (
                    <Card.Img
                      src={book.image}
                      alt={`The cover for ${book.title}`}
                      variant="top"
                    />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className="small">Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button
                      className="btn-block btn-danger"
                      onClick={() => handleDeleteBook(book.bookId)}
                    >
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
