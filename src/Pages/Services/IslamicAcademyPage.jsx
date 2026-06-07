// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import styles from "./IslamicAcademyPage.module.css";
// import { useTranslation } from "react-i18next";
// import { ChevronLeft, ChevronRight } from "lucide-react";

// // ============================================================
// // DATA — استبدليها ببيانات من الـ API
// // ============================================================
// const PLACEHOLDER_BOOKS = [
//   {
//     id: 1,
//     title: "اختصار التجويد بالخط العثماني",
//     author: "بقلم إسلام سامي",
//     cover: null,
//   },
//   {
//     id: 2,
//     title: "اختصار التجويد بالخط العثماني",
//     author: "بقلم إسلام سامي",
//     cover: null,
//   },
//   {
//     id: 3,
//     title: "اختصار التجويد بالخط العثماني",
//     author: "بقلم إسلام سامي",
//     cover: null,
//   },
//   {
//     id: 4,
//     title: "اختصار التجويد بالخط العثماني",
//     author: "بقلم إسلام سامي",
//     cover: null,
//   },
// ];

// function BookCard({ book, onRead }) {
//   return (
//     <div className={styles.bookCard}>
//       <div className={styles.bookCover}>
//         {book.cover ? (
//           <img src={book.cover} alt={book.title} />
//         ) : (
//           <div className={styles.bookCoverPlaceholder}>
//             <svg
//               width="40"
//               height="40"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="1.5"
//             >
//               <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
//               <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
//             </svg>
//           </div>
//         )}
//       </div>
//       <div className={styles.bookInfo}>
//         <p className={styles.bookTitle}>{book.title}</p>
//         <p className={styles.bookAuthor}>{book.author}</p>
//         <button className={styles.readBtn} onClick={() => onRead(book)}>
//           اقرأ الان
//         </button>
//       </div>
//     </div>
//   );
// }

// export default function IslamicAcademyPage() {
//   const navigate = useNavigate();
//   const { t, i18n } = useTranslation();
//   const isRtl = i18n.language?.startsWith("ar");

//   const [books, setBooks] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchBooks = async () => {
//       try {
//         setLoading(true);
//         // TODO: استبدلي بـ API call حقيقي
//         // const res = await fetch("https://your-api.com/api/library/islamic-academy");
//         // const data = await res.json();
//         // setBooks(data);
//         setBooks(PLACEHOLDER_BOOKS);
//       } catch (err) {
//         console.error("Failed to fetch books:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchBooks();
//   }, []);

//   return (
//     <div className={styles.page}>
//       <div className={styles.container}>
//         {/* ── Header ── */}
//         <div className={styles.header}>
//           <button
//             className={styles.backBtn}
//             onClick={() => navigate(-1)}
//             aria-label="back"
//           >
//             {isRtl ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
//           </button>
//           <h1 className={styles.title}>الاكاديميه الاسلامية</h1>
//         </div>

//         {/* ── Books Grid ── */}
//         {loading ? (
//           <div className={styles.grid}>
//             {[1, 2, 3, 4].map((i) => (
//               <div
//                 key={i}
//                 className={`${styles.bookCard} ${styles.skeleton}`}
//               />
//             ))}
//           </div>
//         ) : (
//           <div className={styles.grid}>
//             {books.map((book) => (
//               <BookCard
//                 key={book.id}
//                 book={book}
//                 onRead={(b) => navigate(`/services/library/book/${b.id}`)}
//               />
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import { useNavigate } from "react-router-dom";
import styles from "../../components/ServisesSection/ServicesSection.module.css";
import { ArrowRight } from "lucide-react";

const books = [
  {
    id: 1,
    title: "اختصار التجويد بالخط العثماني",
    author: "بقلم إسلام سامي",
    img: "/book-cover.png",
  },
  {
    id: 2,
    title: "اختصار التجويد بالخط العثماني",
    author: "بقلم إسلام سامي",
    img: "/book-cover.png",
  },
  {
    id: 3,
    title: "اختصار التجويد بالخط العثماني",
    author: "بقلم إسلام سامي",
    img: "/book-cover.png",
  },
  {
    id: 4,
    title: "اختصار التجويد بالخط العثماني",
    author: "بقلم إسلام سامي",
    img: "/book-cover.png",
  },
];

export default function IslamicAcademy() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <button
          onClick={() => navigate("/services/library")}
          className={styles.backBtn}
        >
          <ArrowRight size={20} />
        </button>
        <h2>الاكاديميه الاسلامية</h2>
      </div>

      <div className={styles.booksGrid}>
        {books.map((book, idx) => (
          <div key={idx} className={styles.bookCard}>
            <div className={styles.bookImgPlaceholder}>
              <span>Tajweed Book</span>
            </div>
            <h3>{book.title}</h3>
            <p>{book.author}</p>
            <button className={styles.primaryBtn}>اقراء الآن</button>
          </div>
        ))}
      </div>
    </div>
  );
}
