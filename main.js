// Inisialisasi Storage Key dan Submission Input
const storageKey = "STORAGE_KEY";
const submitAction = document.getElementById("inputBook");
const submitFind = document.getElementById("searchBook");
const submitEdit = document.getElementById("editBookSubmit");

// Cek Apabila Storage kosong atau tidak
function checkForStorage() {
  return typeof Storage !== "undefined";
}

// Menampilkan render Book List apabila Browser mendukung

window.addEventListener("load", function () {
  if (checkForStorage) {
    if (localStorage.getItem(storageKey) !== null) {
      changeTextChecked();
      renderBookList();
    }
  } else {
    alert("Browser yang Anda gunakan tidak mendukung Web Storage");
  }
});

// Menampilkan Toggle Input
document.getElementById("toggleInput").addEventListener("click", () => {
  let x = document.getElementById("inputBook");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
});

// Memasukan Item Baru Book List
function putBookList(data) {
  if (checkForStorage()) {
    let bookData = [];
    if (localStorage.getItem(storageKey) !== null) {
      // menampilkan local storage yang telah di ubah dari stirng menjadi object kembali
      bookData = JSON.parse(localStorage.getItem(storageKey));
    }

    bookData.unshift(data);

    // Apabila data lebih dari 10 maka akan terhapus aktifkan (uncomment) jika di perlukan fitur ini
    // if (bookData.length > 10) {
    //   bookData.pop();
    // }

    // menyimpan item kedalam storage yang telah di ubah menjadi string
    localStorage.setItem(storageKey, JSON.stringify(bookData));
  }
}

// Menampilkan fungsi Item Book List yang telah di filter ataupun tidak
function getBookList(title, cek) {
  let getAllBook = JSON.parse(localStorage.getItem(storageKey));

  if (cek) {
    const regexPattern = new RegExp(`\\b${title}\\w*`, "i");
    getAllBook = getAllBook.filter(function (book) {
      return regexPattern.test(book.title.toLowerCase());
    });
  }

  if (checkForStorage()) {
    return getAllBook || [];
  } else {
    return [];
  }
}

// fungsi memindahkan item buku
function toggleCompletion(id, isComplete) {
  const bookData = getBookList();
  const bookIndex = bookData.findIndex((book) => book.id === Number(id));

  if (bookIndex !== -1) {
    bookData[bookIndex].isComplete = isComplete;
    localStorage.setItem(storageKey, JSON.stringify(bookData));
    renderBookList();
  }
}

// fungsi ubah buku
function editBook(id) {
  const bookData = getBookList();
  const bookIndex = bookData.findIndex((book) => book.id === Number(id));

  if (bookIndex !== -1) {
    let inputBookTitle = document.getElementById("inputBookTitle");
    let inputBookAuthor = document.getElementById("inputBookAuthor");
    let inputBookYear = document.getElementById("inputBookYear");
    let inputBookIsComplete = document.getElementById("inputBookIsComplete");

    inputBookTitle.value = bookData[bookIndex].title;
    inputBookAuthor.value = bookData[bookIndex].author;
    inputBookYear.value = bookData[bookIndex].year;
    inputBookIsComplete.checked = bookData[bookIndex].isComplete;

    // Saat Edit ditekan maka akan ototmatis scroll ke atas
    document.getElementById("toggleInput").innerHTML = "<h2>Ubah Data Buku<h2>";

    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    document.getElementById("inputBook").style = `display:block`;

    document.getElementById("batalEdit").style = `  
    background-color: red;
    color: white;
    border: 0;
    border-radius: 5px;
    display: block;
    width: 100%;
    padding: 8px;
    cursor: pointer;`;

    document.getElementById("bookSubmit").innerText = "Ubah Buku";

    submitAction.addEventListener("submit", function (event) {
      event.preventDefault();

      inputBookTitle = document.getElementById("inputBookTitle").value;
      inputBookAuthor = document.getElementById("inputBookAuthor").value;
      inputBookYear = document.getElementById("inputBookYear").value;
      inputBookIsComplete = document.getElementById(
        "inputBookIsComplete"
      ).checked;

      bookData[bookIndex].title = inputBookTitle;
      bookData[bookIndex].author = inputBookAuthor;
      bookData[bookIndex].year = Number(inputBookYear); 
      bookData[bookIndex].isComplete = inputBookIsComplete;

      localStorage.setItem(storageKey, JSON.stringify(bookData));

      window.location.reload();

      renderBookList();
    });
  }
}

