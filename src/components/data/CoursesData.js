

export const courses = [
  {
    id: "tafsir-101",
    title: "أساسيات التفسير",
    description:
      "مقدمة في علم التفسير وقواعده الأساسية، وكيفية فهم آيات القرآن الكريم في سياقها الصحيح.",
    teacherName: "الشيخ أحمد عبد الرحمن",
    lectures: [
      {
        id: "lec-1",
        title: "مدخل إلى علم التفسير",
        date: "2026-06-08",
        tasks: [
          {
            id: "t-1",
            title: "قراءة الفصل الأول من مقدمة التفسير",
            description: "مراجعة تعريف علم التفسير وأهم مصادره الأساسية.",
            dueDate: "2026-06-11",
            status: "completed",
          },
          {
            id: "t-2",
            title: "تلخيص الفرق بين التفسير والتأويل",
            description: "كتابة تلخيص لا يزيد عن نصف صفحة.",
            dueDate: "2026-06-12",
            status: "pending",
          },
        ],
        exams: [
          {
            id: "e-1",
            title: "اختبار المحاضرة الأولى",
            questionsCount: 4,
            durationMinutes: 15,
            status: "completed",
            score: 4,
            totalScore: 4,
            questions: [
              {
                id: "q-1-1",
                text: "ما تعريف علم التفسير؟",
                options: [
                  "بيان معاني القرآن وما يستفاد منه",
                  "حفظ القرآن غيبًا",
                  "تعلم أحكام التلاوة فقط",
                  "ترجمة القرآن إلى لغات أخرى",
                ],
                correctIndex: 0,
              },
              {
                id: "q-1-2",
                text: "من أبرز مصادر التفسير؟",
                options: [
                  "القرآن بالقرآن",
                  "الرأي الشخصي فقط",
                  "الأحلام",
                  "الأساطير القديمة",
                ],
                correctIndex: 0,
              },
              {
                id: "q-1-3",
                text: "ما الفرق الأساسي بين التفسير والتأويل؟",
                options: [
                  "لا فرق بينهما",
                  "التفسير بيان المعنى الظاهر، والتأويل صرف اللفظ لمعنى محتمل",
                  "التأويل أقدم من التفسير",
                  "التفسير خاص بالقراء فقط",
                ],
                correctIndex: 1,
              },
              {
                id: "q-1-4",
                text: "كيف بدأ تدوين علم التفسير؟",
                options: [
                  "نقلًا شفهيًا في عصر الصحابة ثم تطور تدوينه لاحقًا",
                  "في العصر الحديث فقط",
                  "قبل نزول القرآن",
                  "لم يبدأ حتى الآن",
                ],
                correctIndex: 0,
              },
            ],
          },
        ],
        reports: [
          {
            id: "r-1",
            title: "تقرير أداء المحاضرة الأولى",
            attendance: "حاضر",
            participationScore: 9,
            examScore: 9,
            notes: "مستوى ممتاز في التفاعل، يحتاج مراجعة أسرع للمصطلحات.",
          },
        ],
      },
      {
        id: "lec-2",
        title: "أنواع التفسير ومناهجه",
        date: "2026-06-13",
        tasks: [
          {
            id: "t-3",
            title: "البحث عن مثال لكل نوع من أنواع التفسير",
            description: "إيجاد مثال واحد على الأقل لكل نوع وكتابته في الدفتر.",
            dueDate: "2026-06-16",
            status: "pending",
          },
        ],
        exams: [
          {
            id: "e-2",
            title: "اختبار المحاضرة الثانية",
            questionsCount: 5,
            durationMinutes: 12,
            status: "not_started",
            score: null,
            totalScore: 5,
            questions: [
              {
                id: "q-2-1",
                text: "كم عدد أنواع التفسير الرئيسية؟",
                options: [
                  "نوعان: بالنقل وبالرأي",
                  "نوع واحد فقط",
                  "خمسة أنواع",
                  "لا يوجد تصنيف",
                ],
                correctIndex: 0,
              },
              {
                id: "q-2-2",
                text: "ما هو التفسير بالرأي؟",
                options: [
                  "الاعتماد على الهوى دون ضابط",
                  "الاجتهاد المبني على قواعد اللغة والشريعة",
                  "رفض كل اجتهاد عقلي",
                  "تفسير يعتمد فقط على الأحلام",
                ],
                correctIndex: 1,
              },
              {
                id: "q-2-3",
                text: "أي مما يلي من مناهج التفسير المعروفة؟",
                options: [
                  "التفسير الموضوعي",
                  "التفسير الجغرافي",
                  "التفسير الرياضي",
                  "التفسير الفلكي",
                ],
                correctIndex: 0,
              },
              {
                id: "q-2-4",
                text: "التفسير بالمأثور يعتمد بشكل أساسي على؟",
                options: [
                  "آراء الفلاسفة",
                  "القرآن والسنة وأقوال الصحابة",
                  "الأبحاث العلمية الحديثة فقط",
                  "الثقافة الشعبية",
                ],
                correctIndex: 1,
              },
              {
                id: "q-2-5",
                text: "ما أهمية معرفة أسباب النزول عند التفسير؟",
                options: [
                  "لا أهمية لها",
                  "تساعد على فهم السياق الذي نزلت فيه الآية",
                  "تُستخدم للتنجيم",
                  "خاصة بالتفسير الفلسفي فقط",
                ],
                correctIndex: 1,
              },
            ],
          },
        ],
        reports: [],
      },
      {
        id: "lec-3",
        title: "قواعد الترجيح بين الأقوال",
        date: "2026-06-18",
        tasks: [],
        exams: [],
        reports: [],
      },
    ],
  },
  {
    id: "fiqh-201",
    title: "فقه العبادات الميسر",
    description:
      "شرح مبسط لأحكام الطهارة والصلاة والزكاة والصيام، مع التركيز على التطبيق العملي اليومي.",
    teacherName: "الشيخة مريم الشريف",
    lectures: [
      {
        id: "lec-1",
        title: "أحكام الطهارة",
        date: "2026-06-09",
        tasks: [
          {
            id: "t-4",
            title: "حفظ نواقض الوضوء",
            description: "حفظ القائمة المرسلة في ملف المحاضرة عن ظهر قلب.",
            dueDate: "2026-06-12",
            status: "completed",
          },
        ],
        exams: [
          {
            id: "e-3",
            title: "اختبار الطهارة",
            questionsCount: 4,
            durationMinutes: 10,
            status: "completed",
            score: 3,
            totalScore: 4,
            questions: [
              {
                id: "q-3-1",
                text: "ما الحكمة من الطهارة قبل الصلاة؟",
                options: [
                  "الاستعداد الحسي والروحي للعبادة",
                  "مجرد عادة اجتماعية",
                  "لا حكمة لها",
                  "خاصة بفصل الصيف فقط",
                ],
                correctIndex: 0,
              },
              {
                id: "q-3-2",
                text: "أي مما يلي يعد ناقضًا للوضوء؟",
                options: [
                  "الأكل",
                  "النوم العميق المستغرق",
                  "السلام على الناس",
                  "القراءة",
                ],
                correctIndex: 1,
              },
              {
                id: "q-3-3",
                text: "التيمم يكون بدلاً عن؟",
                options: [
                  "الغسل أو الوضوء عند عدم وجود الماء أو العجز عن استخدامه",
                  "الصلاة نفسها",
                  "الزكاة",
                  "الصيام",
                ],
                correctIndex: 0,
              },
              {
                id: "q-3-4",
                text: "من شروط صحة الطهارة؟",
                options: [
                  "استخدام ماء طاهر",
                  "عدم النية أصلاً",
                  "استخدام أي سائل متوفر",
                  "لا شروط محددة",
                ],
                correctIndex: 0,
              },
            ],
          },
        ],
        reports: [
          {
            id: "r-2",
            title: "تقرير أداء أحكام الطهارة",
            attendance: "حاضر",
            participationScore: 8,
            examScore: 8,
            notes: "أداء جيد جدًا، التوصية بمراجعة باب التيمم.",
          },
        ],
      },
      {
        id: "lec-2",
        title: "شروط الصلاة وأركانها",
        date: "2026-06-16",
        tasks: [
          {
            id: "t-5",
            title: "كتابة أركان الصلاة بالترتيب",
            description: "تسليم الإجابة قبل المحاضرة القادمة.",
            dueDate: "2026-06-19",
            status: "pending",
          },
        ],
        exams: [],
        reports: [],
      },
    ],
  },
  {
    id: "sirah-301",
    title: "السيرة النبوية: المرحلة المكية",
    description:
      "رحلة في أحداث السيرة النبوية من المولد الشريف إلى الهجرة، واستخراج الدروس والعبر.",
    teacherName: "الشيخ يوسف النجار",
    lectures: [
      {
        id: "lec-1",
        title: "المولد والنشأة",
        date: "2026-06-07",
        tasks: [],
        exams: [
          {
            id: "e-4",
            title: "اختبار المولد والنشأة",
            questionsCount: 4,
            durationMinutes: 8,
            status: "completed",
            score: 4,
            totalScore: 4,
            questions: [
              {
                id: "q-4-1",
                text: "في أي مدينة وُلد النبي ﷺ؟",
                options: ["مكة المكرمة", "المدينة المنورة", "الطائف", "دمشق"],
                correctIndex: 0,
              },
              {
                id: "q-4-2",
                text: "من كان كافل النبي ﷺ بعد وفاة جده عبد المطلب؟",
                options: ["أبو طالب", "أبو لهب", "أبو سفيان", "أبو جهل"],
                correctIndex: 0,
              },
              {
                id: "q-4-3",
                text: "بماذا عُرف النبي ﷺ بين قومه قبل البعثة؟",
                options: [
                  "الصادق الأمين",
                  "الشاعر المفلق",
                  "التاجر الجشع",
                  "الفارس المغوار",
                ],
                correctIndex: 0,
              },
              {
                id: "q-4-4",
                text: "ما الهدف الأساسي من دراسة السيرة النبوية؟",
                options: [
                  "استخراج الدروس والقدوة العملية",
                  "الحفظ فقط دون فهم",
                  "للتسلية فقط",
                  "لا هدف واضح",
                ],
                correctIndex: 0,
              },
            ],
          },
        ],
        reports: [
          {
            id: "r-3",
            title: "تقرير أداء المولد والنشأة",
            attendance: "حاضر",
            participationScore: 10,
            examScore: 10,
            notes: "تفاعل متميز، استمر على هذا المستوى.",
          },
        ],
      },
    ],
  },
];

export function getCourseById(courseId) {
  return courses.find((course) => course.id === courseId) || null;
}

export function getExamById(courseId, examId) {
  const course = getCourseById(courseId);
  if (!course) return { course: null, lecture: null, exam: null };

  for (const lecture of course.lectures) {
    const exam = (lecture.exams || []).find((item) => item.id === examId);
    if (exam) return { course, lecture, exam };
  }
  return { course, lecture: null, exam: null };
}

export function recordExamResult(courseId, examId, score) {
  const { exam } = getExamById(courseId, examId);
  if (!exam) return;
  exam.status = "completed";
  exam.score = score;
}
