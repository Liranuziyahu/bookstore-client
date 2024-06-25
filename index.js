let booksList = [];
const loadBooksData = () => {
  fetch("https://localhost:44343/api/Books/")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      booksList = data;
      const tableBody = document.querySelector("#booksTable tbody");
      // Clear existing rows
      tableBody.innerHTML = "";

      data.forEach((book, index) => {
        const authors = book.authors.join(", "); // Join authors array into a string
        const editButton = `<button type="button" class="btn btn-edit" onclick="editBook('${book.isbn}')"><i class="fas fa-edit"></i> Edit</button>`;
        const deleteButton = `<button type="button" class="btn btn-delete" onclick="deleteBook(${book.isbn})"><i class="fas fa-trash-alt"></i> Delete</button>`;

        const row = `
            <tr>
              <td>${book.title}</td>
              <td>${authors}</td>
              <td>${book.category}</td>
              <td>${book.year}</td>
              <td>${book.price}</td>
            <td class='tools'>${editButton}${deleteButton}</td>
            </tr>
          `;

        tableBody.innerHTML += row;
      });
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
};

const deleteBook = (isbnBook) => {
  fetch(`https://localhost:44343/api/Books/${isbnBook}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      loadBooksData(); // For update the Table of Books data
      console.log("Book deleted successfully");
    })
    .catch((error) => {
      console.error("There was a problem with the delete operation:", error);
    });
};

const findBookByISBN = (isbn) => {
  return booksList.find((book) => book.isbn === isbn);
};

const editBook = (isbnBook) => {
  let bookForEdit = findBookByISBN(isbnBook);
  document.getElementById("editBookModalLabel").innerHTML = `Edit Book`;
  document.getElementById("editTitle").value = bookForEdit.title;
  document.getElementById("editAuthors").value = bookForEdit.authors.join(", ");
  document.getElementById("editCategory").value = bookForEdit.category;
  document.getElementById("editYear").value = bookForEdit.year;
  document.getElementById("editPrice").value = bookForEdit.price;
  ediIsbnInput = document.getElementById("editIsbn");
  ediIsbnInput.value = bookForEdit.isbn;
  ediIsbnInput.disabled = true;

  let btnSave = document.getElementById("saveBtn");
  btnSave.innerHTML = `Save Changes`;
  clearEventListeners(btnSave, saveEditedBook);

  // Show the edit form
  $("#editBookModal").modal("show");
};

const closeForm = () => {
  $("#editBookModal").modal("hide");
};

const saveEditedBook = () => {
  const editedBook = {
    isbn: document.getElementById("editIsbn").value,
    title: document.getElementById("editTitle").value,
    authors: document
      .getElementById("editAuthors")
      .value.split(",")
      .map((author) => author.trim()),
    category: document.getElementById("editCategory").value,
    year: document.getElementById("editYear").value,
    price: document.getElementById("editPrice").value,
  };

  fetch(`https://localhost:44343/api/Books/${editedBook.isbn}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(editedBook),
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    console.log("Book updated successfully");
    loadBooksData();
    // Hide the edit form
    $("#editBookModal").modal("hide");
  });
};

const postBook = () => {
  let isbn = document.getElementById("editIsbn").value;
  let title = document.getElementById("editTitle").value;
  let authors = document.getElementById("editAuthors").value;
  let category = document.getElementById("editCategory").value;
  let year = document.getElementById("editYear").value;
  let price = document.getElementById("editPrice").value;

  const book = {
    isbn: isbn,
    title: title,
    authors: [authors],
    category: category,
    year: year,
    price: price,
  };

  fetch(`https://localhost:44343/api/Books`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(book),
  })
    .then((response) => {
      if (!response.ok) {
        return response.text().then((text) => {
          throw new Error(text);
        });
      }
      return response.json();
    })
    .then((data) => {
      console.log("Book updated successfully", data);
      loadBooksData();
      // Hide the edit form
      $("#editBookModal").modal("hide");
    })
    .catch((error) => {
      console.error("There was a problem with the Create operation:", error.message);
      alert("Error: " + error.message);
    });
};

const clearEventListeners = (element, event) => {
  const newElement = element.cloneNode(true);
  element.parentNode.replaceChild(newElement, element);
  newElement.addEventListener("click", event);
  return newElement;
};

const creatBook = () => {
  document.getElementById("editBookModalLabel").innerHTML = `Create a Book`;
  let btnSave = document.getElementById("saveBtn");
  btnSave.innerHTML = `Create`;
  clearEventListeners(btnSave, postBook);
  document.getElementById("editTitle").value = "";
  document.getElementById("editAuthors").value = "";
  document.getElementById("editCategory").value = "";
  document.getElementById("editYear").value = "";
  document.getElementById("editPrice").value = "";
  ediIsbnInput = document.getElementById("editIsbn");
  ediIsbnInput.value = "";
  ediIsbnInput.disabled = false;
  // Show the edit form
  $("#editBookModal").modal("show");
};

const exportReport = () => {
  fetch(`https://localhost:44343/api/Books/report`)
    .then((response) => response.text())
    .then((data) => {
      var reportWindow = window.open();
      reportWindow.document.open();
      reportWindow.document.write(data);
      reportWindow.document.close();
    })
    .catch((error) => {
      console.error("Error fetching or displaying report:", error);
      alert("Error fetching or displaying report. Please try again.");
    });
};