// fungsi menghapus buku
function deleteBook(id) {
  const bookData = getBookList();
  const bookIndex = bookData.findIndex((book) => book.id === Number(id));

  const konfirmasiHapus = confirm(
    `Apakah anda yakin ingin menghapus data ${bookData[bookIndex].title}?`
  );
  if (konfirmasiHapus) {
    if (bookIndex !== -1) {
      bookData.splice(bookIndex, 1);
      localStorage.setItem(storageKey, JSON.stringify(bookData));
      renderBookList();
    }
  } else {
    alert("Tidak Jadi Di Hapus");
  }
}

// fungsi merender item buku untuk ditampilkan
function renderBookList(title, cek) {
  let bookData = getBookList(title, cek);

  const completedBooks = bookData.filter((book) => book.isComplete);
  const incompleteBooks = bookData.filter((book) => !book.isComplete);

  // hasil filter buku yang telah di baca
  const completedBooksHTML = completedBooks
    .map(
      (book) => `
        <article class="book_item">
          <h3>${book.title}</h3>
          <p>Penulis: ${book.author}</p>
          <p>Tahun: ${book.year}</p>
    
          <div class="action">
          <button class="green" onclick="toggleCompletion(${
            book.id
          }, ${false})">
              Belum Selesai
            </button>
            <button class="blue" onclick="editBook(${
              book.id
            })">Edit buku</button>
            <button class="red" onclick="deleteBook(${
              book.id
            })">Hapus buku</button>
          </div>
        </article>
      `
    )
    .join("");

  // hasil filter buku yang belum di baca
  const incompleteBooksHTML = incompleteBooks
    .map(
      (book) => `
        <article class="book_item">
          <h3>${book.title}</h3>
          <p>Penulis: ${book.author}</p>
          <p>Tahun: ${book.year}</p>
    
          <div class="action">
            <button class="green" onclick="toggleCompletion(${
              book.id
            }, ${true})">
              Sudah Selesai 
            </button>
            <button class="blue" onclick="editBook(${
              book.id
            })">Edit buku</button>
            <button class="red" onclick="deleteBook(${
              book.id
            })">Hapus buku</button>
          </div>
        </article>
      `
    )
    .join("");

  // kombinasi dari kedua hasil filter untuk dimasukan berdasarkan elemen
  document.getElementById(
    "incompleteBookshelfList"
  ).innerHTML = `${incompleteBooksHTML}`;
  document.getElementById(
    "completeBookshelfList"
  ).innerHTML = `${completedBooksHTML}`;
}

function changeTextChecked() {
  return document
    .getElementById("inputBookIsComplete")
    .addEventListener("change", function () {
      // Check if the checkbox is checked
      if (inputBookIsComplete.checked) {
        // Update the text when the checkbox is checked

        document.getElementById(
          "bookSubmit"
        ).innerHTML = `Kirim dengan <span>Sudah selesai dibaca</span>`;
      } else {
        // Update the text when the checkbox is unchecked
        document.getElementById(
          "bookSubmit"
        ).innerHTML = `Masukkan Buku ke rak <span>Belum selesai dibaca</span>`;
      }
    });
}

submitAction.addEventListener("submit", function (event) {
  event.preventDefault(); // agar form yang telah di submit tidak reload

  // mengambil nilai dari input
  const inputBookTitle = document.getElementById("inputBookTitle").value;
  const inputBookAuthor = document.getElementById("inputBookAuthor").value;
  const inputBookYear = document.getElementById("inputBookYear").value;
  const inputBookIsComplete = document.getElementById(
    "inputBookIsComplete"
  ).checked;

  const newBook = {
    id: Date.now(),
    title: inputBookTitle,
    author: inputBookAuthor,
    year: Number(inputBookYear), 
    isComplete: inputBookIsComplete,
  };
  alert("Buku berhasil diperbaharui");

  putBookList(newBook);
  window.location.reload();

  renderBookList();
});

submitFind.addEventListener("submit", function (event) {
  event.preventDefault();

  const searchBookTitle = document.getElementById("searchBookTitle").value;

  renderBookList(searchBookTitle, true);
});
